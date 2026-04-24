import { api } from "@/lib/axios-client";
import {
  resourceObjectSchema,
  type resourceObjectType,
} from "../schemas/ressource-schema";

export const getResourceById = async (
  id: string,
): Promise<resourceObjectType> => {
  const { data } = await api.get(`/resource/${id}`);

  const validatedData = resourceObjectSchema.parse(data);

  return validatedData;
};
