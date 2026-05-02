import { api } from "@/lib/axios-client";

export type ResourceReturn = {
  id: string;
  title: string;
  resume: string;
  content: string;
  mediaUrl: string;
  mediaType: string;
  isVisible: boolean;
  publicationStatus: string;
  updatedAt: string | null;
  publishedAt: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  liked: boolean;
  user: { id: string; username: string };
  category: { id: string; categoryName: string };
  typeResource: { id: string; typeRessource: string };
  typeRelation: { id: string; typeRelation: string };
  comments: CommentReturn[];
};

export type Category = {
  id: string;
  categoryName: string;
};

export type TypeRelation = {
  id: string;
  typeRelation: string;
};

export type TypeResource = {
  id: string;
  typeRessource: string;
};

export type CommentReturn = {
  id: string;
  content: string;
  createdAt: string;
  moderationStatus: string;
  user: { id: string; username: string };
};

export const getResourcesApi = async (): Promise<ResourceReturn[]> => {
  const { data } = await api.get("/Resource");
  return data;
};

export const getResourceByIdApi = async (id: string): Promise<ResourceReturn> => {
  const { data } = await api.get(`/Resource/${id}`);
  return data;
};

export const getCategoriesApi = async (): Promise<Category[]> => {
  const { data } = await api.get("/Category");
  return data;
};

export const getTypeRelationsApi = async (): Promise<TypeRelation[]> => {
  const { data } = await api.get("/TypeRelation");
  return data;
};

export const getTypeResourcesApi = async (): Promise<TypeResource[]> => {
  const { data } = await api.get("/TypeResource");
  return data;
};

export const createResourceApi = async (formData: FormData): Promise<ResourceReturn> => {
  const { data } = await api.post("/Resource", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateResourceApi = async (payload: {
  id: string;
  title: string;
  resume: string;
  content: string;
  categoryId: string;
  resourceTypeId: string;
  relationTypeId: string;
}): Promise<void> => {
  await api.put("/Resource", payload);
};