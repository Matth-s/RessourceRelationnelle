import axios from "axios";
import {
  currentUserSchema,
  type ICurrentUserResponse,
} from "../schemas/current-user-schema";

export const getCurrentUserApi = async (): Promise<ICurrentUserResponse> => {
  const { data } = await axios.post("/user/current");

  const validatedData = currentUserSchema.parse(data);

  return validatedData;
};
