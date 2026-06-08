import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "DATABASE_URL"');
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

let cached: MongooseCache = globalThis.mongooseCache ?? { conn: null, promise: null }
if (!globalThis.mongooseCache) globalThis.mongooseCache = cached

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((m) => {
      console.log('MongoDB connected successfully')
      return m
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
