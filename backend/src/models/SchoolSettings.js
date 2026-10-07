import mongoose from "mongoose";

const gradeBandSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    grade: { type: String, required: true },
    remark: { type: String, default: "" },
  },
  { _id: false }
);

const DEFAULT_GRADING_SCALE = [
  { min: 70, max: 100, grade: "A", remark: "Excellent" },
  { min: 60, max: 69, grade: "B", remark: "Very Good" },
  { min: 50, max: 59, grade: "C", remark: "Good" },
  { min: 45, max: 49, grade: "D", remark: "Fair" },
  { min: 40, max: 44, grade: "E", remark: "Pass" },
  { min: 0, max: 39, grade: "F", remark: "Fail" },
];

// Singleton document — one row holds every school-configurable setting.
// This is what makes the codebase reusable: no school identity is hard-coded
// in components, it all comes from here (seeded/edited per installation).
const schoolSettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, default: "[School Name]" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    primaryColor: { type: String, default: "#123B6D" },
    secondaryColor: { type: String, default: "#C9A227" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      x: { type: String, default: "" },
    },
    about: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    features: {
      onlinePayment: { type: Boolean, default: true },
      parentPortal: { type: Boolean, default: true },
      results: { type: Boolean, default: true },
      admissions: { type: Boolean, default: true },
      gallery: { type: Boolean, default: true },
      news: { type: Boolean, default: false },
    },
    allowPartialPayment: { type: Boolean, default: true },
    // When true, admin cannot publish a result until that term's invoice is fully paid.
    requirePaidFeesToPublish: { type: Boolean, default: true },
    gradingScale: { type: [gradeBandSchema], default: DEFAULT_GRADING_SCALE },
  },
  { timestamps: true }
);

schoolSettingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

export { DEFAULT_GRADING_SCALE };
export default mongoose.model("SchoolSettings", schoolSettingsSchema);
