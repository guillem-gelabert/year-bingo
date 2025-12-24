import { ref, computed } from 'vue'

export const useDeadline = () => {
  const deadline = ref<Date | null>(null)
  const isBeforeDeadline = ref(true)
  const canEdit = ref(true)
  const isPublicViewEnabled = ref(false)

  const fetchDeadline = async () => {
    try {
      const data = await $fetch('/api/deadline')
      deadline.value = new Date(data.deadline)
      isBeforeDeadline.value = data.isBeforeDeadline
      canEdit.value = data.canEdit
      isPublicViewEnabled.value = data.isPublicViewEnabled
    } catch (error) {
      console.error('Failed to fetch deadline:', error)
    }
  }

  const timeRemaining = computed(() => {
    if (!deadline.value) return null
    
    const now = new Date()
    const diff = deadline.value.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  })

  return {
    deadline: readonly(deadline),
    isBeforeDeadline: readonly(isBeforeDeadline),
    canEdit: readonly(canEdit),
    isPublicViewEnabled: readonly(isPublicViewEnabled),
    timeRemaining,
    fetchDeadline,
  }
}
