import { z } from 'zod';

export const userRegisterSchema = z.object({
    username: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(30).regex(/[A-Z]/).regex(/[^a-zA-Z0-9]/),
    confirmPassword: z.string().min(8).max(30).regex(/[A-Z]/).regex(/[^a-zA-Z0-9]/),
});

export const userLoginSchema = z.object({
    username: z.string(),
    password: z.string().min(8).max(30).regex(/[A-Z]/, "Require at least a capital letter on your password").regex(/[^a-zA-Z0-9]/, "Require atleast one symbol on your password"),
    // password: z.string().min(8).max(30),
});