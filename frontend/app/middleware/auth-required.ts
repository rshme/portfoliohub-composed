/**
 * Auth Middleware
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Save the intended destination
    const intendedPath = to.fullPath
    
    // Redirect to login with return URL
    return navigateTo({
      path: '/login',
      query: { redirect: intendedPath }
    })
  }
})
