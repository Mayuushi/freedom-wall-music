// Shared MongoDB client for serverless environment.
// - In serverless, functions can be invoked many times; caching avoids reconnecting every request.
// - Uses globalThis to reuse the client across hot invocations.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI env var");

const dbName = process.env.MONGODB_DB || "freedom_wall";

let cached = globalThis.__mongoCache;
if (!cached) {
  cached = globalThis.__mongoCache = { client: null, promise: null };
}

export async function getDb() {
  if (cached.client) return cached.client.db(dbName);

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      // Reasonable defaults; the driver handles pooling internally.
      maxPoolSize: 10
    });
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  const client = await cached.promise;
  return client.db(dbName);
}