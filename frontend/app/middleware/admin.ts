export default defineNuxtRouteMiddleware((to, from) => {
  // Check if running on client side
  if (process.client) {
    const authUser = localStorage.getItem('auth_user')
    
    if (!authUser) {
      // No user logged in, redirect to login
      return navigateTo('/login')
    }
    
    try {
      const user = JSON.parse(authUser)
      
      // Check if user has admin role
      if (user.role !== 'admin') {
        // Not an admin, redirect to dashboard
        return navigateTo('/dashboard')
      }
    } catch (error) {
      console.error('Error parsing auth_user:', error)
      return navigateTo('/login')
    }
  }
})
