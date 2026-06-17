import { api } from "@/lib/axios-client";
import type { deleteResourceType } from "../schemas/delete-resource-schema";

export const deleteResourceById = async (
  data: deleteResourceType,
): Promise<void> => {
  await api.delete(`/resource/${data.resourceId}`);
};
