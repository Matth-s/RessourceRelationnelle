import { USER_ROLE } from "@/types/user-type";
import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial",
      ),
    confirmPassword: z.string(),
    role: z.array(z.enum(USER_ROLE)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type createUserSchemaType = z.infer<typeof createUserSchema>;
