export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const loading = useState('auth-loading', () => false)

  const fetchUser = async () => {
    try {
      loading.value = true
      const data = await $fetch('/api/auth/me')
      user.value = data
    } catch (error) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (token: string) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { token },
    })
    user.value = data.user
    return data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    user.value = null
    navigateTo('/')
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    fetchUser,
    login,
    logout,
  }
}
