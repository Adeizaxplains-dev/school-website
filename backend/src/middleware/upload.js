
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep legacy local paths available during migration.
export const UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
export const PASSPORT_DIR = path.join(UPLOAD_ROOT, "passports");
fs.mkdirSync(PASSPORT_DIR, { recursive: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const passportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1.5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (EXT[file.mimetype]) return cb(null, true);
    cb(new ApiError(400, "Passport must be a JPG, PNG or WebP image."));
  },
}).single("photo");

/**
 * Upload a validated passport image buffer to Cloudinary.
 */
export function uploadPassportToCloudinary(file, studentId) {
  if (!file?.buffer) {
    return Promise.reject(new ApiError(400, "Choose a passport photo to upload."));
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return Promise.reject(
      new ApiError(500, "Passport image storage is not configured.")
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "school-website/passports",
        public_id: `${studentId}-${Date.now()}`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error("Cloudinary did not return an image URL."));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
}

/**
 * Removes a Cloudinary passport URL or a legacy local passport path.
 * Does not delete arbitrary local files or unrelated Cloudinary assets.
 */
export async function removePassportFile(publicPath) {
  if (!publicPath) return;

  if (/^https?:\/\//i.test(publicPath)) {
    try {
      const url = new URL(publicPath);
      if (
        !["res.cloudinary.com", "cloudinary.com"].includes(url.hostname) ||
        !url.pathname.includes("/image/upload/")
      ) {
        return;
      }

      const uploadPart = url.pathname.split("/image/upload/")[1];
      if (!uploadPart) return;

      const withoutTransformations = uploadPart.replace(
        /^[^/]+\/(?=v\d+\/)/,
        ""
      );
      const withoutVersion = withoutTransformations.replace(/^v\d+\//, "");
      const publicId = withoutVersion.replace(/\.[^.\/]+$/, "");

      if (!publicId.startsWith("school-website/passports/")) return;

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });
    } catch (error) {
      console.error("Could not remove Cloudinary passport:", error.message);
    }
    return;
  }

  if (!publicPath.startsWith("/uploads/passports/")) return;

  const file = path.join(PASSPORT_DIR, path.basename(publicPath));

  try {
    await fs.promises.unlink(file);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Could not remove legacy passport:", error.message);
    }
  }
}