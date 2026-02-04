<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-1.5 sm:space-x-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xs sm:text-sm">PH</span>
              </div>
              <span class="font-bold text-base sm:text-lg lg:text-xl text-gray-900">PortfolioHub</span>
            </NuxtLink>
          </div>

          <!-- Navigation Links - Desktop -->
          <nav class="hidden md:flex items-center space-x-4 lg:space-x-8">
            <NuxtLink 
              to="/explore" 
              class="text-sm lg:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Explore Projects
            </NuxtLink>
            <NuxtLink 
              v-if="userRole === 'project_owner'"
              to="/my-projects" 
              class="text-sm lg:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              My Projects
            </NuxtLink>
            <NuxtLink 
              v-if="isAuthenticated && (userRole === 'volunteer' || userRole === 'mentor')"
              to="/my-bookmarks" 
              class="text-sm lg:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span class="hidden lg:inline">Bookmarks</span>
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-2 sm:space-x-4">
            <template v-if="isAuthenticated">
              <!-- User Dropdown -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-medium text-xs sm:text-sm">{{ userInitials }}</span>
                  </div>
                  <ChevronDownIcon size="14" class="hidden sm:block text-gray-400 sm:size-4" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <NuxtLink
                    v-if="username"
                    :to="`/users/${username}`"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </NuxtLink>
                  <NuxtLink
                    v-if="userRole === 'volunteer' || userRole === 'mentor'"
                    to="/my-bookmarks"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    My Bookmarks
                  </NuxtLink>
                  <hr class="my-1">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn btn-ghost btn-sm sm:btn-md">
                <span class="hidden sm:inline">Sign in</span>
                <span class="sm:hidden">Login</span>
              </NuxtLink>
              <NuxtLink to="/register" class="btn btn-primary btn-sm sm:btn-md">
                <span class="hidden sm:inline">Get started</span>
                <span class="sm:hidden">Sign up</span>
              </NuxtLink>
            </template>
            
            <!-- Mobile Menu Button -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg v-if="!showMobileMenu" class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Navigation Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
          <nav class="px-3 py-4 space-y-1">
            <NuxtLink 
              @click="closeMobileMenu"
              to="/explore" 
              class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Explore Projects
            </NuxtLink>
            <NuxtLink 
              v-if="userRole === 'project_owner'"
              @click="closeMobileMenu"
              to="/my-projects" 
              class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              My Projects
            </NuxtLink>
            <NuxtLink 
              v-if="isAuthenticated && (userRole === 'volunteer' || userRole === 'mentor')"
              @click="closeMobileMenu"
              to="/my-bookmarks" 
              class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              My Bookmarks
            </NuxtLink>
            
            <template v-if="isAuthenticated">
              <div class="pt-3 mt-3 border-t border-gray-200">
                <NuxtLink 
                  v-if="username"
                  @click="closeMobileMenu"
                  :to="`/users/${username}`" 
                  class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="handleLogoutMobile"
                  class="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </template>
          </nav>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 sm:mt-16 lg:mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div class="col-span-1 sm:col-span-2">
            <div class="flex items-center space-x-2 mb-3 sm:mb-4">
              <div class="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xs sm:text-sm">PH</span>
              </div>
              <span class="font-bold text-lg sm:text-xl text-gray-900">PortfolioHub</span>
            </div>
            <p class="text-sm sm:text-base text-gray-600 mb-4">
              Connect fresh graduates and career switchers with real-world projects from startups, open source, and NGOs.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <GithubIcon size="20" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <TwitterIcon size="20" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600">
                <LinkedinIcon size="20" />
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Platform</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/explore" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Explore Projects</NuxtLink></li>
              <li><NuxtLink to="/how-it-works" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">How it Works</NuxtLink></li>
              <li><NuxtLink to="/success-stories" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Success Stories</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Support</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/help" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Help Center</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/terms" class="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</NuxtLink></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p class="text-xs sm:text-sm text-gray-600">&copy; 2024 PortfolioHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated, userInitials } = storeToRefs(authStore)

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref<HTMLElement>()
const username = ref('')
const userRole = ref('')

// Get username and role from localStorage
onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const authUser = localStorage.getItem('auth_user')
      if (authUser) {
        const user = JSON.parse(authUser)
        username.value = user.username || ''
        userRole.value = user.role || ''
      }
    } catch (error) {
      console.error('Error parsing auth_user from localStorage:', error)
    }
  }
})

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
}

const handleLogoutMobile = async () => {
  await authStore.logout()
  showMobileMenu.value = false
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  showMobileMenu.value = false
})
</script>