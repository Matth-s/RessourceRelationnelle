import { USER_ROLE } from '@/types/user-role-type';
import z from 'zod';

export const loginResponseSchema = z.object({
  username: z.jwt(),
  role: z.enum(USER_ROLE),
  token: z.string(),
});

export type ILoginResponse = z.infer<typeof loginResponseSchema>;
