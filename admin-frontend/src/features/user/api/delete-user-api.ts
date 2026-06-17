import { api } from "@/lib/axios-client";

export const deleteUserApi = async (userId: string) => {
  await api.delete(`/superadmin/users/${userId}`);
};
