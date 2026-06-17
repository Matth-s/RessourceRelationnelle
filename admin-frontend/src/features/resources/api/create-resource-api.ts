import { api } from "@/lib/axios-client";
import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";
import {
  resourceObjectSchema,
  type resourceObjectType,
} from "../schemas/ressource-schema";

export const createResourceApi = async (
  dataParams: createOrUpdateSchemaType,
): Promise<resourceObjectType> => {
  const formData = new FormData();

  Object.entries(dataParams).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  const { data } = await api.post("/resource", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const validatedData = resourceObjectSchema.parse(data);

  return validatedData;
};
