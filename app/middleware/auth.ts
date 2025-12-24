export default defineNuxtRouteMiddleware(async (to, from) => {
  // This middleware runs on the client side for protected routes
  const { user, fetchUser } = useAuth()
  
  // Fetch user if not already loaded
  if (user.value === null) {
    try {
      await fetchUser()
    } catch (error) {
      // User not authenticated
      return navigateTo('/login')
    }
  }
  
  // If still no user, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
