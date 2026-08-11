'use server'
import db from '@/db/index'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { signUpSchema } from './validations'
import { generateSalt, hashPassword } from './utils'
import { redirect } from 'next/navigation'

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
    values?: {
        username?: string
        email?: string
    }
}

export default async function signUp(_previousState: SignUpState = {}, formData: FormData): Promise<SignUpState> {

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
        return {
            error: flattened,
            values: {
                username: formData.get('username') as string,
                email: formData.get('email') as string,
            }
        }
    }

    // validation succeeded
    // But duplicate user
    const { username, email, password } = data
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (existingUser.length > 0) return {
        message: "Account already exists for this email",
        // this is put back into fields to avoid re-entrering values
        values: {
            username: formData.get('username') as string,
            email: formData.get('email') as string
        }
    }

    // Sign up user
    try {
        const salt = generateSalt()
        const hashedPassword = await hashPassword(password, salt)
        const [user] = await db.insert(usersTable).values({
            username, email, password: hashedPassword, salt
        }).returning({ id: usersTable.id })
        if (user == null) return { message: "Unable to create account 1" }
        // return { message: "Account created successfully" }
    } catch {
        return { message: "Unable to create account 2" }
    }

    redirect('/')

}
