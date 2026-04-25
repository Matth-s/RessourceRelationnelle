import { api } from "@/lib/axios-client";

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export const registerApi = async (payload: RegisterPayload): Promise<void> => {
  await api.post("/authentication/signup", payload);
};
