import { api } from "@/lib/axios-client";

export const updateUserApi = async () => {
  const { data } = await api.put("/user");

  return { data };
};
