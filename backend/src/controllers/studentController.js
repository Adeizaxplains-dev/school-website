import Student from "../models/Student.js";
import User from "../models/User.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { studentFilterFor, assertCanAccessStudent } from "../middleware/scope.js";
import {
  removePassportFile,
  uploadPassportToCloudinary,
} from "../middleware/upload.js";

const POPULATE = [
  { path: "class", select: "name" },
  { path: "parent", select: "name email phone" },
];

// Fields an admin may set directly. Anything else in the body is ignored.
const EDITABLE = ["admissionNumber", "firstName", "middleName", "lastName", "gender", "dateOfBirth", "class", "parent", "phone", "address", "status"];
const pick = (body) => Object.fromEntries(EDITABLE.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

/** GET /api/students — scoped: admin all, staff assigned, parent own children. */
export const listStudents = asyncHandler(async (req, res) => {
  const filter = studentFilterFor(req.user);
  if (req.query.class) filter.class = req.query.class;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.parent && req.user.role === "ADMIN") filter.parent = req.query.parent;

  const students = await Student.find(filter).populate(POPULATE).sort({ lastName: 1, firstName: 1 });
  res.json({ success: true, count: students.length, students });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate(POPULATE);
  if (!student) throw new ApiError(404, "Student not found.");
  assertCanAccessStudent(req.user, student);
  res.json({ success: true, student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  const parentUser = await User.findOne({ _id: data.parent, role: "PARENT" });
  if (!parentUser) throw new ApiError(400, "That parent account was not found.");
  const student = await Student.create({ ...data, parent: parentUser._id });
  await student.populate(POPULATE);
  res.status(201).json({ success: true, student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (data.parent) {
    const parentUser = await User.findOne({ _id: data.parent, role: "PARENT" });
    if (!parentUser) throw new ApiError(400, "That parent account was not found.");
  }
  const student = await Student.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate(POPULATE);
  if (!student) throw new ApiError(404, "Student not found.");
  res.json({ success: true, student });
});

/** PUT /api/students/:id/photo — multipart field "photo". Replaces any previous passport. */

/** PUT /api/students/:id/photo — multipart field "photo". */
export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Choose a passport photo to upload.");
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const uploaded = await uploadPassportToCloudinary(
    req.file,
    student._id.toString()
  );

  const previous = student.photo;
  student.photo = uploaded.url;

  try {
    await student.save();
  } catch (error) {
    // Avoid leaving an unreferenced Cloudinary image if saving fails.
    await removePassportFile(uploaded.url);
    throw error;
  }

  // Remove the old image only after the new URL has been saved.
  if (previous && previous !== uploaded.url) {
    await removePassportFile(previous);
  }

  await student.populate(POPULATE);

  res.json({ success: true, student });
});


export const removePhoto = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const previous = student.photo;

  student.photo = "";
  await student.save();

  if (previous) {
    await removePassportFile(previous);
  }

  await student.populate(POPULATE);

  res.json({ success: true, student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { status: "INACTIVE" }, { new: true });
  if (!student) throw new ApiError(404, "Student not found.");
  res.json({ success: true, message: "Student deactivated.", student });
});
