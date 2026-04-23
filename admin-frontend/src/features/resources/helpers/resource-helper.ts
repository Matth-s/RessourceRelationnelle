import type { IPublicationResource } from "@/types/resource-type";

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
