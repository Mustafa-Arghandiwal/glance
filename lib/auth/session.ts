import db from '@/db/index'
import { sessionsTable } from '@/db/schema'
import crypto from 'crypto'
import { cookies } from 'next/headers'

export async function createUserSession(userId: string) {
    const sessionId = crypto.randomBytes(32).toString('hex')
    const SESSION_EXPIRATION_DAYS = 7

    await db.insert(sessionsTable).values({
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    })

    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_EXPIRATION_DAYS * 24 * 60 * 60,
        path: "/",
    })
}
