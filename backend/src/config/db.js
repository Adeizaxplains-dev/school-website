import mongoose from "mongoose";

/**
 * One school, one database. No tenant scoping anywhere in this codebase —
 * a new school installation points MONGODB_URI at its own database.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy backend/.env.example to backend/.env and fill it in.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log(`[db] connected -> ${mongoose.connection.name}`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err.message);
  });

  return mongoose.connection;
}
