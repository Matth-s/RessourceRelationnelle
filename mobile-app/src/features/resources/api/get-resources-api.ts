import { api } from "@/lib/axios-client";

export type Resource = {
  id: string;
  title: string;
  resume: string;
  content: string;
  url: string;
  isVisible: boolean;
  publicationStatus: string;
  createdAt: string;
  publishedAt: string;
  userId: string;
  user: { userName: string } | null;
  category: { id: string; categoryName: string } | null;
  typeRessource: { id: string; typeRessource: string } | null;
  typeRelation: { id: string; typeRelation: string } | null;
};

export const getResourcesApi = async (): Promise<Resource[]> => {
  const { data } = await api.get("/Resource");
  return data;
};

export const getResourceByIdApi = async (id: string): Promise<Resource> => {
  const { data } = await api.get(`/Resource/${id}`);
  return data;
};