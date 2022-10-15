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

export const offsetPostsPayloadSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  page: z.number().nullish(),
  searchTerm: z.string().nullish(),
});

export type offsetPostsPayload = z.TypeOf<typeof offsetPostsPayloadSchema>;

export const changePublishStatusSchema = z.object({
  id: z.string().cuid(),
  isPublished: z.boolean(),
});

export type changePublishStatusInput = z.TypeOf<
  typeof changePublishStatusSchema
>;
