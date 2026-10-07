import crypto from "crypto";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import SchoolSettings from "../models/SchoolSettings.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { initializeTransaction, verifyTransaction, verifyWebhookSignature } from "../services/paystack.js";

/**
 * Records a Paystack-verified SUCCESS transaction against its invoice.
 * Idempotent: if a Payment with this reference already exists, does nothing
 * further and just returns it — this is what makes it safe to call this both
 * from the client-triggered /verify call AND the webhook for the same reference.
 */
async function recordVerifiedPayment(verification) {
  const existing = await Payment.findOne({ reference: verification.reference });
  if (existing) return existing;

  if (verification.status !== "success") {
    return Payment.create({
      reference: verification.reference,
      invoice: verification.metadata?.invoiceId,
      student: verification.metadata?.studentId,
      parent: verification.metadata?.parentId,
      amount: verification.amount / 100,
      status: "FAILED",
      gatewayResponse: verification.gateway_response,
      raw: { channel: verification.channel, ip_address: verification.ip_address },
    });
  }

  const invoice = await Invoice.findById(verification.metadata?.invoiceId);
  if (!invoice) throw new ApiError(404, "The invoice for this payment could not be found.");

  const amountNaira = verification.amount / 100;
  invoice.applyPayment(amountNaira);
  await invoice.save();

  return Payment.create({
    reference: verification.reference,
    invoice: invoice._id,
    student: invoice.student,
    parent: invoice.parent,
    amount: amountNaira,
    status: "SUCCESS",
    paidAt: verification.paid_at ? new Date(verification.paid_at) : new Date(),
    channel: verification.channel,
    gatewayResponse: verification.gateway_response,
    raw: { authorization: verification.authorization?.authorization_code },
  });
}

/**
 * POST /api/payments/initialize
 * Body: { invoiceId, amount? } — amount in naira; omit to pay the full balance.
 * Parent-only in practice (an admin recording an offline payment is a separate flow).
 */
export const initializePayment = asyncHandler(async (req, res) => {
  const { invoiceId, amount } = req.body;
  if (req.user.role !== "PARENT") {
    throw new ApiError(403, "Only parent accounts can initiate online fee payments.");
  }
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new ApiError(404, "Invoice not found.");
  if (String(invoice.parent) !== String(req.user._id) && req.user.role === "PARENT") {
    throw new ApiError(403, "You can only pay your own invoices.");
  }
  if (invoice.balance <= 0) throw new ApiError(400, "This invoice is already fully paid.");

  const settings = await SchoolSettings.getSingleton();
  let payAmount = invoice.balance;
  if (amount != null) {
    if (!settings.allowPartialPayment) {
      throw new ApiError(400, "Partial payment is not enabled. Please pay the full balance.");
    }
    if (amount <= 0 || amount > invoice.balance) {
      throw new ApiError(400, "Payment amount must be greater than zero and not exceed the balance.");
    }
    payAmount = amount;
  }

  const parent = await User.findById(invoice.parent);
  const reference = `SCH-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

  const transaction = await initializeTransaction({
    email: parent.email || `${parent.phone}@no-email.invalid`,
    amountKobo: Math.round(payAmount * 100),
    reference,
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
    metadata: { invoiceId: invoice._id.toString(), studentId: invoice.student.toString(), parentId: parent._id.toString() },
  });

  res.json({ success: true, authorizationUrl: transaction.authorization_url, reference: transaction.reference });
});

/** GET /api/payments/verify/:reference — client calls this right after Paystack redirects back. */
export const verifyPayment = asyncHandler(async (req, res) => {
  const verification = await verifyTransaction(req.params.reference);
  const payment = await recordVerifiedPayment(verification);
  res.json({ success: true, status: payment.status, payment });
});

/**
 * POST /api/payments/webhook — Paystack's server calls this directly.
 * The signature check is the only thing that authenticates this request;
 * there is no JWT here, and the raw body must be used exactly as received.
 */
export const paystackWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  const isValid = signature && verifyWebhookSignature(req.rawBody, signature);
  if (!isValid) return res.status(401).end();

  const event = req.body;
  if (event.event === "charge.success") {
    const verification = await verifyTransaction(event.data.reference); // re-verify, never trust the payload alone
    await recordVerifiedPayment(verification);
  }
  res.status(200).end();
});

export const listPayments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "PARENT") filter.parent = req.user._id;
  if (req.query.student) filter.student = req.query.student;

  const payments = await Payment.find(filter)
    .populate("student", "firstName lastName admissionNumber")
    .populate("invoice", "invoiceNumber")
    .sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

/** GET /api/payments/:id — used to render a single printable receipt. */
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("student", "firstName lastName admissionNumber")
    .populate("invoice", "invoiceNumber session term")
    .populate("parent", "name email phone");
  if (!payment) throw new ApiError(404, "Payment not found.");
  if (req.user.role === "PARENT" && String(payment.parent._id) !== String(req.user._id)) {
    throw new ApiError(403, "You can only view your own receipts.");
  }
  res.json({ success: true, payment });
});
