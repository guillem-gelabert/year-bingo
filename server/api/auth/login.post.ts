export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event)
  
  if (!body.token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required',
    })
  }

  // Find user by token
  const user = await prisma.user.findUnique({
    where: { loginToken: body.token },
  })

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

  // Clear the login token (single use)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginToken: null,
      loginTokenExpiresAt: null,
    },
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
})
