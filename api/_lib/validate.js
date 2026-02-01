import { z } from "zod";

// Post schema with edge cases handled:
// - Name is optional if anonymous is true
// - recipient optional (can be empty string)
// - message required, trimmed, min length
// - youtube optional (if provided, we store videoId + title + url)

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
    .optional()
}).superRefine((val, ctx) => {
  if (!val.anonymous && !val.name) {
    ctx.addIssue({
      code: "custom",
      path: ["name"],
      message: "Name is required when not posting anonymously."
    });
  }
});