<template>
  <div class="p-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Editing disabled message -->
      <div class="bg-white rounded-lg shadow-xl p-8 text-center">
        <div class="text-6xl mb-4">🔒</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Edició deshabilitada</h1>
        <p class="text-gray-600 mb-6">
          L'edició de prediccions ja no està disponible.
        </p>
        <NuxtLink 
          to="/" 
          class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Torna a l'inici
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No authentication required since editing is disabled anyway
</script>
