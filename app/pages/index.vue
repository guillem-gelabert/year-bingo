<template>
  <div class="p-4 py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-indigo-900 mb-4">
          🎯 Year Bingo
        </h1>
        <p class="text-xl text-gray-700">
          Totes les prediccions per a l'any!
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregant prediccions...</p>
      </div>

      <!-- Predictions grid -->
      <div v-else-if="randomizedPredictions.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div 
          v-for="prediction in randomizedPredictions" 
          :key="prediction.id"
          class="bg-white rounded-lg shadow-lg p-5 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-200"
        >
          <p class="text-gray-800 text-center">
            {{ prediction.description || '(Buit)' }}
          </p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg shadow-xl p-8 text-center">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-gray-600">Encara no hi ha prediccions.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Prediction {
  id: string
  description: string
  position: number
}

const allPredictions = ref<Prediction[]>([])
const loading = ref(false)

// Fisher-Yates shuffle for randomization
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const randomizedPredictions = computed(() => {
  return shuffleArray(allPredictions.value)
})

const fetchAllPredictions = async () => {
  try {
    loading.value = true
    // API now returns anonymous predictions directly (no author info)
    allPredictions.value = await $fetch<Prediction[]>('/api/bingo/all')
  } catch (error) {
    console.error('Failed to fetch predictions:', error)
    allPredictions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAllPredictions()
})
</script>
