import { api } from "@/lib/axios-client";
import {
  commentResourceIdObjectSchema,
  type commentResourceIdObjectType,
} from "../schemas/comments-schema";

export const getCommentsByResourceId = async (
  id: string,
): Promise<commentResourceIdObjectType[]> => {
  const { data } = await api.get(`/commentary/resource/${id}`);

  const validatedData: commentResourceIdObjectType[] = data
    .map((item: unknown) => {
      const result = commentResourceIdObjectSchema.safeParse(item);

      if (!result.success) {
        console.log(result.error);
        return null;
      }

      return result.data as commentResourceIdObjectType;
    })
    .filter((item: unknown) => item !== null);

  return validatedData;
};
