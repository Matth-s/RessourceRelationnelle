import { api } from "@/lib/axios-client";
import {
  relationTypeArraySchema,
  type relationTypeArrayType,
} from "@/schemas/relation-type-schema";

export const getRelationType = async (): Promise<relationTypeArrayType> => {
  const { data } = await api.get("/typerelation");

  const validatedData = relationTypeArraySchema.parse(data);

  return validatedData;
};
