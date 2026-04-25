import { api } from "@/lib/axios-client";
import { moderateCommentResponseSchema, type moderateCommentResponseType, type moderateCommentWithType } from "../schemas/moderate-comment-schema";

export const updateCommentApi = async (
  formData: moderateCommentWithType,
): Promise<moderateCommentResponseType> => {
  const { commentId } = formData;

  const action = formData.type === "update" ? "approve" : "reject";

  const { data } = await api.put(`/superadmin/comments/${commentId}`, {
    action,
  });

  const validatedData = moderateCommentResponseSchema.parse(data);

  return validatedData;
};