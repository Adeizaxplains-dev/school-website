import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../middleware/ApiError.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/**
 * POST /api/auth/login
 * Accepts either email or phone as `identifier`, works for ADMIN, STAFF and PARENT alike.
 */
export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) throw new ApiError(400, "Email/phone and password are required.");

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Incorrect email/phone or password.");
  }
  if (!user.isActive) throw new ApiError(403, "This account has been deactivated. Contact the school.");

  user.lastLoginAt = new Date();
  await user.save();

  res.json({ success: true, token: signToken(user), user: user.toSafeJSON() });
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

/** PUT /api/auth/change-password */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    throw new ApiError(400, "Provide your current password and a new password of at least 8 characters.");
  }
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect.");
  }
  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();
  res.json({ success: true, message: "Password updated." });
});
