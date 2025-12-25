<template>
  <div class="p-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-indigo-900 mb-2">El bingo de l'any de tothom</h1>
        <p class="text-gray-600">Mira què ha predit tothom per a l'any!</p>
      </div>

      <!-- Not available message -->
      <div v-if="!isPublicViewEnabled" class="bg-white rounded-lg shadow-xl p-8 text-center">
        <div class="text-6xl mb-4">🔒</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Encara no disponible</h2>
        <p class="text-gray-600 mb-6">
          Els bingos seran visibles públicament després del 31 de desembre, 23:59:59.
        </p>
        <div v-if="timeRemaining" class="mb-6">
          <p class="text-sm text-gray-600 mb-2">Temps restant:</p>
          <p class="text-3xl font-bold text-indigo-600">
            {{ timeRemaining.days }}d {{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m
          </p>
        </div>
        <NuxtLink 
          to="/" 
          class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Torna a l'inici
        </NuxtLink>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregant bingos...</p>
      </div>

      <!-- Bingo cards grid -->
      <div v-else-if="bingoCards && bingoCards.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          v-for="card in bingoCards" 
          :key="card.id"
          class="bg-white rounded-lg shadow-xl p-6"
        >
          <h2 class="text-2xl font-bold text-indigo-900 mb-4 text-center">
            Prediccions de {{ card.user.name }}
          </h2>
          
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="prediction in sortPredictions(card.predictions)" 
              :key="prediction.id"
              class="border-2 border-gray-200 rounded-lg p-3 min-h-[120px] flex items-center justify-center text-center"
            >
              <p class="text-sm text-gray-700">
                {{ prediction.description || '(Buit)' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg shadow-xl p-8 text-center">
        <p class="text-gray-600">Encara no hi ha bingos. Sigues el primer a crear-ne un!</p>
        <NuxtLink 
          v-if="user"
          to="/bingo/edit" 
          class="inline-block mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Crea el teu bingo
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { user, fetchUser } = useAuth()
const { isPublicViewEnabled, timeRemaining, fetchDeadline } = useDeadline()

const bingoCards = ref<any[]>([])
const loading = ref(false)

const sortPredictions = (predictions: any[]) => {
  return [...predictions].sort((a, b) => a.position - b.position)
}

const fetchBingoCards = async () => {
  if (!isPublicViewEnabled.value) return
  
  try {
    loading.value = true
    bingoCards.value = await $fetch('/api/bingo/all')
  } catch (error) {
    console.error('Failed to fetch bingo cards:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchUser()
  await fetchDeadline()
  await fetchBingoCards()
})
</script>
