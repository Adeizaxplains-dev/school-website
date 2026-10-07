import mongoose from "mongoose";

const academicSessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }, // e.g. "2026/2027"
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("AcademicSession", academicSessionSchema);
