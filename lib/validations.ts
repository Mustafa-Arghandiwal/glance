import z from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(3, "Too short").max(20, "Too long"),
    email: z.email(),
    password: z.string().min(8, "Too short"),
    confirmPassword: z.string(),
}).refine(
    data => data.password === data.confirmPassword,
    {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
)
