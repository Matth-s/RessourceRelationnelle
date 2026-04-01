import { api } from "@/lib/axios-client";
import {
  currentUserSchema,
  type ICurrentUserResponse,
} from "../schemas/current-user-schema";

export const getCurrentUserApi = async (): Promise<ICurrentUserResponse> => {
  const { data } = await api.get("/user/current");

  const validatedData = currentUserSchema.parse(data);

  return validatedData;
};
