import { gender_type } from '@prisma/client';
import { z } from 'zod';

export const userRegisterSchema = z.object({
    username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9]+$/, "Please don't input symbol or character for your username"),
    email: z.string().email(),
    password: z.string().min(8).max(30).regex(/[A-Z]/, "Require at least a capital letter on your password").regex(/[^a-zA-Z0-9]/, "Requires one symbol and number"),
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30).regex(/[A-Z]/, "Require at least a capital letter on your password").regex(/[^a-zA-Z0-9]/, "Require atleast one symbol on your password"),
});

export const editProfileUserSchema = z.object({
    name: z.string().min(4).max(80),
    gender: z.enum([gender_type.male, gender_type.female, gender_type.secret]),
    country: z.string().min(3).max(50)
})