import { api } from "@/lib/axios-client";
import type { createUserSchemaType } from "../schemas/create-user-schema";

export const createUserApi = async (formData: createUserSchemaType) => {
  const { data } = await api.post("/superadmin", formData);

  return data;
};
