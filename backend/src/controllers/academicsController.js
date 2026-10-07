import SchoolClass from "../models/SchoolClass.js";
import AcademicSession from "../models/AcademicSession.js";
import Term from "../models/Term.js";
import Subject from "../models/Subject.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/* ---------------------------- Classes ---------------------------- */

export const listClasses = asyncHandler(async (req, res) => {
  const filter = req.user.role === "STAFF" ? { _id: { $in: req.user.assignedClasses || [] } } : {};
  const classes = await SchoolClass.find(filter).sort({ order: 1, name: 1 });
  res.json({ success: true, classes });
});

export const createClass = asyncHandler(async (req, res) => {
  const schoolClass = await SchoolClass.create(req.body);
  res.status(201).json({ success: true, schoolClass });
});

export const updateClass = asyncHandler(async (req, res) => {
  const schoolClass = await SchoolClass.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!schoolClass) throw new ApiError(404, "Class not found.");
  res.json({ success: true, schoolClass });
});

export const deleteClass = asyncHandler(async (req, res) => {
  const schoolClass = await SchoolClass.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!schoolClass) throw new ApiError(404, "Class not found.");
  res.json({ success: true, message: "Class archived." });
});

/* ------------------------ Sessions & Terms ------------------------ */

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await AcademicSession.find().sort({ name: -1 });
  res.json({ success: true, sessions });
});

export const createSession = asyncHandler(async (req, res) => {
  const session = await AcademicSession.create(req.body);
  res.status(201).json({ success: true, session });
});

/** PUT /api/sessions/:id/activate — makes this session active and deactivates every other one. */
export const activateSession = asyncHandler(async (req, res) => {
  const session = await AcademicSession.findById(req.params.id);
  if (!session) throw new ApiError(404, "Session not found.");
  await AcademicSession.updateMany({ _id: { $ne: session._id } }, { isActive: false });
  session.isActive = true;
  await session.save();
  res.json({ success: true, session });
});

export const listTerms = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.session) filter.session = req.query.session;
  const terms = await Term.find(filter).populate("session", "name").sort({ createdAt: -1 });
  res.json({ success: true, terms });
});

export const createTerm = asyncHandler(async (req, res) => {
  const term = await Term.create(req.body);
  res.status(201).json({ success: true, term });
});

/** PUT /api/terms/:id/activate — makes this term active within its session, deactivating siblings. */
export const activateTerm = asyncHandler(async (req, res) => {
  const term = await Term.findById(req.params.id);
  if (!term) throw new ApiError(404, "Term not found.");
  await Term.updateMany({ session: term.session, _id: { $ne: term._id } }, { isActive: false });
  term.isActive = true;
  await term.save();
  res.json({ success: true, term });
});

/* ------------------------------ Subjects ------------------------------ */

export const listSubjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.class) filter.classes = req.query.class;
  const subjects = await Subject.find(filter).sort({ name: 1 });
  res.json({ success: true, subjects });
});

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, subject });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!subject) throw new ApiError(404, "Subject not found.");
  res.json({ success: true, subject });
});
