/**
 * Central error handler. Every thrown error — ApiError, Mongoose validation
 * errors, duplicate-key errors, or anything unexpected — ends up here as a
 * clean JSON response instead of a raw stack trace reaching the client.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong.";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(" ");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `That ${field} is already in use.`;
  }

  // Upload errors (file too large, etc.)
  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Passport photo must be 1.5 MB or smaller." : err.message;
  }

  // Malformed ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier supplied.";
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
