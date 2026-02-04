import { z } from "zod";

// Post schema with edge cases handled:
// - Name is optional if anonymous is true
// - recipient optional (can be empty string)
// - message required, trimmed, min length
// - youtube optional (if provided, we store videoId + title + url)
// - avatar optional (validated against a predefined list of avatar IDs)

// Valid avatar IDs that match the avatars in the frontend
const VALID_AVATAR_IDS = [
  'default', 'knight', 'wizard', 'ninja', 
  'robot', 'pirate', 'cat', 'alien', 'ghost'
];

export const CreatePostSchema = z.object({
  anonymous: z.boolean().default(false),
  name: z.string().trim().min(1).max(40).optional(),
  recipient: z.string().trim().max(60).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
  youtube: z
    .object({
      videoId: z.string().trim().min(6).max(20),
      title: z.string().trim().min(1).max(120),
      url: z.string().trim().url()
    })
    .optional(),
  // Avatar field: must be one of the predefined avatar IDs
  // Defaults to 'default' if not provided or invalid
  avatar: z.enum(VALID_AVATAR_IDS).default('default')
}).superRefine((val, ctx) => {
  if (!val.anonymous && !val.name) {
    ctx.addIssue({
      code: "custom",
      path: ["name"],
      message: "Name is required when not posting anonymously."
    });
  }
});

// Comment schema for adding comments to posts
// Comments are stored as an array within each post document
export const CreateCommentSchema = z.object({
  postId: z.string().trim().min(1, "Post ID is required"),
  name: z.string().trim().min(1, "Name is required").max(40),
  comment: z.string().trim().min(1, "Comment cannot be empty").max(500),
  avatar: z.enum(VALID_AVATAR_IDS).default('default')
});

// Reaction schema for adding reactions to posts
// Tracks unique reactions per user (using a simple identifier)
export const CreateReactionSchema = z.object({
  postId: z.string().trim().min(1, "Post ID is required"),
  reactionType: z.enum(['heart']).default('heart') // Can be extended: 'like', 'love', 'laugh', etc.
});