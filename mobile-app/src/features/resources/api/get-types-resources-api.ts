import { api } from "@/lib/axios-client";

export type TypeResource = {
  id: string;
  typeRessource: string;
};

export const getTypeResourcesApi = async (): Promise<TypeResource[]> => {
  const { data } = await api.get("/TypeResource");
  return data;
};