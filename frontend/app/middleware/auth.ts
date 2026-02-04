export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthStore()
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/']
  
  if (!isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})