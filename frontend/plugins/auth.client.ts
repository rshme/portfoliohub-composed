export default defineNuxtPlugin(async () => {
  const { $pinia } = useNuxtApp()
  
  if (process.client) {
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore($pinia)
    
    // Initialize auth from localStorage
    await authStore.initializeAuth()
  }
})