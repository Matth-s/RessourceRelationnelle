import { api } from "@/lib/axios-client";

export const getStatisticsApi = async () => {
  const { data } = await api.get("/Statistics");
  return data;
};