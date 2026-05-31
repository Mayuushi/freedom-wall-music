// Shared database accessor for serverless and local development.
// - In serverless, functions can be invoked many times; caching avoids reconnecting every request.
// - If MongoDB is unavailable in development, we fall back to an in-memory store so the app still works.

import { MongoClient } from "mongodb";
import { createMemoryDb } from "./memory-db.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI env var");

const dbName = process.env.MONGODB_DB || "freedom_wall";

let cached = globalThis.__mongoCache;
if (!cached) {
  cached = globalThis.__mongoCache = { client: null, promise: null, memoryDb: null };
}

function shouldUseMemoryFallback(err) {
  if (process.env.NODE_ENV === "production") return false;

  const message = String(err?.message || err).toLowerCase();
  return message.includes("authentication failed") || message.includes("bad auth") || message.includes("connect");
}

function buildMongoClientOptions() {
  return {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 4000,
    socketTimeoutMS: 4000,
    tls: true,
    retryWrites: true,
    w: "majority"
  };
}

export async function getDb() {
  if (cached.memoryDb) return cached.memoryDb;
  if (cached.client) return cached.client.db(dbName);

  if (!cached.promise) {
    const client = new MongoClient(uri, buildMongoClientOptions());
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  try {
    const client = await cached.promise;
    return client.db(dbName);
  } catch (err) {
    cached.promise = null;

    if (shouldUseMemoryFallback(err)) {
      console.warn("[db] MongoDB unavailable, using in-memory fallback for development.");
      cached.memoryDb = createMemoryDb();
      return cached.memoryDb;
    }

    const message = String(err?.message || err);
    if (message.toLowerCase().includes("tls") || message.toLowerCase().includes("ssl")) {
      throw new Error(
        `MongoDB TLS handshake failed. Check Atlas network access, cluster status, and the deployed MONGODB_URI value. Original error: ${message}`
      );
    }

    throw err;
  }
}