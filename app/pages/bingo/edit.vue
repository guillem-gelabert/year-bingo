<template>
  <div class="p-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-indigo-900 mb-2">El meu bingo de l'any</h1>
        <p v-if="user" class="text-gray-600">Omple les teves 9 prediccions per a l'any!</p>
      </div>

      <!-- Deadline info -->
      <div v-if="deadline" class="bg-white rounded-lg shadow p-4 mb-6">
        <div v-if="canEdit && timeRemaining" class="text-center">
          <p class="text-sm text-gray-600 mb-1">Temps restant per editar:</p>
          <p class="text-2xl font-bold text-indigo-600">
            {{ timeRemaining.days }}d {{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m
          </p>
        </div>
        <div v-else class="text-center">
          <p class="text-lg font-semibold text-gray-700">
            🔒 Edició tancada — la data límit ha passat
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregant el teu bingo...</p>
      </div>

      <!-- Bingo Grid -->
      <div v-else-if="bingoCard" class="bg-white rounded-lg shadow-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="prediction in sortedPredictions" 
            :key="prediction.id"
            class="relative"
          >
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Predicció {{ prediction.position }}
            </label>
            <textarea
              v-model="localPredictions[prediction.id]"
              @input="handleInput(prediction.id)"
              :disabled="!bingoCard.canEdit"
              :class="[
                'w-full h-32 p-3 border-2 rounded-lg resize-none transition',
                bingoCard.canEdit 
                  ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed',
                saveError[prediction.id] ? 'border-red-500' : ''
              ]"
              placeholder="Escriu la teva predicció..."
              maxlength="500"
            />
            
            <!-- Save status indicator -->
            <div class="absolute top-0 right-0 mt-1 mr-1">
              <span 
                v-if="saving[prediction.id]" 
                class="text-xs text-gray-500"
              >
                💾 Desant...
              </span>
              <span 
                v-else-if="saveError[prediction.id]" 
                class="text-xs text-red-500"
                :title="saveError[prediction.id]"
              >
                ❌ Error
              </span>
              <span 
                v-else-if="localPredictions[prediction.id] !== undefined" 
                class="text-xs text-green-500"
              >
                ✓ Desat
              </span>
            </div>

            <!-- Character count -->
            <div class="text-xs text-gray-500 mt-1 text-right">
              {{ (localPredictions[prediction.id] || prediction.description).length }} / 500
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-600">
            Les teves prediccions es desen automàticament mentre escrius.
          </p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="bg-white rounded-lg shadow-xl p-8 text-center">
        <p class="text-red-600 mb-4">No s'ha pogut carregar el bingo. Prova de refrescar la pàgina.</p>
        <button 
          @click="loadData"
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Reintenta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Protect this route - redirect to login if not authenticated
definePageMeta({
  middleware: ['auth']
})

const { user, fetchUser } = useAuth()
const { bingoCard, loading, saving, saveError, fetchMyBingoCard, updatePrediction } = useBingoCard()
const { deadline, canEdit, timeRemaining, fetchDeadline } = useDeadline()

// Local state for input values
const localPredictions = ref<Record<string, string>>({})

// Debounce timers for auto-save
const debounceTimers = ref<Record<string, ReturnType<typeof setTimeout>>>({})

const sortedPredictions = computed(() => {
  if (!bingoCard.value) return []
  return [...bingoCard.value.predictions].sort((a, b) => a.position - b.position)
})

const handleInput = (predictionId: string) => {
  // Clear existing timer
  if (debounceTimers.value[predictionId]) {
    clearTimeout(debounceTimers.value[predictionId])
  }

  // Set new timer for auto-save (500ms debounce)
  debounceTimers.value[predictionId] = setTimeout(async () => {
    const newDescription = localPredictions.value[predictionId]
    if (newDescription !== undefined) {
      try {
        await updatePrediction(predictionId, newDescription)
      } catch (error) {
        console.error('Failed to save prediction:', error)
      }
    }
  }, 500)
}

const loadData = async () => {
  await Promise.all([
    fetchUser(),
    fetchMyBingoCard(),
    fetchDeadline(),
  ])
  
  // Initialize local predictions
  if (bingoCard.value) {
    bingoCard.value.predictions.forEach(p => {
      localPredictions.value[p.id] = p.description
    })
  }
}

onMounted(async () => {
  await loadData()
})

// Cleanup timers on unmount
onUnmounted(() => {
  Object.values(debounceTimers.value).forEach(timer => clearTimeout(timer))
})
</script>
