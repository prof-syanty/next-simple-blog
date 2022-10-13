import { z } from "zod";

export const createUpdatePostSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1).max(256, "Maxlength should be 256"),
  body: z.string().min(15),
});

export type createUpdatePostInput = z.TypeOf<typeof createUpdatePostSchema>;

export const singlePostSchema = z.object({
  id: z.string().cuid(),
});

export type singlePostInput = z.TypeOf<typeof singlePostSchema>;
