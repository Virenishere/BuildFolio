import {z} from "zod";

export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userName: z.string().min(4, "Username must be at least 4 characters"), // Changed from 'name' to 'userName'
});

export const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});