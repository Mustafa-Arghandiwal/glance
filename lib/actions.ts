'use server'
import db from '@/db/index'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { signUpSchema } from './validations'

export type SignUpState = {
    error?: {
        formErrors: string[]
        fieldErrors: {
            username?: string[]
            email?: string[]
            password?: string[]
            confirmPassword?: string[]
        }
    }
    message?: string
}

export default async function signUp(previousState: SignUpState, formData: FormData) {

    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const { success, data, error } = signUpSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    })

    //validation failed
    if (!success) {
        const flattened = z.flattenError(error)
        return { error: flattened }
    }

    // validation succeeded
    // But duplicate user
    const { username, email, password } = data
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email))
    console.log(existingUser)
    if (existingUser.length > 0) return { message: "Account already exists for this email" }

    return {}
}
