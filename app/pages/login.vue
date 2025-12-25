<template>
  <div class="flex items-center justify-center p-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-indigo-900 mb-6 text-center">
        🎯 Inici de sessió — Year Bingo
      </h1>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Iniciant la sessió...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-600 text-5xl mb-4">❌</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Ha fallat l'inici de sessió</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Torna a l'inici
        </NuxtLink>
      </div>

      <div v-else-if="success" class="text-center py-8">
        <div class="text-green-600 text-5xl mb-4">✅</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Sessió iniciada!</h2>
        <p class="text-gray-600 mb-6">Et redirigim al teu bingo...</p>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-600">No s'ha trobat cap token a l'URL. Utilitza l'enllaç d'inici de sessió que t'han proporcionat.</p>
        <NuxtLink 
          to="/" 
          class="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Torna a l'inici
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { login, fetchUser, user } = useAuth()

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    // If already authenticated, go straight to the bingo card.
    await fetchUser()
    if (user.value) {
      router.replace('/bingo/edit')
    }
    return
  }

  try {
    loading.value = true
    await login(token)
    success.value = true

    // Drop token from URL and go to bingo page
    router.replace('/bingo/edit')
  } catch (err: any) {
    error.value = err.data?.message || err.message || "Token d'inici de sessió invàlid o caducat"
  } finally {
    loading.value = false
  }
})
</script>
