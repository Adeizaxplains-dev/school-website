import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  { name: { type: String, required: true }, amount: { type: Number, required: true, min: 0 } },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession", required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: "Term", required: true },
    feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: "FeeStructure" },
    // Items are snapshotted from the fee structure at generation time, so a later
    // fee structure edit never silently changes an invoice that already exists.
    items: { type: [invoiceItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balance: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["UNPAID", "PARTIALLY_PAID", "PAID"], default: "UNPAID" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

invoiceSchema.index({ student: 1, session: 1, term: 1 }, { unique: true });

/** Recompute amountPaid / balance / status from a running total. Called after every payment. */
invoiceSchema.methods.applyPayment = function applyPayment(amount) {
  this.amountPaid = Math.min(this.totalAmount, this.amountPaid + amount);
  this.balance = Math.max(0, this.totalAmount - this.amountPaid);
  this.status = this.balance === 0 ? "PAID" : this.amountPaid > 0 ? "PARTIALLY_PAID" : "UNPAID";
};

export default mongoose.model("Invoice", invoiceSchema);
