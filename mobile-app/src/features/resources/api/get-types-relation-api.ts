import { api } from "@/lib/axios-client";

export type TypeRelation = {
  id: string;
  typeRelation: string;
};

export const getTypeRelationsApi = async (): Promise<TypeRelation[]> => {
  const { data } = await api.get("/TypeRelation");
  return data;
};