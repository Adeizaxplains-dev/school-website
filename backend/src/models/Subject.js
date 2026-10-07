import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, trim: true, uppercase: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "SchoolClass" }], // which classes offer this subject
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
