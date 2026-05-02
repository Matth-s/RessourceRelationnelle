import { getRelationType } from "@/api/get-relation-type-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useQuery } from "@tanstack/react-query";

export const useRelationType = () => {
  return useQuery({
    queryFn: getRelationType,
    queryKey: [FETCH_KEYS.RELATION],
  });
};
