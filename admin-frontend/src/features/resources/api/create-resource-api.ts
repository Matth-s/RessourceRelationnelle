import { api } from "@/lib/axios-client";
import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";

export const createResourceApi = async (
  data: createOrUpdateSchemaType,
): Promise<void> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return await api.post("/resource", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
