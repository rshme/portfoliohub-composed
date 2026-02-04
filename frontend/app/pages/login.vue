<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-6xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <!--
        <NuxtLink to="/" class="inline-flex items-center space-x-3 mb-6">
          <img src="/portfoliohub_logo.png" alt="PortfolioHub Logo" class="w-64 h-64 object-contain transform hover:scale-105 transition-transform" />
        </NuxtLink>
        -->
        <h2 class="text-4xl font-bold text-gray-900 mb-3">
          Welcome Back
        </h2>
        <p class="text-lg text-gray-600">
          Choose your demo account or sign in with your credentials
        </p>
      </div>

      <!-- Quick Login Cards - Demo Users -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        <!-- Traditional Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size="18" class="text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="input pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon size="18" class="text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input pl-10 pr-10"
                  placeholder="Enter password"
                  autocomplete="off"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
                >
                  <EyeIcon v-if="!showPassword" size="18" class="text-gray-400" />
                  <EyeOffIcon v-else size="18" class="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
            <AlertCircleIcon size="20" class="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary btn-lg flex-1 flex items-center justify-center"
            >
              <LoaderIcon v-if="isLoading" size="20" class="animate-spin mr-2" />
              <span v-else>Sign in</span>
            </button>
            
            <NuxtLink 
              to="/register" 
              class="btn btn-secondary btn-lg px-6 flex items-center"
            >
              <UserPlusIcon size="20" class="mr-2" />
              Register
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Social Login (Optional) -->
      <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div class="flex items-center justify-center space-x-4">
          <span class="text-sm text-gray-500">Continue with:</span>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <GithubIcon size="18" class="mr-2" />
            GitHub
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <MailIcon size="18" class="mr-2" />
            Google
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Create one now
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockUsers, getUserById, DEMO_PASSWORD } from '../../data/mockUsers'

definePageMeta({
  layout: 'auth',
  middleware: []
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Get redirect URL from query params
const redirectPath = computed(() => route.query.redirect as string || '/dashboard')

// Safe access to mock users
const volunteerUser = mockUsers.find(u => u.role === 'volunteer')
const creatorUser = mockUsers.find(u => u.role === 'project_owner')
const mentorUser = mockUsers.find(u => u.role === 'mentor')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleQuickLogin = async (userId: string) => {
  error.value = ''
  isLoading.value = true

  try {
    // Get user from mock data
    const user = getUserById(userId)
    
    if (!user) {
      error.value = 'Demo user not found'
      return
    }

    // Use the regular login method with demo credentials
    const result = await authStore.login(user.email, DEMO_PASSWORD, user.role)
    
    if (result.success) {
      // If there's a redirect query, use it, otherwise redirect based on role
      if (route.query.redirect) {
        await router.push(redirectPath.value)
      } else {
        // Redirect based on user role
        const roleDashboards = {
          volunteer: '/',
          project_owner: '/',
          mentor: '/'
        }
        await router.push(roleDashboards[user.role] || '/dashboard')
      }
    } else {
      error.value = result.error || 'Quick login failed'
    }
  } catch (err) {
    console.error('Quick login error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

const handleLogin = async () => {
  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    // Don't pass role parameter for regular login - let backend determine the role
    const result = await authStore.login(form.email, form.password)
    
    if (result.success) {
      // If there's a redirect query, use it, otherwise redirect based on role
      if (route.query.redirect) {
        await router.push(redirectPath.value)
      } else {
        // Redirect based on user role to landing page
        await router.push('/')
      }
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'Sign in - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Sign in to PortfolioHub to access your dashboard and collaborate on projects.'
    }
  ]
})
</script>