import type { RegisterSchema } from "../components/register-form/schemas/register-schemas";
import { api } from "@/lib/axios-client";

export const registerApi = async (form: RegisterSchema) => {
  const { data } = await api.post("/authentication/signup", form);
  return data;
};
