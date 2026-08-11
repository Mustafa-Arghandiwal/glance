import crypto from "crypto"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function hashPassword(password: string, salt: string): Promise<string> {

    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
            if (error) reject(error)

            resolve(hash.toString('hex'))
        })
    })

}

export function generateSalt() {
    return crypto.randomBytes(16).toString('hex')
}
