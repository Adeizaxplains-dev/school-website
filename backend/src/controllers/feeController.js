import FeeStructure from "../models/FeeStructure.js";
import Invoice from "../models/Invoice.js";
import Student from "../models/Student.js";
import SchoolSettings from "../models/SchoolSettings.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/* ---------------------------- Fee structures ---------------------------- */

export const listFeeStructures = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.session) filter.session = req.query.session;
  if (req.query.term) filter.term = req.query.term;
  if (req.query.class) filter.class = req.query.class;

  const feeStructures = await FeeStructure.find(filter)
    .populate("session", "name")
    .populate("term", "name")
    .populate("class", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, feeStructures });
});

export const createFeeStructure = asyncHandler(async (req, res) => {
  const feeStructure = await FeeStructure.create(req.body);
  res.status(201).json({ success: true, feeStructure });
});

export const updateFeeStructure = asyncHandler(async (req, res) => {
  const feeStructure = await FeeStructure.findById(req.params.id);
  if (!feeStructure) throw new ApiError(404, "Fee structure not found.");
  Object.assign(feeStructure, req.body);
  await feeStructure.save(); // triggers totalAmount recompute
  res.json({ success: true, feeStructure });
});

/* -------------------------------- Invoices -------------------------------- */

function invoiceNumber() {
  return `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

/**
 * POST /api/invoices/generate
 * Body: { feeStructureId, studentIds: [] } — or studentIds omitted to invoice
 * every active student in the fee structure's class.
 * Fee items are snapshotted onto each invoice at creation time.
 */
export const generateInvoices = asyncHandler(async (req, res) => {
  const { feeStructureId, studentIds } = req.body;
  const feeStructure = await FeeStructure.findById(feeStructureId);
  if (!feeStructure) throw new ApiError(404, "Fee structure not found.");

  const studentFilter = studentIds?.length
    ? { _id: { $in: studentIds }, class: feeStructure.class, status: "ACTIVE" }
    : { class: feeStructure.class, status: "ACTIVE" };
  const students = await Student.find(studentFilter);

  const created = [];
  const skipped = [];

  for (const student of students) {
    const exists = await Invoice.findOne({
      student: student._id,
      session: feeStructure.session,
      term: feeStructure.term,
    });
    if (exists) {
      skipped.push({ student: student._id, reason: "Invoice already exists for this term." });
      continue;
    }
    const invoice = await Invoice.create({
      invoiceNumber: invoiceNumber(),
      student: student._id,
      parent: student.parent,
      session: feeStructure.session,
      term: feeStructure.term,
      feeStructure: feeStructure._id,
      items: feeStructure.items,
      totalAmount: feeStructure.totalAmount,
      amountPaid: 0,
      balance: feeStructure.totalAmount,
      status: "UNPAID",
    });
    created.push(invoice);
  }

  res.status(201).json({ success: true, created: created.length, skipped, invoices: created });
});

export const listInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "PARENT") filter.parent = req.user._id;
  if (req.query.student) filter.student = req.query.student;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.session) filter.session = req.query.session;
  if (req.query.term) filter.term = req.query.term;

  const invoices = await Invoice.find(filter)
    .populate("student", "firstName lastName admissionNumber")
    .populate("session", "name")
    .populate("term", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, invoices });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("student", "firstName lastName admissionNumber class")
    .populate("session", "name")
    .populate("term", "name");
  if (!invoice) throw new ApiError(404, "Invoice not found.");
  if (req.user.role === "PARENT" && String(invoice.parent) !== String(req.user._id)) {
    throw new ApiError(403, "You can only view your own invoices.");
  }
  res.json({ success: true, invoice });
});

/** Exposed so the parent portal can check whether partial payment is allowed before offering it. */
export const getPaymentPolicy = asyncHandler(async (req, res) => {
  const settings = await SchoolSettings.getSingleton();
  res.json({ success: true, allowPartialPayment: settings.allowPartialPayment });
});
