<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <!--
        <NuxtLink to="/" class="inline-flex items-center space-x-2 mb-8">
          <img src="/portfoliohub_logo.png" alt="PortfolioHub Logo" class="w-12 h-12 object-contain" />
        </NuxtLink>
        -->
        <h2 class="text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </NuxtLink>
        </p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              I want to join as a
            </label>
            <div class="grid grid-cols-1 gap-3">
              <label
                v-for="role in roles"
                :key="role.value"
                class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none"
                :class="[
                  form.role === role.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                ]"
              >
                <input
                  v-model="form.role"
                  type="radio"
                  :value="role.value"
                  class="sr-only"
                />
                <div class="flex flex-1">
                  <div class="flex flex-col">
                    <span
                      class="block text-sm font-medium"
                      :class="[
                        form.role === role.value ? 'text-primary-900' : 'text-gray-900'
                      ]"
                    >
                      {{ role.label }}
                    </span>
                    <span
                      class="block text-sm"
                      :class="[
                        form.role === role.value ? 'text-primary-700' : 'text-gray-500'
                      ]"
                    >
                      {{ role.description }}
                    </span>
                  </div>
                </div>
                <CheckCircleIcon
                  v-if="form.role === role.value"
                  size="20"
                  class="text-primary-600"
                />
              </label>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="input mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div class="relative mt-1">
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  class="input"
                  :class="{
                    'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500': usernameError,
                    'pr-10': isCheckingUsername
                  }"
                  placeholder="Choose a unique username"
                  @blur="checkUsername"
                  @input="usernameError = ''"
                />
                <div v-if="isCheckingUsername" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LoaderIcon size="20" class="text-gray-400 animate-spin" />
                </div>
              </div>
              <p v-if="usernameError" class="mt-1 text-sm text-red-600">
                {{ usernameError }}
              </p>
              <p v-else class="mt-1 text-xs text-gray-500">
                Minimum 3 characters, alphanumeric and underscore only
              </p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="relative mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon v-if="!showPassword" size="20" class="text-gray-400" />
                  <EyeOffIcon v-else size="20" class="text-gray-400" />
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="input mt-1"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <!-- Organization (for project creators) -->
          <div v-if="form.role === 'project_owner'">
            <label for="organization" class="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="organization"
              v-model="form.organization"
              type="text"
              required
              class="input mt-1"
              placeholder="Enter your organization name"
            />
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="/terms" class="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>
            and
            <a href="/privacy" class="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="btn btn-primary btn-lg w-full"
          >
            <LoaderIcon v-if="isLoading" size="20" class="animate-spin mr-2" />
            Create account
          </button>
        </div>
      </form>

      <!-- Social Registration -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="btn btn-secondary btn-md w-full"
          >
            <GithubIcon size="20" class="mr-2" />
            GitHub
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-md w-full"
          >
            <MailIcon size="20" class="mr-2" />
            Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'auth',
  middleware: []
})

const authStore = useAuthStore()
const router = useRouter()

const roles = [
  {
    value: 'volunteer',
    label: 'Volunteer',
    description: 'Join projects to gain real-world experience'
  },
  {
    value: 'project_owner',
    label: 'Project Creator',
    description: 'Create projects and find contributors'
  },
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'Guide and support project teams'
  }
]

const form = reactive({
  role: 'volunteer',
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  organization: '',
  acceptTerms: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const usernameError = ref('')
const isCheckingUsername = ref(false)

const isFormValid = computed(() => {
  return (
    form.role &&
    form.name &&
    form.username &&
    !usernameError.value &&
    form.email &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.acceptTerms &&
    (form.role !== 'project_owner' || form.organization)
  )
})

const checkUsername = async () => {
  if (!form.username || form.username.length < 3) {
    usernameError.value = ''
    return
  }

  isCheckingUsername.value = true
  usernameError.value = ''

  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    const response = await fetch(`${baseURL}/auth/check-username?username=${encodeURIComponent(form.username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (response.status === 409) {
      usernameError.value = 'Username already exists'
    } else if (!response.ok) {
      // Handle other errors silently
      console.error('Username check error:', data)
    }
  } catch (err) {
    console.error('Username check error:', err)
  } finally {
    isCheckingUsername.value = false
  }
}

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    console.log('Starting registration...')
    console.log('Auth store:', authStore)
    console.log('Form data:', form)
    
    const result = await authStore.register({
      email: form.email,
      password: form.password,
      name: form.name,
      username: form.username,
      role: form.role as any,
      organization: form.organization || undefined
    })
    
    console.log('Registration result:', result)
    
    if (result.success) {
      // Redirect to onboarding
      await router.push('/onboarding')
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'Create Account - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Join PortfolioHub to start collaborating on real-world projects and build your portfolio.'
    }
  ]
})
</script>