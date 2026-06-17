import { getResourceTypeApi } from "@/api/get-resource-type-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useQuery } from "@tanstack/react-query";

export const useResourceType = () => {
  return useQuery({
    queryFn: getResourceTypeApi,
    queryKey: [FETCH_KEYS.RESOURCE_TYPE],
  });
};
