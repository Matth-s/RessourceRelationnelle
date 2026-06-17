import { api } from "@/lib/axios-client";
import type { createCommentType } from "../schemas/create-comment-schema";

export const createCommentApi = async (
  formData: createCommentType,
): Promise<void> => {
  await api.post("/commentary", formData);
};
