import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { handleOptions, sendJson } from "../_lib/http.js";
import { readJsonBody } from "../_lib/http.js";
import { CreatePostSchema } from "../_lib/validate.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    const db = await getDb();
    const posts = db.collection("posts");

    // Indexes for performance (safe to call repeatedly; MongoDB ignores duplicates)
    // - createdAt for sorting feed
    await posts.createIndex({ createdAt: -1 });

    if (req.method === "GET") {
      // Pagination for performance:
      // Use cursor-based pagination on createdAt + _id.
      const url = new URL(req.url, "http://localhost");
      const limit = Math.min(Number(url.searchParams.get("limit") || 20), 50);

      const cursor = url.searchParams.get("cursor"); // format: createdAtMs:_id
      const filter = {};

      if (cursor) {
        const [createdAtMs, id] = cursor.split(":");
        const createdAt = new Date(Number(createdAtMs));
        // Fetch older than cursor
        filter.$or = [
          { createdAt: { $lt: createdAt } },
          { createdAt, _id: { $lt: new ObjectId(id) } }
        ];
      }

      const docs = await posts
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .project({
          // Do not leak anything sensitive (we only store post fields anyway).
          // This projection keeps payload small = faster responses.
          anonymous: 1,
          name: 1,
          recipient: 1,
          message: 1,
          youtube: 1,
          createdAt: 1
        })
        .toArray();

      const nextCursor =
        docs.length === limit
          ? `${docs[docs.length - 1].createdAt.getTime()}:${docs[docs.length - 1]._id}`
          : null;

      return sendJson(res, 200, { items: docs, nextCursor });
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);

      // Validate body with Zod (catches edge cases)
      const parsed = CreatePostSchema.safeParse(body);
      if (!parsed.success) {
        return sendJson(res, 400, {
          error: "Validation failed",
          details: parsed.error.flatten()
        });
      }

      const { anonymous, name, recipient, message, youtube } = parsed.data;

      // Normalize fields
      const doc = {
        anonymous,
        name: anonymous ? "Anonymous" : name,
        recipient: recipient ? recipient : "",
        message,
        youtube: youtube || null,
        createdAt: new Date()
      };

      const result = await posts.insertOne(doc);

      return sendJson(res, 201, {
        item: { ...doc, _id: result.insertedId }
      });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    // Centralized error response; do not expose full stack in production.
    return sendJson(res, 500, {
      error: "Server error",
      message: String(err?.message || err)
    });
  }
}