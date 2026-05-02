import { FETCH_KEYS } from "@/types/fetch-key-type";
import { getCategoriesApi } from "../api/get-categories-api";
import { useQuery } from "@tanstack/react-query";
import type { categorySchemaType } from "../schemas/categories-schema";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: [FETCH_KEYS.CATEGORY],
    queryFn: getCategoriesApi,
    retry: false,
  });

  const getSelectedCategories = (
    id: string,
  ): categorySchemaType | undefined => {
    return query.data?.find((item) => item.id === id);
  };

  return { ...query, getSelectedCategories };
};
