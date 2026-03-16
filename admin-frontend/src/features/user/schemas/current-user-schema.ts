import { USER_ROLE } from "@/types/user-role-type";
import z from "zod";

export const currentUserSchema = z.object({
  username: z.jwt(),
  role: z.enum(USER_ROLE),
  token: z.string(),
});

export type ICurrentUserResponse = z.infer<typeof currentUserSchema>;
