import { api } from "@/lib/axios-client";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  expiration: string;
  username: string;
  role: string[];
};

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post("/authentication/login", payload);
  return data;
};
