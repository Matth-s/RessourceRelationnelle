import { api } from "@/lib/axios-client";
import { usersSchema, type usersSchemaType } from "../schemas/users-schema";

export const getUsersApi = async (): Promise<usersSchemaType> => {
  const { data } = await api.get("/superadmin/users");

  const validatedData = usersSchema.parse(data);

  return validatedData;
};
