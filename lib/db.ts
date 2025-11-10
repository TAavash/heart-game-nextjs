import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable in .env.local");
}

// Define a properly typed cache interface for mongoose connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend NodeJS global type to store cached mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;

  return cached.conn;
}
