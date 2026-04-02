import { USER_ROLE } from "@/types/user-type";
import z from "zod";

export const currentUserSchema = z.object({
  username: z.string(),
  role: z.array(z.enum(USER_ROLE)).min(1),
  token: z.string(),
});

export type ICurrentUserResponse = z.infer<typeof currentUserSchema>;
