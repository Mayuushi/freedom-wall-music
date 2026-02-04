import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { handleOptions, sendJson, readJsonBody } from "../_lib/http.js";
import { CreateReactionSchema } from "../_lib/validate.js";

/**
 * API endpoint for handling post reactions
 * POST: Add or toggle a reaction to a post
 * Uses a unique session identifier to prevent duplicate reactions from same user
 */
export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    const db = await getDb();
    const posts = db.collection("posts");

    if (req.method === "POST") {
      const body = await readJsonBody(req);

      // Validate request body
      const parsed = CreateReactionSchema.safeParse(body);
      if (!parsed.success) {
        return sendJson(res, 400, {
          error: "Validation failed",
          details: parsed.error.flatten()
        });
      }

      const { postId, reactionType } = parsed.data;

      // Validate ObjectId format
      if (!ObjectId.isValid(postId)) {
        return sendJson(res, 400, { error: "Invalid post ID format" });
      }

      // Generate a simple user identifier based on IP and user agent
      // In production, you'd use proper authentication/session management
      const userAgent = req.headers["user-agent"] || "";
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const userId = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 32);

      const postObjectId = new ObjectId(postId);

      // Check if post exists
      const post = await posts.findOne({ _id: postObjectId });
      if (!post) {
        return sendJson(res, 404, { error: "Post not found" });
      }

      // Initialize reactions array if it doesn't exist (for backwards compatibility)
      if (!post.reactions) {
        await posts.updateOne(
          { _id: postObjectId },
          { $set: { reactions: [] } }
        );
      }

      // Check if user already reacted
      const existingReactionIndex = (post.reactions || []).findIndex(
        (r) => r.userId === userId && r.type === reactionType
      );

      let result;
      if (existingReactionIndex >= 0) {
        // User already reacted - remove the reaction (toggle off)
        result = await posts.updateOne(
          { _id: postObjectId },
          { $pull: { reactions: { userId, type: reactionType } } }
        );

        return sendJson(res, 200, {
          success: true,
          action: "removed",
          reactionCount: (post.reactions?.length || 0) - 1
        });
      } else {
        // Add new reaction
        const reaction = {
          userId,
          type: reactionType,
          createdAt: new Date()
        };

        result = await posts.updateOne(
          { _id: postObjectId },
          { $push: { reactions: reaction } }
        );

        return sendJson(res, 200, {
          success: true,
          action: "added",
          reactionCount: (post.reactions?.length || 0) + 1
        });
      }
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("Reaction API error:", err);
    return sendJson(res, 500, {
      error: "Server error",
      message: String(err?.message || err)
    });
  }
}
