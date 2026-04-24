import type { IPublicationResource } from "@/types/resource-type";
import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";
import type { resourceObjectType } from "../schemas/ressource-schema";

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

export const transformCreateResourceToView = ({
  user,
  formData,
}: {
  formData: createOrUpdateSchemaType;
  user: { id: string; username: string };
}): resourceObjectType => {
  console.log(formData.file?.type);

  return {
    ...formData,
    mediaUrl: formData.file ? URL.createObjectURL(formData.file) : "",
    mediaType: "image",
    id: "",
    updatedAt: new Date().toString(),
    publishedAt: new Date().toString(),
    createdAt: new Date().toString(),
    viewCount: 0,
    user,
    category: {
      id: "",
      categoryName: "",
    },
    typeResource: {
      id: "",
      typeRessource: "",
    },
    typeRelation: {
      id: "",
      typeRelation: "",
    },
    likeCount: 0,
    liked: false,
  };
};
