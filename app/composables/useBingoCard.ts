import { ref } from 'vue'
import type { Ref } from 'vue'

interface Prediction {
  id: string
  position: number
  description: string
}

interface BingoCard {
  id: string
  predictions: Prediction[]
  canEdit: boolean
}

export const useBingoCard = () => {
  const bingoCard: Ref<BingoCard | null> = ref(null)
  const loading = ref(false)
  const saving = ref<Record<string, boolean>>({})
  const saveError = ref<Record<string, string>>({})

  const fetchMyBingoCard = async () => {
    try {
      loading.value = true
      const data = await $fetch('/api/bingo/my')
      bingoCard.value = data as BingoCard
    } catch (error: any) {
      console.error('Failed to fetch bingo card:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePrediction = async (predictionId: string, description: string) => {
    try {
      saving.value[predictionId] = true
      delete saveError.value[predictionId]

      const updated = await $fetch(`/api/bingo/predictions/${predictionId}`, {
        method: 'PUT',
        body: { description },
      })

      // Update local state
      if (bingoCard.value) {
        const index = bingoCard.value.predictions.findIndex(p => p.id === predictionId)
        if (index !== -1) {
          bingoCard.value.predictions[index] = updated as Prediction
        }
      }

      return updated
    } catch (error: any) {
      saveError.value[predictionId] = error.message || "No s'ha pogut desar"
      throw error
    } finally {
      saving.value[predictionId] = false
    }
  }

  return {
    bingoCard: readonly(bingoCard),
    loading: readonly(loading),
    saving: readonly(saving),
    saveError: readonly(saveError),
    fetchMyBingoCard,
    updatePrediction,
  }
}
