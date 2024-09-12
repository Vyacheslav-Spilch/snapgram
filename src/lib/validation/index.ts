import * as z from "zod"


export const SignUpValidation = z.object({
    name: z.string().min(2, {message: 'Too short name'}),
    username: z.string().min(2, {message: 'Too short username'}),
    email: z.string().email(),
    password: z.string().min(6, {message: 'Password must be at least 6 characters'})
})

export const SignInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: 'Password must be at least 6 characters'})
})

export const PostValidation = z.object({
    caption: z.string().min(5).max(1000),
    file: z.custom<File[]>(),
    location: z.string().min(5).max(100),
    tags: z.string().optional()
})


