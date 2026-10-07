import SchoolSettings from "../models/SchoolSettings.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/** GET /api/settings — public. Powers the public website's config the same way school.config.js used to. */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SchoolSettings.getSingleton();
  res.json({ success: true, settings });
});

/** PUT /api/settings — ADMIN only. Partial updates are merged, not replaced. */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SchoolSettings.getSingleton();
  const ALLOWED = ["schoolName", "logo", "favicon", "primaryColor", "secondaryColor", "address", "phone", "email", "whatsapp",
    "social", "about", "mission", "vision", "features", "allowPartialPayment", "requirePaidFeesToPublish", "gradingScale"];
  for (const key of ALLOWED) if (req.body[key] !== undefined) settings[key] = req.body[key];
  await settings.save();
  res.json({ success: true, settings });
});
