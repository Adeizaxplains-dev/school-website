import crypto from "crypto";
import User from "../models/User.js";
import Student from "../models/Student.js";
import SchoolClass from "../models/SchoolClass.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const POPULATE = [
  { path: "assignedClasses", select: "name" },
  { path: "assignedStudents", select: "firstName lastName admissionNumber photo" },
];

const teacherJSON = (t) => ({
  ...t.toSafeJSON(),
  assignedClasses: t.assignedClasses,
  assignedStudents: t.assignedStudents,
});

async function validateLinks(classIds = [], studentIds = []) {
  if (classIds.length && (await SchoolClass.countDocuments({ _id: { $in: classIds } })) !== classIds.length) {
    throw new ApiError(400, "One or more selected classes do not exist.");
  }
  if (studentIds.length && (await Student.countDocuments({ _id: { $in: studentIds } })) !== studentIds.length) {
    throw new ApiError(400, "One or more selected students do not exist.");
  }
}

/** GET /api/teachers (ADMIN) */
export const listTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: "STAFF" }).populate(POPULATE).sort({ name: 1 });
  res.json({ success: true, count: teachers.length, teachers: teachers.map(teacherJSON) });
});

/** POST /api/teachers (ADMIN) — creates the account with a one-time temporary password. */
export const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, phone, staffId, assignedClasses = [], assignedStudents = [] } = req.body;
  if (!name) throw new ApiError(400, "Teacher name is required.");
  if (!email && !phone) throw new ApiError(400, "Provide an email or a phone number.");
  await validateLinks(assignedClasses, assignedStudents);

  const temporaryPassword = crypto.randomBytes(5).toString("hex");
  const teacher = await User.create({
    name, email, phone, staffId, assignedClasses, assignedStudents,
    password: temporaryPassword, role: "STAFF", mustChangePassword: true,
  });
  await teacher.populate(POPULATE);
  res.status(201).json({ success: true, teacher: teacherJSON(teacher), temporaryPassword });
});

/** PUT /api/teachers/:id (ADMIN) — profile, active flag and class / student links. */
export const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await User.findOne({ _id: req.params.id, role: "STAFF" });
  if (!teacher) throw new ApiError(404, "Teacher not found.");

  const { name, email, phone, staffId, isActive, assignedClasses, assignedStudents } = req.body;
  await validateLinks(assignedClasses || [], assignedStudents || []);

  if (name !== undefined) teacher.name = name;
  if (email !== undefined) teacher.email = email || undefined;
  if (phone !== undefined) teacher.phone = phone || undefined;
  if (staffId !== undefined) teacher.staffId = staffId;
  if (isActive !== undefined) teacher.isActive = Boolean(isActive);
  if (assignedClasses) teacher.assignedClasses = assignedClasses;
  if (assignedStudents) teacher.assignedStudents = assignedStudents;

  await teacher.save();
  await teacher.populate(POPULATE);
  res.json({ success: true, teacher: teacherJSON(teacher) });
});

/** PUT /api/teachers/:id/reset-password (ADMIN) */
export const resetTeacherPassword = asyncHandler(async (req, res) => {
  const teacher = await User.findOne({ _id: req.params.id, role: "STAFF" });
  if (!teacher) throw new ApiError(404, "Teacher not found.");
  const temporaryPassword = crypto.randomBytes(5).toString("hex");
  teacher.password = temporaryPassword;
  teacher.mustChangePassword = true;
  await teacher.save();
  res.json({ success: true, temporaryPassword });
});
