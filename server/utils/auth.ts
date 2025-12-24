import { randomBytes } from 'crypto'
import type { H3Event } from 'h3'

/**
 * Generate a secure random token for login links
 */
export function generateLoginToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Calculate expiration date for login token
 * @param days Number of days until expiration
 */
export function getTokenExpiration(days: number = 7): Date {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + days)
  return expiration
}

/**
 * Get the current user ID from session
 */
export async function getUserId(event: H3Event): Promise<string | null> {
  const session = await useSession<{ userId?: string }>(event, {
    password: process.env.SESSION_SECRET || 'change-this-to-a-secure-random-string',
  })
  return session.data.userId || null
}

/**
 * Set the current user ID in session
 */
export async function setUserId(event: H3Event, userId: string): Promise<void> {
  const session = await useSession<{ userId?: string }>(event, {
    password: process.env.SESSION_SECRET || 'change-this-to-a-secure-random-string',
  })
  await session.update({ userId })
}

/**
 * Clear the session (logout)
 */
export async function clearSession(event: H3Event): Promise<void> {
  const session = await useSession<{ userId?: string }>(event, {
    password: process.env.SESSION_SECRET || 'change-this-to-a-secure-random-string',
  })
  await session.clear()
}
