import { z } from "zod";

export const postCommentSchema = z.object({
  body: z.string().min(1, "Comment must be at least 1 characters"),
  postId: z.string().cuid().optional(),
  parentId: z.string().cuid().nullish(),
});

export type postCommentInput = z.TypeOf<typeof postCommentSchema>;
