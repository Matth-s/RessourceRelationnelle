import { api } from "@/lib/axios-client";
import type { resourceObjectType } from "../schemas/ressource-schema";

export const updateResourceById = async (resource: resourceObjectType) => {
  return await api.put(`/resource/${resource.id}`, resource);
};
