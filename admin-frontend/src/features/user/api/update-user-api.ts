import { api } from "@/lib/axios-client";
import type { updateUserType } from "../schemas/update-user-schema";

export const updateUserApi = async ({
  formData,
  userId,
}: {
  formData: updateUserType;
  userId: string;
}): Promise<void> => {
  const { data } = await api.put(`/superadmin/users/${userId}`, formData);

  return data;
};
