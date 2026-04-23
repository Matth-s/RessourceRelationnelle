import type { IPublicationResource } from "@/types/resource-type";

export const formatPublicationStatus = (
  status: IPublicationResource,
): string => {
  switch (status) {
    case "Approved":
      return "Apprové";
    case "Pending":
      return "En attente";
    case "Rejected":
      return "Rejeté";
    default:
      return "Inconnu";
  }
};
