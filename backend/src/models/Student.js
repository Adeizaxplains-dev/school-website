import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    admissionNumber: { type: String, required: true, trim: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dateOfBirth: { type: Date },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "SchoolClass", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "GRADUATED"], default: "ACTIVE" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

studentSchema.virtual("fullName").get(function fullName() {
  return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");
});
studentSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Student", studentSchema);
