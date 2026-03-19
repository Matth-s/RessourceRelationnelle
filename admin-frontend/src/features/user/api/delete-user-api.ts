import { api } from "@/lib/axios-client";

export const deleteUserApi = async (id: string): Promise<void> => {
  const { data } = await api.delete(`/user/${id}`);

  return data;
};
