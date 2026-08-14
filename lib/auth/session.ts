import db from '@/db/index'
import { sessionsTable } from '@/db/schema'
import crypto from 'crypto'
import { eq, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

type Session = {
    user_id: string,
    expires_at: string
}
type CurrentUser = {
    id: string
    username: string
    email: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
        return null
    }

    const [session]: Session[] = await db.execute(sql`SELECT user_id, expires_at FROM sessions WHERE id = ${sessionId}`)
    if (!session) {
        return null
    }
    if (new Date(session.expires_at) < new Date()) {
        return null
    }

    const userId = session.user_id

    const [user]: CurrentUser[] = await db.execute(sql`SELECT id, username, email FROM users WHERE id = ${userId}`)
    if (!user) {
        return null
    }

    return user
}
