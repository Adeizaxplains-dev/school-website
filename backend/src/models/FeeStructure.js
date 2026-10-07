import mongoose from "mongoose";

const feeItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "Tuition", "Books", ...
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession", required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: "Term", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "SchoolClass", required: true },
    items: { type: [feeItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

feeStructureSchema.index({ session: 1, term: 1, class: 1 }, { unique: true });

feeStructureSchema.pre("save", function nextFn(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.amount, 0);
  next();
});

export default mongoose.model("FeeStructure", feeStructureSchema);
