import { api } from "@/lib/axios-client";
import type { categorySchemaType } from "../schemas/categories-schema";

export const updateCategoryApi = async (
  category: Pick<categorySchemaType, "id" | "categoryName">,
): Promise<void> => {
  const { id, categoryName } = category;

  await api.put(`/category?id=${id}`, { categoryName });
};
