import {z} from 'zod';

export const registerSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters" }).max(100),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }).max(100)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type RegisterSchema = z.infer<typeof registerSchema>;