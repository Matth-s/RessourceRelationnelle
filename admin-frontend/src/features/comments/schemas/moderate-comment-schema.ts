import { COMMENT_MODERATION_ENUM } from "@/types/comment-type";
import z from "zod";

export const moderateCommentSchema = z.object({
  moderationStatus: z.enum(COMMENT_MODERATION_ENUM),
  commentId: z.string(),
});

export const moderateCommentResponseSchema = z.object({
  message: z.string(),
});

export type moderateCommentResponseType = z.infer<
  typeof moderateCommentResponseSchema
>;
export type moderateCommentType = z.infer<typeof moderateCommentSchema>;
