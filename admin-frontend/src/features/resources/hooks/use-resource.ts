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

  const {
    isLoading,
    error,
    data = [],
    refetch,
  } = useQuery({
    queryKey: [FETCH_KEYS.RESOURCES],
    queryFn: getResourcesApi,
    retry: false
  });

  const handleChangeModerationStatus = (
    status?: IPublicationResource,
  ): void => {
    setSelectedModerationStatus(status);
  };

  const filtredRessources: resourceArrayType = useMemo(() => {
    if (!selectedModerationStatus) return data;

    return data.filter(
      (ressource) => ressource.publicationStatus === selectedModerationStatus,
    );
  }, [selectedModerationStatus, data]);

  const uniquePublicationStatuses: IPublicationResource[] = [
    ...new Set(data.map((item) => item.publicationStatus)),
  ];

  return {
    isLoading,
    error,
    resources: filtredRessources,
    uniquePublicationStatuses,
    selectedModerationStatus,
    refetch,
    handleChangeModerationStatus,
    setSelectedModerationStatus,
  };
};
