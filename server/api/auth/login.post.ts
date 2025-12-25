import { eq } from 'drizzle-orm'

import db, { users } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event)
  
  if (!body.token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required',
    })
  }

  // Find user by token
  const user = (
    await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin,
        loginTokenExpiresAt: users.loginTokenExpiresAt,
      })
      .from(users)
      .where(eq(users.loginToken, body.token))
      .limit(1)
  )[0]

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid login token',
    })
  }

  // Check if token is expired
  if (user.loginTokenExpiresAt && user.loginTokenExpiresAt < new Date()) {
    throw createError({
      statusCode: 401,
      message: 'Login token has expired',
    })
  }

  // Set user session
  await setUserId(event, user.id)

  // NOTE: Login links are intentionally multi-use.
  // We keep loginToken/loginTokenExpiresAt intact so users can reuse the same link.
  // Expiration is still enforced above.

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  }
})
