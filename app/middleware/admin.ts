export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()

  // Fetch user if not already loaded
  if (user.value === null) {
    await fetchUser()
  }

  // If not authenticated, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }

  // Check if user is admin
  if (!user.value.isAdmin) {
    return navigateTo('/')
  }
})
