export default defineEventHandler(async (event) => {
  // Get the path
  const path = event.path

  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/auth/login',
    '/api/deadline',
  ]

  // Check if it's an API route
  if (path.startsWith('/api/')) {
    // Allow public routes
    if (publicRoutes.some(route => path.startsWith(route))) {
      return
    }

    // Allow public bingo view after deadline
    if (path === '/api/bingo/all' && isPublicViewEnabled()) {
      return
    }

    // Check authentication for protected API routes
    const userId = await getUserId(event)
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required',
      })
    }
  }
})
