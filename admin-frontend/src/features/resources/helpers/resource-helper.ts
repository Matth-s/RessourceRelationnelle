import type { IPublicationResource } from "@/types/resource-type";
import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";
import type {
  resourceArrayType,
  resourceObjectType,
} from "../schemas/ressource-schema";

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

export const getMediaType = (file?: File | null): string | null => {
  if (!file || !file.type) return "other";

  const type = file.type;

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf") return "pdf";

  return null;
};

export const transformCreateResourceToView = ({
  user,
  formData,
  resourceName,
  relationName,
}: {
  formData: createOrUpdateSchemaType;
  user: { id: string; username: string };
  resourceName?: string;
  relationName?: string;
}): resourceObjectType => {
  return {
    ...formData,
    mediaUrl: formData.file ? URL.createObjectURL(formData.file) : "",
    mediaType: getMediaType(formData.file),
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
      id: formData.resourceTypeId,
      typeRessource: resourceName ?? "",
    },
    typeRelation: {
      id: formData.relationTypeId,
      typeRelation: relationName ?? "",
    },
    likeCount: 0,
    liked: false,
  };
};
