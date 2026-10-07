import crypto from "crypto";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/** GET /api/parents (ADMIN/STAFF only) */
export const listParents = asyncHandler(async (req, res) => {
  const parents = await User.find({ role: "PARENT" }).sort({ createdAt: -1 });
  res.json({ success: true, count: parents.length, parents: parents.map((p) => p.toSafeJSON()) });
});

export const getParent = asyncHandler(async (req, res) => {
  const parent = await User.findOne({ _id: req.params.id, role: "PARENT" });
  if (!parent) throw new ApiError(404, "Parent not found.");
  const children = await Student.find({ parent: parent._id }).populate("class", "name");
  res.json({ success: true, parent: parent.toSafeJSON(), children });
});

/** POST /api/parents — admin creates a parent account; a temporary password is generated. */
export const createParent = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name) throw new ApiError(400, "Parent name is required.");
  if (!email && !phone) throw new ApiError(400, "Provide an email or a phone number for the parent.");

  const tempPassword = password || crypto.randomBytes(4).toString("hex");
  const parent = await User.create({ name, email, phone, password: tempPassword, role: "PARENT" });

  res.status(201).json({
    success: true,
    parent: parent.toSafeJSON(),
    // Returned once so the admin can hand it to the parent — never retrievable again.
    temporaryPassword: password ? undefined : tempPassword,
  });
});

export const updateParent = asyncHandler(async (req, res) => {
  const { name, email, phone, isActive } = req.body;
  const parent = await User.findOneAndUpdate(
    { _id: req.params.id, role: "PARENT" },
    { name, email, phone, isActive },
    { new: true, runValidators: true }
  );
  if (!parent) throw new ApiError(404, "Parent not found.");
  res.json({ success: true, parent: parent.toSafeJSON() });
});

/** PUT /api/parents/:id/reset-password (ADMIN) */
export const resetParentPassword = asyncHandler(async (req, res) => {
  const parent = await User.findOne({ _id: req.params.id, role: "PARENT" });
  if (!parent) throw new ApiError(404, "Parent not found.");
  const tempPassword = crypto.randomBytes(4).toString("hex");
  parent.password = tempPassword;
  await parent.save();
  res.json({ success: true, temporaryPassword: tempPassword });
});

/** GET /api/parents/:id/payments */
export const getParentPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ parent: req.params.id })
    .populate("student", "firstName lastName admissionNumber")
    .populate("invoice", "invoiceNumber")
    .sort({ createdAt: -1 });
  res.json({ success: true, payments });
});
