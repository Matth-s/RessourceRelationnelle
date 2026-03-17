import { api } from "@/lib/axios-client";
import type { createCategoryType } from "../schemas/create-category-schema";

export const createCategoryApi = async (
  newCategory: createCategoryType,
): Promise<void> => {
  await api.post("/category", newCategory);
};
