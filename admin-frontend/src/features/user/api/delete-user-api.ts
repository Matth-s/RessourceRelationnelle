import { api } from "@/lib/axios-client";

export const deleteUserApi = async (userId: string) => {
  console.log(userId);
  await api.delete(`/superadmin/users/${userId}`);
};
