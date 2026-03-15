import {
  loginResponseSchema,
  type ILoginResponse,
} from '../schemas/auth-api-response-schema';
import type { loginType } from '../schemas/login-schema';
import { api } from '@/lib/axios-client';

export const loginApi = async (
  credentials: loginType,
): Promise<ILoginResponse> => {
  const { data } = await api.post(
    '/authentication/login',
    credentials,
  );

  const validatedData = loginResponseSchema.parse(data);

  return validatedData;
};
