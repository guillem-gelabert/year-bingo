import { eq } from 'drizzle-orm'

import db, { users } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  const user = (
    await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  )[0]

  if (!user) {
    await clearSession(event)
    throw createError({
      statusCode: 401,
      message: 'User not found',
    })
  }

  return user
})
