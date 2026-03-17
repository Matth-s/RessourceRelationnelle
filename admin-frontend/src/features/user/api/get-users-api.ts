import { api } from "@/lib/axios-client";

export const getUsersApi = async () => {
  const { data } = await api.get("/users");

  return data;
};
