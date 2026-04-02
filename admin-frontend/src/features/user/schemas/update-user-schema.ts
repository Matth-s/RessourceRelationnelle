import { USER_ROLE } from "@/types/user-type";
import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().trim().min(1, {
    error: "Veuillez entrer un nom d'utilisateur",
  }),
  email: z.email({
    error: "Email invalide",
  }),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  role: z.array(z.enum(USER_ROLE)).min(1, {
    error: "Veuillez renseigner un role",
  }),
});

export type updateUserType = z.infer<typeof updateUserSchema>;
