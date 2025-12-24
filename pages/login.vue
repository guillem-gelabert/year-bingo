<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-indigo-900 mb-6 text-center">
        🎯 Year Bingo Login
      </h1>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Logging you in...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-600 text-5xl mb-4">❌</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Login Failed</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Go Home
        </NuxtLink>
      </div>

      <div v-else-if="success" class="text-center py-8">
        <div class="text-green-600 text-5xl mb-4">✅</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
        <p class="text-gray-600 mb-6">Redirecting to your bingo card...</p>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-600">No login token found in URL. Please use the login link provided to you.</p>
        <NuxtLink 
          to="/" 
          class="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    return
  }

  try {
    loading.value = true
    await login(token)
    success.value = true
    
    // Redirect to bingo edit page after 1 second
    setTimeout(() => {
      router.push('/bingo/edit')
    }, 1000)
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Invalid or expired login token'
  } finally {
    loading.value = false
  }
})
</script>
