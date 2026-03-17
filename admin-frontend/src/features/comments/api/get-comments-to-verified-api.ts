import { api } from "@/lib/axios-client";
export const getCommentsToVerify = async () => {
  const { data } = await api.get("/comments/moderate");

  return data;
};
