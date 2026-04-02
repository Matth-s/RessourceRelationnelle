import { api } from "@/lib/axios-client";
import {
  moderateCommentResponseSchema,
  type moderateCommentResponseType,
  type moderateCommentWithType,
} from "../schemas/moderate-comment-schema";

export const deleteCommentApi = async (
  formData: moderateCommentWithType,
): Promise<moderateCommentResponseType> => {
  const { data } = await api.delete(
    `/superadmin/comments/${formData.commentId}`,
  );

  const validatedData = moderateCommentResponseSchema.parse(data);

  return validatedData;
};
