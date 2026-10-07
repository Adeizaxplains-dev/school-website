import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["ADMIN", "STAFF", "PARENT"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, required: true, default: "PARENT" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    // Admin-created accounts get a temporary password the person must replace.
    mustChangePassword: { type: Boolean, default: false },

    // STAFF (teacher) only. A teacher sees the students of every class assigned
    // to them, plus any individual students the admin links to them explicitly.
    staffId: { type: String, trim: true },
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "SchoolClass" }],
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

userSchema.pre("validate", function nextFn(next) {
  if (!this.email && !this.phone) {
    return next(new Error("A user needs an email or a phone number."));
  }
  next();
});

userSchema.pre("save", async function nextFn(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const { _id, name, email, phone, role, isActive, createdAt, mustChangePassword, staffId } = this;
  return { id: _id, name, email, phone, role, isActive, createdAt, mustChangePassword, staffId };
};

export const ROLE_VALUES = ROLES;
export default mongoose.model("User", userSchema);
