import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // The Paystack transaction reference is the idempotency key: a unique index
    // means the same reference can never be recorded as a payment twice, no
    // matter how many times the frontend or the webhook call verify/handle it.
    reference: { type: String, required: true, unique: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 }, // naira, stored as a whole number
    gateway: { type: String, default: "paystack" },
    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true },
    paidAt: { type: Date },
    channel: { type: String }, // card, bank, ussd, etc. — from Paystack
    gatewayResponse: { type: String }, // human-readable message from Paystack
    raw: { type: mongoose.Schema.Types.Mixed }, // trimmed Paystack response, for audit/receipts
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
