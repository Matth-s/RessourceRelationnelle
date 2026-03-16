import {
  currentUserSchema,
  type ICurrentUserResponse,
} from "@/features/user/schemas/current-user-schema";
import type { loginType } from "../schemas/login-schema";
import { api } from "@/lib/axios-client";

export const loginApi = async (
  credentials: loginType,
): Promise<ICurrentUserResponse> => {
  const { data } = await api.post("/authentication/login", credentials);

  const validatedData = currentUserSchema.parse(data);

  return validatedData;
};
