import mongoose from "mongoose";

declare global {
  var mongoose:
    | {
        conn: unknown | null;
        promise: Promise<unknown> | null;
      }
    | undefined;
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dazzling-tours";

// Log connection type without exposing credentials
const isAtlas = MONGODB_URI.includes("mongodb+srv://");
console.log(`🔍 MongoDB: ${isAtlas ? "Atlas (Cloud)" : "Local"}`);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 second timeout (Atlas may need more time)
      connectTimeoutMS: 10000,
      // Atlas-specific options
      ...(isAtlas && {
        retryWrites: true,
        w: "majority" as const,
      }),
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((error) => {
        console.warn("⚠️ MongoDB connection failed:", error.message);
        throw new Error(
          "Database connection failed. Please ensure MongoDB is running.",
        );
      });
  }

  try {
    cached!.conn = (await cached!.promise) as typeof mongoose;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
