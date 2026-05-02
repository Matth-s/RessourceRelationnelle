import { api } from "@/lib/axios-client";
import {
  moderateCommentResponseSchema,
  type moderateCommentResponseType,
  type moderateCommentType,
} from "../schemas/moderate-comment-schema";

export const updateCommentApi = async (
  formData: moderateCommentType,
): Promise<moderateCommentResponseType> => {
  const { commentId, moderationStatus } = formData;

  const { data } = await api.put(`/superadmin/${commentId}`, {
    moderationStatus,
  });

  const validatedData = moderateCommentResponseSchema.parse(data);

  return validatedData;
};
