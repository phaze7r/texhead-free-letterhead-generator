import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_me')

export type SessionPayload = {
  user: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(user: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
  const session = await encrypt({ user, expiresAt })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    const payload = await decrypt(session)
    return payload
}
