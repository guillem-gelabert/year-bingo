<template>
  <div class="p-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <NuxtLink to="/admin" class="hover:text-indigo-600">Admin</NuxtLink>
          <span>/</span>
          <span>View Bingo Card</span>
        </div>
        <h1 class="text-4xl font-bold text-indigo-900 mb-2">
          {{ bingoCard?.userName || "Loading..." }}
        </h1>
        <p v-if="bingoCard?.userEmail" class="text-gray-600">{{ bingoCard.userEmail }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading bingo card...</p>
      </div>

      <!-- Bingo Grid -->
      <div v-else-if="bingoCard" class="bg-white rounded-lg shadow-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="prediction in sortedPredictions"
            :key="prediction.id"
            class="border-2 border-gray-300 rounded-lg p-4 min-h-[120px]"
          >
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Prediction {{ prediction.position }}
            </label>
            <p class="text-gray-800 whitespace-pre-wrap">
              {{ prediction.description || "(empty)" }}
            </p>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <NuxtLink
            to="/admin"
            class="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            ← Back to Admin Panel
          </NuxtLink>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="bg-white rounded-lg shadow-xl p-8 text-center">
        <p class="text-red-600 mb-4">{{ error || "Failed to load bingo card." }}</p>
        <div class="flex gap-4 justify-center">
          <button
            @click="fetchBingoCard"
            class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Retry
          </button>
          <NuxtLink
            to="/admin"
            class="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Back to Admin
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const route = useRoute();

const bingoCard = ref<{
  id: string;
  userId: string;
  predictions: Array<{
    id: string;
    position: number;
    description: string;
  }>;
  userName?: string;
  userEmail?: string;
} | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const sortedPredictions = computed(() => {
  if (!bingoCard.value) return [];
  return [...bingoCard.value.predictions].sort((a, b) => a.position - b.position);
});

const fetchBingoCard = async () => {
  try {
    loading.value = true;
    error.value = null;
    const userId = route.params.userId as string;
    const data = await $fetch(`/api/admin/bingo/${userId}`, {
      credentials: "include",
    });
    bingoCard.value = data;
  } catch (err: any) {
    console.error("Failed to fetch bingo card:", err);
    error.value = err.data?.message || err.message || "Failed to load bingo card";
    bingoCard.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchBingoCard();
});
</script>
