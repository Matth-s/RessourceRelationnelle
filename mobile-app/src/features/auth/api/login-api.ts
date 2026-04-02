import { currentUserSchema } from "@/features/user/schemas/current-user-schema";
import type { LoginSchema } from "../components/login-form/schemas/login-schemas";
import { api } from "@/lib/axios-client";
import { setAuthCookie } from "@/lib/cookie";

export const loginApi = async (form: LoginSchema) => {
  const { data } = await api.post("/authentication/login", form);

  const validateData = currentUserSchema.parse(data);

  setAuthCookie(validateData.token);

  return validateData;
};
