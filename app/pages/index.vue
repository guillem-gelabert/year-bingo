<template>
  <div class="flex items-center justify-center p-4 py-12">
    <div class="max-w-2xl w-full text-center">
      <h1 class="text-6xl font-bold text-indigo-900 mb-6">
        🎯 Year Bingo
      </h1>
      
      <p class="text-xl text-gray-700 mb-8">
        Fes 9 prediccions per a l'any vinent. Després del 31 de desembre, compara les prediccions de tothom!
      </p>

      <!-- Catchy stats -->
      <div class="bg-white rounded-lg shadow-xl p-6 mb-8">
        <p class="text-lg font-semibold text-gray-900">
          ⏳ Queden <span class="text-indigo-700">{{ countdownText }}</span> per tancar edicions.
        </p>
        <p class="text-gray-700 mt-2">
          Mentrestant, la resta ja han escrit <span class="font-bold text-purple-700">{{ otherPredictionsCountText }}</span>.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Com funciona</h2>
        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <span class="text-2xl mr-4">1️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Demana un enllaç d'inici de sessió</h3>
              <p class="text-gray-600">Contacta amb l'administració per obtenir el teu enllaç personalitzat</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">2️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Crea el teu bingo</h3>
              <p class="text-gray-600">Omple 9 prediccions per a l'any vinent</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">3️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Edita fins al 31 de desembre</h3>
              <p class="text-gray-600">Pots modificar les teves prediccions fins a la data límit</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">4️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Mira les prediccions de tothom</h3>
              <p class="text-gray-600">Després de la data límit, tots els bingos es fan públics!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          v-if="user" 
          to="/bingo/edit" 
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Vés al meu bingo
        </NuxtLink>
        
        <NuxtLink 
          v-if="isPublicViewEnabled" 
          to="/bingo" 
          class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Veure tots els bingos
        </NuxtLink>
      </div>

      <div v-if="!user" class="mt-8 text-gray-600">
        <p>Tens un enllaç d'inici de sessió? <NuxtLink to="/login" class="text-indigo-600 font-semibold hover:underline">Fes clic aquí per iniciar sessió</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { user, fetchUser } = useAuth()
const { isPublicViewEnabled, fetchDeadline, timeRemaining } = useDeadline()

const otherPredictionsCount = ref<number | null>(null)

const countdownText = computed(() => {
  if (!timeRemaining.value) return '0d 0h 0m'
  return `${timeRemaining.value.days}d ${timeRemaining.value.hours}h ${timeRemaining.value.minutes}m`
})

const otherPredictionsCountText = computed(() => {
  if (otherPredictionsCount.value === null) return '…'
  const n = otherPredictionsCount.value
  return `${n} prediccions`
})

const fetchOtherPredictionsCount = async () => {
  try {
    const data = await $fetch<{ count: number }>('/api/stats/predictions', {
      credentials: 'include',
    })
    otherPredictionsCount.value = Number(data.count ?? 0)
  } catch {
    otherPredictionsCount.value = null
  }
}

onMounted(async () => {
  await Promise.all([
    fetchUser(),
    fetchDeadline(),
    fetchOtherPredictionsCount(),
  ])
})
</script>
