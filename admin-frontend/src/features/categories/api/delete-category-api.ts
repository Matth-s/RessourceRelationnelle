import { api } from "@/lib/axios-client";

export const deleteCategoryApi = async (id: string): Promise<void> => {
  await api.delete(`/category?id=${id}`);
};
