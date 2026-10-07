import mongoose from "mongoose";

const termSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, enum: ["First Term", "Second Term", "Third Term"] },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicSession", required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

termSchema.index({ name: 1, session: 1 }, { unique: true });

export default mongoose.model("Term", termSchema);
