import {
  resourceArraySchema,
  type resourceArrayType,
} from "../schemas/ressource-schema";
import { api } from "@/lib/axios-client";

export const getResourcesApi = async (): Promise<resourceArrayType> => {
  const { data } = await api.get("/resource");

  const { data: validatedData, error } = resourceArraySchema.safeParse(data);

  if (error) {
    console.log(error);
    throw new Error("");
  }

  return validatedData;
};
