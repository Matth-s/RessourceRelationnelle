import { USER_ROLE } from "@/types/user-type";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  createdAt: z.coerce.date(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  role: z.array(z.enum(USER_ROLE)),
});

export const usersSchema = z.array(userSchema);

export type userSchemaType = z.infer<typeof userSchema>;
export type usersSchemaType = z.infer<typeof usersSchema>;
