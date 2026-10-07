import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    audience: { type: String, enum: ["ALL", "PARENTS", "STAFF"], default: "ALL" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
