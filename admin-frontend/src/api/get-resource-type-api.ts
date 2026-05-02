import { api } from "@/lib/axios-client";
import {
  resourceTypeArraySchema,
  type resourceTypeArrayType,
} from "@/schemas/resource-type-schema";

export const getResourceTypeApi = async (): Promise<resourceTypeArrayType> => {
  const { data } = await api.get("/TypeResource");

  const validatedData = resourceTypeArraySchema.parse(data);

  return validatedData;
};
