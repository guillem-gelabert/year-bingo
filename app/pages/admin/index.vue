<template>
  <div class="p-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-indigo-900 mb-2">Admin Panel</h1>
        <p class="text-gray-600">Manage users and view bingo cards</p>
      </div>

      <!-- Generate New User Form -->
      <div class="bg-white rounded-lg shadow-xl p-6 mb-8">
        <h2 class="text-2xl font-bold text-indigo-900 mb-4">Generate New User</h2>
        <form @submit.prevent="handleGenerateUser" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              id="name"
              v-model="newUserName"
              type="text"
              required
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              id="email"
              v-model="newUserEmail"
              type="email"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter user email"
            />
          </div>
          <button
            type="submit"
            :disabled="generating"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ generating ? "Generating..." : "Generate User" }}
          </button>
          <div v-if="generateError" class="text-red-600 text-sm mt-2">
            {{ generateError }}
          </div>
          <div v-if="generateSuccess" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p class="text-green-800 font-semibold mb-2">✅ User created!</p>
            <div class="flex items-center gap-2">
              <input
                :value="generateSuccess"
                readonly
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white"
              />
              <button
                type="button"
                @click="copyToClipboard(generateSuccess!)"
                class="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-bold text-indigo-900 mb-4">All Users</h2>
        <div v-if="loadingUsers" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading users...</p>
        </div>
        <div v-else-if="users.length === 0" class="text-center py-12 text-gray-600">
          No users found. Create your first user above!
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Login Link</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Bingo Card</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in users"
                :key="u.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-4">{{ u.name }}</td>
                <td class="py-3 px-4">{{ u.email || "-" }}</td>
                <td class="py-3 px-4">
                  <div v-if="u.loginUrl" class="flex items-center gap-2">
                    <input
                      :value="u.loginUrl"
                      readonly
                      class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50 max-w-[200px]"
                    />
                    <button
                      @click="copyToClipboard(u.loginUrl)"
                      class="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Copy
                    </button>
                  </div>
                  <span v-else class="text-gray-400 text-sm">No token</span>
                </td>
                <td class="py-3 px-4">
                  <NuxtLink
                    :to="`/admin/bingo/${u.id}`"
                    class="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View Bingo
                  </NuxtLink>
                </td>
                <td class="py-3 px-4">
                  <span
                    v-if="u.isAdmin"
                    class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded font-semibold"
                  >
                    Admin
                  </span>
                  <span v-else class="text-gray-500 text-sm">User</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const { user } = useAuth();

const users = ref<
  Array<{
    id: string;
    name: string;
    email: string | null;
    isAdmin: boolean;
    loginUrl: string | null;
    bingoUrl: string;
  }>
>([]);
const loadingUsers = ref(false);
const newUserName = ref("");
const newUserEmail = ref("");
const generating = ref(false);
const generateError = ref<string | null>(null);
const generateSuccess = ref<string | null>(null);

const fetchUsers = async () => {
  try {
    loadingUsers.value = true;
    const data = await $fetch("/api/admin/users", { credentials: "include" });
    users.value = data;
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
  } finally {
    loadingUsers.value = false;
  }
};

const handleGenerateUser = async () => {
  try {
    generating.value = true;
    generateError.value = null;
    generateSuccess.value = null;

    const body: { name: string; email?: string } = {
      name: newUserName.value,
    };
    if (newUserEmail.value) {
      body.email = newUserEmail.value;
    }

    const data = await $fetch("/api/admin/generate-user", {
      method: "POST",
      body,
      credentials: "include",
    });

    generateSuccess.value = data.loginUrl;
    newUserName.value = "";
    newUserEmail.value = "";
    await fetchUsers();
  } catch (error: any) {
    generateError.value = error.data?.message || error.message || "Failed to generate user";
  } finally {
    generating.value = false;
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

onMounted(async () => {
  await fetchUsers();
});
</script>

