import { api } from "@/lib/axios-client";
import { statsSchema, type IStatObject } from "../schemas/stats-schema";

export const getStatisticsApi = async (): Promise<IStatObject> => {
  const { data } = await api.get("/statistics");

  console.log(data);

  const validatedData = statsSchema.parse(data);

  return validatedData;
};
