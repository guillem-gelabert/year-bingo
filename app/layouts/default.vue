<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-900 hover:text-indigo-700">
          🎯 Year Bingo
        </NuxtLink>
        
        <nav class="flex items-center gap-4">
          <template v-if="user">
            <NuxtLink
              v-if="user?.isAdmin"
              to="/admin"
              class="px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-semibold flex items-center gap-1"
            >
              <span>⚙️</span>
              <span>Admin</span>
            </NuxtLink>
            <NuxtLink
              to="/bingo/edit"
              class="px-3 py-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              My Bingo
            </NuxtLink>
            <span class="text-gray-400">|</span>
            <span class="text-sm text-gray-600">{{ user.name }}</span>
            <button
              @click="handleLogout"
              class="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-3 py-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Login
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Page content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout, fetchUser } = useAuth()

const handleLogout = async () => {
  await logout()
}

// Fetch user on mount if not already loaded
onMounted(async () => {
  if (!user.value) {
    try {
      await fetchUser()
    } catch {
      // User not authenticated, that's ok
    }
  }
})
</script>

