import { api } from "@/lib/axios-client";
import {
  commentArraySchema,
  type commentArrayType,
} from "../schemas/comments-schema";

export const getCommentsApi = async (): Promise<commentArrayType> => {
  const { data } = await api.get("/superadmin/comments");

  const validatedData = commentArraySchema.parse(data);

  return validatedData;
};
