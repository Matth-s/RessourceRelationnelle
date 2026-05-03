import {
  PUBLICATION_RESOURCE_KEY,
  type IResourcePublicationStatus,
  type IVisibilityForm,
} from "@/types/resource-type";

export const VISIBILITY_FORM: IVisibilityForm[] = [
  {
    value: true,
    label: "Visible",
  },
  {
    value: false,
    label: "Non visible",
  },
];

export const MODERATION_STATUS_RESOURCE: IResourcePublicationStatus[] = [
  {
    label: "En attente",
    value: PUBLICATION_RESOURCE_KEY.PENDING,
  },
  {
    label: "Approuvé",
    value: PUBLICATION_RESOURCE_KEY.APPROUVED,
  },
  {
    label: "Rejeté",
    value: PUBLICATION_RESOURCE_KEY.REJECTED,
  },
];

export const ACCEPTED_TYPES =
  ".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov,.mp3,.pdf";
