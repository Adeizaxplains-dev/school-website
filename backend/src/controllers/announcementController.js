import Announcement from "../models/Announcement.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listAnnouncements = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.user?.role === "PARENT") filter.audience = { $in: ["ALL", "PARENTS"] };
  if (req.user?.role === "STAFF") filter.audience = { $in: ["ALL", "STAFF"] };
  const announcements = await Announcement.find(filter).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, announcements });
});

export const listAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json({ success: true, announcements });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create(req.body);
  res.status(201).json({ success: true, announcement });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!announcement) throw new ApiError(404, "Announcement not found.");
  res.json({ success: true, announcement });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) throw new ApiError(404, "Announcement not found.");
  res.json({ success: true, message: "Announcement deleted." });
});
