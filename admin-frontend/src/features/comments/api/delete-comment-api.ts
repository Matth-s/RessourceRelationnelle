import { api } from "@/lib/axios-client";

export const deleteCommentApi = async (commentId: string): Promise<void> => {
  await api.delete(`/SuperAdmin/comments/${commentId}`);
};
