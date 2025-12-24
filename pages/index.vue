<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full text-center">
      <h1 class="text-6xl font-bold text-indigo-900 mb-6">
        🎯 Year Bingo
      </h1>
      
      <p class="text-xl text-gray-700 mb-8">
        Make 9 predictions for the upcoming year. After December 31st, see how everyone's predictions compare!
      </p>

      <div class="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">How it works</h2>
        <div class="space-y-4 text-left">
          <div class="flex items-start">
            <span class="text-2xl mr-4">1️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Request a login link</h3>
              <p class="text-gray-600">Contact the admin to get your personalized login link</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">2️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Create your bingo card</h3>
              <p class="text-gray-600">Fill in 9 predictions for the upcoming year</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">3️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">Edit until December 31st</h3>
              <p class="text-gray-600">You can modify your predictions anytime before the deadline</p>
            </div>
          </div>
          <div class="flex items-start">
            <span class="text-2xl mr-4">4️⃣</span>
            <div>
              <h3 class="font-semibold text-gray-900">See everyone's predictions</h3>
              <p class="text-gray-600">After the deadline, all bingo cards become public!</p>
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
          Go to My Bingo Card
        </NuxtLink>
        
        <NuxtLink 
          v-if="isPublicViewEnabled" 
          to="/bingo" 
          class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          View All Bingo Cards
        </NuxtLink>
      </div>

      <div v-if="!user" class="mt-8 text-gray-600">
        <p>Have a login link? <NuxtLink to="/login" class="text-indigo-600 font-semibold hover:underline">Click here to log in</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth()
const { isPublicViewEnabled, fetchDeadline } = useDeadline()

onMounted(async () => {
  await Promise.all([
    fetchUser(),
    fetchDeadline(),
  ])
})
</script>
