export default defineEventHandler(async (event) => {
  await clearSession(event)
  
  return {
    success: true,
  }
})
