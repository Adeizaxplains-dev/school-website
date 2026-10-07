import mongoose from "mongoose";

// Named SchoolClass (not Class) to avoid clashing with the JS reserved word,
// and to be unambiguous alongside AcademicSession / Term.
const schoolClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }, // e.g. "JSS 2"
    order: { type: Number, default: 0 }, // for sorting Nursery -> SSS3
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SchoolClass", schoolClassSchema);
