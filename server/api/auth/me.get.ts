export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    await clearSession(event)
    throw createError({
      statusCode: 401,
      message: 'User not found',
    })
  }

  return user
})
