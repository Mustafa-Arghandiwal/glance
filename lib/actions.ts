'use server'


export default async function signUp(formData: FormData) {
    const { username, email, password, confirmPassword } = Object.fromEntries(formData)

}
