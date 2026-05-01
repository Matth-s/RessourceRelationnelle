import {
  resourceObjectSchema,
  type resourceArrayType,
  type resourceObjectType,
} from "../schemas/ressource-schema";
import { api } from "@/lib/axios-client";

export const getResourcesApi = async (): Promise<resourceArrayType> => {
  const { data } = await api.get("/resource");

  const validatedData = data
    .map((item: unknown) => {
      const result = resourceObjectSchema.safeParse(item);

      if (!result.success) {
        console.error("Invalid item:", result.error);
        return null;
      }

      return result.data;
    })
    .filter((item: resourceObjectType) => item !== null);

  return validatedData;
};
