import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

/** Requires a valid JWT. Attaches the authenticated, active user to req.user. */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new ApiError(401, "Not authenticated. Please log in.");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isActive) throw new ApiError(401, "This account is no longer active.");

  req.user = user;
  next();
});

/** Restricts a route to specific roles. Use after `protect`. */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, "You do not have permission to perform this action.");
  }
  next();
};

/**
 * For PARENT-scoped resources: ensures the logged-in parent can only reach
 * their own data. ADMIN/STAFF bypass this check entirely.
 */
export const ownParentOnly = (parentIdGetter) => (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.role === "STAFF") return next();
  const targetParentId = parentIdGetter(req);
  if (String(targetParentId) !== String(req.user._id)) {
    throw new ApiError(403, "You can only view your own account's information.");
  }
  next();
};
