import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(256, "Maxlength should be 256"),
  body: z.string().min(15),
});

export type createPostInput = z.TypeOf<typeof createPostSchema>;
