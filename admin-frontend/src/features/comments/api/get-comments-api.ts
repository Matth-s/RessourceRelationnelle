import { api } from "@/lib/axios-client";

export const getCommentsApo = async () => {
  const { data } = await api.get("/comments");

  return data;
};
