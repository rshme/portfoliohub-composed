export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const { isAuthenticated, hasCompletedOnboarding, user } = authStore
  
  // Skip onboarding check for these routes
  const skipOnboardingRoutes = ['/login', '/register', '/onboarding', '/']
  
  // If user is authenticated and hasn't completed onboarding
  // And they're trying to access a protected route (not in skip list)
  if (isAuthenticated && !hasCompletedOnboarding && !skipOnboardingRoutes.includes(to.path)) {
    console.log('Redirecting to onboarding:', {
      user: user?.email,
      hasCompleted: hasCompletedOnboarding,
      attemptedPath: to.path
    })
    return navigateTo('/onboarding')
  }
  
  // If user is authenticated, has completed onboarding, but is trying to access onboarding page
  // Redirect them to dashboard instead
  if (isAuthenticated && hasCompletedOnboarding && to.path === '/onboarding') {
    console.log('User already completed onboarding, redirecting to dashboard')
    return navigateTo('/dashboard')
  }
})