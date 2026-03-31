import mongoose from "mongoose";

declare global {
  var mongoose:
    | {
        conn: unknown | null;
        promise: Promise<unknown> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// Log connection type without exposing credentials
const isAtlas = MONGODB_URI?.includes("mongodb+srv://");

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
      serverSelectionTimeoutMS: 20000, // 20 second timeout (Atlas may need more time)
      connectTimeoutMS: 20000,
      family: 4, // Force IPv4 to resolve SSL handshake issues in some networks
      // Atlas-specific options
      ...(isAtlas && {
        retryWrites: true,
        w: "majority" as const,
      }),
    };

    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
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
