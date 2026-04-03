import {
  resourceArraySchema,
  type resourceArrayType,
} from "../schemas/ressource-schema";
import { api } from "@/lib/axios-client";

export const getResourcesApi = async (): Promise<resourceArrayType> => {
  const { data } = await api.get("/resource");

  const validatedData = resourceArraySchema.parse(data);

  return validatedData;
};
