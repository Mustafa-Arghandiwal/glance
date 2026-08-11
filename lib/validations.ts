import z from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(3, "Too short, must be at least 3 characters").max(20, "Too long, must be at most 20 characters")
        .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
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
