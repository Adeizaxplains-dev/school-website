import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { ApiError } from "./ApiError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
export const PASSPORT_DIR = path.join(UPLOAD_ROOT, "passports");
fs.mkdirSync(PASSPORT_DIR, { recursive: true });

// Extension comes from the verified MIME type, never from the client's filename.
const EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

export const passportUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, PASSPORT_DIR),
    filename: (req, file, cb) => cb(null, `${req.params.id}-${Date.now()}${EXT[file.mimetype]}`),
  }),
  limits: { fileSize: 1.5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new ApiError(400, "Passport must be a JPG, PNG or WebP image.")),
}).single("photo");

/** Removes a previously stored passport (ignores anything outside /uploads/passports). */
export function removePassportFile(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/passports/")) return;
  const file = path.join(PASSPORT_DIR, path.basename(publicPath));
  fs.promises.unlink(file).catch(() => {});
}
