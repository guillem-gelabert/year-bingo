// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET,
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },
})
