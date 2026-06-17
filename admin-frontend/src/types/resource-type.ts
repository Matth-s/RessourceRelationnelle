export const PUBLICATION_RESOURCE_KEY = {
  PENDING: "Pending",
  APPROUVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type IPublicationResource =
  (typeof PUBLICATION_RESOURCE_KEY)[keyof typeof PUBLICATION_RESOURCE_KEY];

export interface IVisibilityForm {
  value: boolean;
  label: string;
}

export interface IResourcePublicationStatus {
  value: IPublicationResource;
  label: string;
}
