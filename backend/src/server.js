import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import academicsRoutes from "./routes/academicsRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import { UPLOAD_ROOT } from "./middleware/upload.js";

const app = express();

// Passport photos are served to the frontend on another origin, so allow cross-origin image loads.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Capture the raw body alongside the parsed one — the Paystack webhook needs
// the exact raw bytes to verify its HMAC signature.
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// General API rate limit. Login gets a tighter one to slow down credential stuffing.
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

// Uploaded passport photos (public URLs are unguessable: <studentId>-<timestamp>.<ext>)
app.use("/uploads", express.static(UPLOAD_ROOT, { index: false, maxAge: "7d" }));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api", academicsRoutes); // /api/classes, /api/sessions, /api/terms, /api/subjects
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  });

export default app;
