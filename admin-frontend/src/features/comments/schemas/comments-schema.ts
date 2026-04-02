import { COMMENT_MODERATION_ENUM } from "@/types/comment-type";
import z from "zod";

export const commentObjectSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  moderationStatus: z.enum(COMMENT_MODERATION_ENUM),
  resource: z.object({
    id: z.string(),
    title: z.string(),
  }),
  user: z.object({
    id: z.string(),
    username: z.string(),
  }),
});

export const commentArraySchema = z.array(commentObjectSchema);

export type commentObjectType = z.infer<typeof commentObjectSchema>;
export type commentArrayType = z.infer<typeof commentArraySchema>;
