import { api } from "@/lib/axios-client";

export type Category = {
  id: string;
  categoryName: string;
};

export const getCategoriesApi = async (): Promise<Category[]> => {
  const { data } = await api.get("/Category");
  return data;
};