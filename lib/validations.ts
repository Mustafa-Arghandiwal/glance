import z from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
}).refine(
    data => data.password === data.confirmPassword,
    {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
)
