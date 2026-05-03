import { useQuery } from "@tanstack/react-query";
import { getResourcesApi } from "../api/get-resources-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useMemo, useState } from "react";
import type { IPublicationResource } from "@/types/resource-type";
import type { resourceArrayType } from "../schemas/ressource-schema";

export const useResource = () => {
  const [selectedModerationStatus, setSelectedModerationStatus] = useState<
    IPublicationResource | undefined
  >(undefined);
  const [searchText, setSearchText] = useState<string>("");

  const {
    isLoading,
    error,
    data = [],
    refetch,
  } = useQuery({
    queryKey: [FETCH_KEYS.RESOURCES],
    queryFn: getResourcesApi,
    retry: false,
  });

  const handleChangeModerationStatus = (
    status?: IPublicationResource,
  ): void => {
    setSelectedModerationStatus(status);
  };

  const filtredRessources: resourceArrayType = useMemo(() => {
    if (!data?.length) return [];

    const search = searchText.trim().toLowerCase();

    return data.filter((resource) => {
      if (
        selectedModerationStatus &&
        resource.publicationStatus !== selectedModerationStatus
      ) {
        return false;
      }

      if (search && !resource.title?.toLowerCase().includes(search)) {
        return false;
      }

      return true;
    });
  }, [data, selectedModerationStatus, searchText]);

  const uniquePublicationStatuses: IPublicationResource[] = [
    ...new Set(data.map((item) => item.publicationStatus)),
  ];

  return {
    data,
    isLoading,
    error,
    resources: filtredRessources,
    uniquePublicationStatuses,
    selectedModerationStatus,
    searchText,
    setSearchText,
    refetch,
    handleChangeModerationStatus,
    setSelectedModerationStatus,
  };
};
