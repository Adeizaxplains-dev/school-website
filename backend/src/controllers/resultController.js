import Result from "../models/Result.js";
import Student from "../models/Student.js";
import SchoolSettings from "../models/SchoolSettings.js";
import Invoice from "../models/Invoice.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { studentFilterFor, assertCanAccessStudent, canAccessStudent } from "../middleware/scope.js";

const STUDENT_FIELDS = "firstName middleName lastName admissionNumber gender dateOfBirth parent class photo";

const populateResult = (query) =>
  query
    .populate({ path: "student", select: STUDENT_FIELDS, populate: { path: "parent", select: "name" } })
    .populate("class", "name")
    .populate("session", "name")
    .populate("term", "name")
    .populate("subjects.subject", "name")
    .populate("preparedBy", "name");

const log = (result, user, action, note = "") =>
  result.history.push({ action, by: user._id, byName: user.name, note, at: new Date() });

/** Applies the school's grading scale to a total score. */
function gradeFor(total, scale) {
  const band = scale.find((b) => total >= b.min && total <= b.max);
  return band ? { grade: band.grade, remark: band.remark } : { grade: "", remark: "" };
}

/** CA1 /20 + CA2 /20 + Exam /60 = Total /100, with grade + remark from the configured scale. */
async function computeSubjects(subjects) {
  const settings = await SchoolSettings.getSingleton();
  const seen = new Set();

  return subjects.map((s) => {
    if (!s.subject) throw new ApiError(400, "Every row needs a subject.");
    if (seen.has(String(s.subject))) throw new ApiError(400, "A subject appears more than once.");
    seen.add(String(s.subject));

    const ca1 = Number(s.ca1 || 0);
    const ca2 = Number(s.ca2 || 0);
    const exam = Number(s.exam || 0);
    if (![ca1, ca2, exam].every(Number.isFinite)) throw new ApiError(400, "Scores must be numbers.");
    if (ca1 < 0 || ca1 > 20) throw new ApiError(400, "CA1 must be between 0 and 20.");
    if (ca2 < 0 || ca2 > 20) throw new ApiError(400, "CA2 must be between 0 and 20.");
    if (exam < 0 || exam > 60) throw new ApiError(400, "Exam must be between 0 and 60.");

    const total = ca1 + ca2 + exam;
    const { grade, remark } = gradeFor(total, settings.gradingScale);
    return { subject: s.subject, ca1, ca2, exam, total, grade, remark: s.remark || remark };
  });
}

const average = (subjects) =>
  subjects.length ? Math.round((subjects.reduce((sum, s) => sum + s.total, 0) / subjects.length) * 100) / 100 : 0;

/**
 * GET /api/results
 * ADMIN: all (filterable). STAFF: only students in their scope. PARENT: only PUBLISHED, own children.
 */
export const listResults = asyncHandler(async (req, res) => {
  const filter = {};
  for (const key of ["student", "class", "session", "term"]) if (req.query[key]) filter[key] = req.query[key];

  if (req.user.role !== "ADMIN") {
    const allowedIds = await Student.find(studentFilterFor(req.user)).distinct("_id");
    filter.student = req.query.student
      ? { $in: allowedIds.filter((id) => String(id) === String(req.query.student)) }
      : { $in: allowedIds };
  }
  if (req.user.role === "PARENT") filter.status = "PUBLISHED";
  else if (req.query.status) filter.status = req.query.status;

  const results = await populateResult(Result.find(filter)).sort({ updatedAt: -1 });
  res.json({ success: true, count: results.length, results });
});

/** GET /api/results/:id */
export const getResult = asyncHandler(async (req, res) => {
  const result = await populateResult(Result.findById(req.params.id));
  if (!result) throw new ApiError(404, "Result not found.");

  if (!result.student || !canAccessStudent(req.user, result.student)) {
    throw new ApiError(403, "You do not have access to this result.");
  }
  if (req.user.role === "PARENT" && result.status !== "PUBLISHED") {
    throw new ApiError(403, "This result has not been published yet.");
  }
  res.json({ success: true, result });
});

/**
 * POST /api/results — create or update a result for one student/session/term.
 * STAFF: only their students, only while DRAFT or RETURNED.
 * ADMIN: may also correct a SUBMITTED result during review.
 */
export const upsertResult = asyncHandler(async (req, res) => {
  const { student: studentId, session, term, subjects, teacherComment, principalComment } = req.body;
  if (!studentId || !session || !term) throw new ApiError(400, "Student, session and term are required.");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found.");
  assertCanAccessStudent(req.user, student);

  const payload = Array.isArray(subjects) ? subjects : [];
  if (!payload.length) throw new ApiError(400, "At least one subject is required.");

  let result = await Result.findOne({ student: student._id, session, term });
  const isStaff = req.user.role === "STAFF";

  if (result) {
    if (result.status === "PUBLISHED") {
      throw new ApiError(400, "This result is published. Ask the administrator to unpublish it first.");
    }
    if (result.status === "SUBMITTED" && isStaff) {
      throw new ApiError(400, "This result is with the administrator for review.");
    }
  }

  const computed = await computeSubjects(payload);
  const fields = { subjects: computed, average: average(computed), class: student.class };
  if (teacherComment !== undefined) fields.teacherComment = teacherComment;
  if (!isStaff && principalComment !== undefined) fields.principalComment = principalComment; // principal's remark is admin-only

  if (result) {
    Object.assign(result, fields);
    if (!result.preparedBy && isStaff) result.preparedBy = req.user._id;
    log(result, req.user, isStaff ? "SAVED" : "EDITED_BY_ADMIN");
  } else {
    result = new Result({ student: student._id, session, term, ...fields, status: "DRAFT", preparedBy: isStaff ? req.user._id : undefined });
    log(result, req.user, "CREATED");
  }

  await result.save();
  const populated = await populateResult(Result.findById(result._id));
  res.status(201).json({ success: true, result: populated });
});

/** Shared submit logic: DRAFT/RETURNED -> SUBMITTED. */
async function submitOne(result, user) {
  if (!["DRAFT", "RETURNED"].includes(result.status)) {
    throw new ApiError(400, `Only draft or returned results can be submitted. Current status: ${result.status}.`);
  }
  if (!result.subjects.length) throw new ApiError(400, "Add at least one subject score before submitting.");
  result.status = "SUBMITTED";
  result.submittedAt = new Date();
  result.returnReason = "";
  log(result, user, "SUBMITTED");
  await result.save();
}

async function loadScoped(id, user) {
  const result = await Result.findById(id);
  if (!result) throw new ApiError(404, "Result not found.");
  const student = await Student.findById(result.student);
  assertCanAccessStudent(user, student);
  return result;
}

/** PUT /api/results/:id/submit */
export const submitResult = asyncHandler(async (req, res) => {
  const result = await loadScoped(req.params.id, req.user);
  await submitOne(result, req.user);
  res.json({
    success: true,
    message: "Result submitted to the administrator for review.",
    result: await populateResult(Result.findById(result._id)),
  });
});

/** PUT /api/results/submit-batch  { ids: [...] } — submit every eligible draft at once. */
export const submitBatch = asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  if (!ids.length) throw new ApiError(400, "Select at least one result to submit.");
  let submitted = 0;
  const skipped = [];
  for (const id of ids) {
    try {
      await submitOne(await loadScoped(id, req.user), req.user);
      submitted += 1;
    } catch (err) {
      skipped.push({ id, reason: err.message });
    }
  }
  res.json({ success: true, submitted, skipped, message: `${submitted} result(s) submitted for review.` });
});

/** PUT /api/results/:id/return-to-staff  { reason } — ADMIN sends a submitted result back. */
export const returnResultToStaff = asyncHandler(async (req, res) => {
  const reason = String(req.body.reason || "").trim();
  if (reason.length < 5) throw new ApiError(400, "Tell the teacher what needs correcting (at least a short sentence).");

  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found.");
  if (result.status !== "SUBMITTED") throw new ApiError(400, "Only submitted results can be returned to staff.");

  result.status = "RETURNED";
  result.returnReason = reason;
  result.submittedAt = undefined;
  log(result, req.user, "RETURNED", reason);
  await result.save();
  res.json({
    success: true,
    message: "Result returned to the teacher for correction.",
    result: await populateResult(Result.findById(result._id)),
  });
});

/** PUT /api/results/:id/publish — ADMIN approves a submitted result so parents can see it. */
export const publishResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found.");
  if (result.status !== "SUBMITTED") throw new ApiError(400, "Only submitted results can be approved and published.");

  const settings = await SchoolSettings.getSingleton();
  if (settings.requirePaidFeesToPublish) {
    const invoice = await Invoice.findOne({ student: result.student, session: result.session, term: result.term });
    if (!invoice) throw new ApiError(400, "This student has no invoice for this term, so fee status cannot be confirmed.");
    if (invoice.status !== "PAID") {
      throw new ApiError(400, "School fees for this term are not fully paid. Settle the invoice (or switch off the fee rule in Settings) to publish.");
    }
  }

  result.status = "PUBLISHED";
  result.publishedAt = new Date();
  result.returnReason = "";
  log(result, req.user, "PUBLISHED");
  await result.save();
  res.json({
    success: true,
    message: "Result approved and published to the parent portal.",
    result: await populateResult(Result.findById(result._id)),
  });
});

/** PUT /api/results/:id/unpublish — ADMIN pulls a published result back into the review queue. */
export const unpublishResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found.");
  if (result.status !== "PUBLISHED") throw new ApiError(400, "Only published results can be unpublished.");

  result.status = "SUBMITTED";
  result.publishedAt = undefined;
  log(result, req.user, "UNPUBLISHED", String(req.body.reason || ""));
  await result.save();
  res.json({
    success: true,
    message: "Result unpublished and returned to the review queue.",
    result: await populateResult(Result.findById(result._id)),
  });
});
