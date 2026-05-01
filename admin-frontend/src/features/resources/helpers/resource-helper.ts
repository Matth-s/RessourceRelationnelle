import type { IPublicationResource } from "@/types/resource-type";
import type { resourceArrayType } from "../schemas/ressource-schema";

export const formatPublicationStatus = (
  publicationStatus: IPublicationResource,
): string => {
  switch (publicationStatus) {
    case "Approved":
      return "Appouvé";
    case "Pending":
      return "En attente";
    case "Rejected":
      return "Rejeté";
    default:
      return "Inconnue";
  }
};

export const getResourceLengthByType = ({
  data,
  publicationStatus,
}: {
  data: resourceArrayType;
  publicationStatus?: IPublicationResource;
}): number => {
  if (!publicationStatus) return data.length;

  return data.filter((item) => item.publicationStatus === publicationStatus)
    .length;
};
