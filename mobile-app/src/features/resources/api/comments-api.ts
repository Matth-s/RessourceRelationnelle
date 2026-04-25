import { api } from "@/lib/axios-client";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: { userName: string } | null;
  resourceId: string;
  moderationStatus: string;
};

export const getCommentsByResourceApi = async (resourceId: string): Promise<Comment[]> => {
  const { data } = await api.get(`/Commentary/resource/${resourceId}`);
  return data;
};

export const postCommentApi = async (resourceId: string, content: string): Promise<void> => {
  await api.post("/Commentary", { resourceId, content });
};