import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db.js";
import { handleOptions, sendJson, readJsonBody } from "../_lib/http.js";
import { CreateCommentSchema } from "../_lib/validate.js";

/**
 * API endpoint for handling post comments
 * POST: Add a comment to a post
 * GET: Get comments for a specific post (optional, already included in post data)
 */
export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    const db = await getDb();
    const posts = db.collection("posts");

    if (req.method === "POST") {
      const body = await readJsonBody(req);

      // Validate request body
      const parsed = CreateCommentSchema.safeParse(body);
      if (!parsed.success) {
        return sendJson(res, 400, {
          error: "Validation failed",
          details: parsed.error.flatten()
        });
      }

      const { postId, name, comment, avatar } = parsed.data;

      // Validate ObjectId format
      if (!ObjectId.isValid(postId)) {
        return sendJson(res, 400, { error: "Invalid post ID format" });
      }

      const postObjectId = new ObjectId(postId);

      // Check if post exists
      const post = await posts.findOne({ _id: postObjectId });
      if (!post) {
        return sendJson(res, 404, { error: "Post not found" });
      }

      // Initialize comments array if it doesn't exist (for backwards compatibility)
      if (!post.comments) {
        await posts.updateOne(
          { _id: postObjectId },
          { $set: { comments: [] } }
        );
      }

      // Create comment object
      const newComment = {
        _id: new ObjectId(), // Give each comment its own ID
        name: name.trim(),
        comment: comment.trim(),
        avatar: avatar || 'default',
        createdAt: new Date()
      };

      // Add comment to post
      const result = await posts.updateOne(
        { _id: postObjectId },
        { $push: { comments: newComment } }
      );

      if (result.modifiedCount === 0) {
        return sendJson(res, 500, { error: "Failed to add comment" });
      }

      return sendJson(res, 201, {
        success: true,
        comment: newComment,
        commentCount: (post.comments?.length || 0) + 1
      });
    }

    if (req.method === "GET") {
      // Get comments for a specific post
      const url = new URL(req.url, "http://localhost");
      const postId = url.searchParams.get("postId");

      if (!postId || !ObjectId.isValid(postId)) {
        return sendJson(res, 400, { error: "Valid post ID is required" });
      }

      const post = await posts.findOne(
        { _id: new ObjectId(postId) },
        { projection: { comments: 1 } }
      );

      if (!post) {
        return sendJson(res, 404, { error: "Post not found" });
      }

      return sendJson(res, 200, {
        comments: post.comments || []
      });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("Comments API error:", err);
    return sendJson(res, 500, {
      error: "Server error",
      message: String(err?.message || err)
    });
  }
}
