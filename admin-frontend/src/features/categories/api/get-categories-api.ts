import { api } from "@/lib/axios-client";
import {
  categoriesArraySchema,
  type categoriesArrayType,
} from "../schemas/categories-schema";

export const getCategoriesApi = async (): Promise<categoriesArrayType> => {
  const { data } = await api.get("/category");

  const validatedData = categoriesArraySchema.parse(data);

  return validatedData;
};
