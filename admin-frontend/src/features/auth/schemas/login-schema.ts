import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({
    error: 'Email invalide',
  }),

  password: z.string(),
});

export type loginType = z.infer<typeof loginSchema>;
