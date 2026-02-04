import { defineStore } from 'pinia'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'
import type { ApiResponse, ApiError } from '../composables/useApi'

export interface User {
  id: string
  email: string
  name: string
  username: string
  role: 'project_owner' | 'mentor' | 'volunteer' | 'admin'
  avatar?: string
  skills?: string[]
  organization?: string
  bio?: string
  github?: string
  linkedin?: string
  created_at: string
  // Mentor-specific fields
  title?: string
  expertise?: string[]
  experience_years?: number
  availability?: 'available' | 'limited' | 'unavailable'
  max_mentees?: number
  current_mentees?: number
  projects_mentored?: number
  rating?: number
  total_reviews?: number
  hourly_rate?: number
  languages?: string[]
  timezone?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasCompletedOnboarding: boolean
  bookmarkedProjects: string[] // Array of project IDs
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    hasCompletedOnboarding: false,
    bookmarkedProjects: [],
  }),

  getters: {
    isProjectCreator: (state) => state.user?.role === 'project_owner',
    isMentor: (state) => state.user?.role === 'mentor',
    isVolunteer: (state) => state.user?.role === 'volunteer',
    isAdmin: (state) => state.user?.role === 'admin',
    userInitials: (state) => {
      if (!state.user?.name) return ''
      return state.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  actions: {
    async login(email: string, password: string, role?: User['role']) {
      this.isLoading = true
      
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        // Get token from localStorage if available
        let token: string | null = null
        if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem('auth_token')
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${baseURL}/auth/login`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, password } as LoginRequest),
        })

        const data = await response.json()

        if (!response.ok) {
          throw data
        }

        const apiResponse = data as ApiResponse<AuthResponse>

        if (apiResponse.data) {
          const { user: backendUser, accessToken } = apiResponse.data

          // Map backend role to frontend role
          // Priority:
          // 1. If role parameter provided, use it (for demo quick login with specific roles)
          // 2. If backend provides a role, use it (admin or any other role from backend)
          // 3. Default to 'volunteer' for fallback
          let mappedRole: User['role']
          if (role) {
            // Override for demo quick login
            mappedRole = role
          } else if (backendUser.role && (backendUser.role === 'admin' || backendUser.role === 'mentor' || backendUser.role === 'project_owner' || backendUser.role === 'volunteer')) {
            // Use backend role if it's a valid role
            mappedRole = backendUser.role as User['role']
          } else {
            // Fallback to volunteer
            mappedRole = 'volunteer'
          }

          // Map backend user to frontend user format
          this.user = {
            id: backendUser.id,
            email: backendUser.email,
            username: backendUser.username,
            name: backendUser.fullName,
            role: mappedRole,
            avatar: backendUser.avatarUrl || '',
            bio: backendUser.bio || '',
            github: backendUser.socialLinks?.github,
            linkedin: backendUser.socialLinks?.linkedin,
            created_at: backendUser.createdAt,
            skills: [],
          }

          this.isAuthenticated = true

          // Store in localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_user', JSON.stringify(this.user))
            localStorage.setItem('auth_token', accessToken)

            // Check onboarding status
            const hasCompletedBefore = localStorage.getItem(`onboarding_completed_${this.user.id}`) === 'true'
            this.hasCompletedOnboarding = hasCompletedBefore

            // Load user's bookmarks
            this.loadBookmarks()
          }

          return { success: true, role: this.user.role }
        }

        return { success: false, error: 'Login failed' }
      } catch (error: any) {
        console.error('API Login error:', error)
        
        // Handle specific error cases
        if (error.statusCode === 401) {
          return { success: false, error: 'Invalid email or password' }
        }
        
        if (error.statusCode === 400) {
          const errorMessage = Array.isArray(error.message) 
            ? error.message.join(', ') 
            : error.message
          return { success: false, error: errorMessage }
        }
        
        return { success: false, error: 'An error occurred during login' }
      } finally {
        this.isLoading = false
      }
    },
    
    async register(userData: {
      email: string
      password: string
      name: string
      role?: User['role']
      organization?: string
      username?: string
    }) {
      this.isLoading = true
      
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        // Generate username from email if not provided
        const username = userData.username || userData.email.split('@')[0]
        
        const response = await fetch(`${baseURL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            username,
            password: userData.password,
            fullName: userData.name,
            role: userData.role, // Send the selected role to backend
          } as RegisterRequest),
        })

        const data = await response.json()

        if (!response.ok) {
          throw data
        }

        const apiResponse = data as ApiResponse<AuthResponse>

        if (apiResponse.data) {
          const { user: backendUser, accessToken } = apiResponse.data

          // Map backend role to frontend role
          // Priority:
          // 1. If backend provides a valid role, use it (this is the actual saved role)
          // 2. If userData has role, use it as fallback
          // 3. Default to 'volunteer'
          let userRole: User['role']
          if (backendUser.role && (backendUser.role === 'admin' || backendUser.role === 'mentor' || backendUser.role === 'project_owner' || backendUser.role === 'volunteer')) {
            // Use backend role if it's a valid role (this is the actual saved role)
            userRole = backendUser.role as User['role']
          } else if (userData.role) {
            // Fallback to userData role
            userRole = userData.role
          } else {
            // Final fallback to volunteer
            userRole = 'volunteer'
          }

          // Map backend user to frontend user format
          this.user = {
            id: backendUser.id,
            email: backendUser.email,
            username: backendUser.username,
            name: backendUser.fullName,
            role: userRole,
            avatar: backendUser.avatarUrl || '',
            bio: backendUser.bio || '',
            github: backendUser.socialLinks?.github,
            linkedin: backendUser.socialLinks?.linkedin,
            created_at: backendUser.createdAt,
            skills: [],
          }

          this.isAuthenticated = true
          this.hasCompletedOnboarding = false

          // Store in localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_user', JSON.stringify(this.user))
            localStorage.setItem('auth_token', accessToken)
          }

          return { success: true }
        }

        return { success: false, error: 'Registration failed' }
      } catch (error: any) {
        console.error('API Registration error:', error)
        
        // Handle specific error cases
        if (error.statusCode === 409) {
          return { success: false, error: 'Email or username already exists' }
        }
        
        if (error.statusCode === 400) {
          const errorMessage = Array.isArray(error.message) 
            ? error.message.join(', ') 
            : error.message
          return { success: false, error: errorMessage }
        }
        
        return { success: false, error: 'An error occurred during registration' }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Get token before clearing
        let token: string | null = null
        if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem('auth_token')
        }

        // Call logout API if token exists
        if (token) {
          const config = useRuntimeConfig()
          const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'

          try {
            await fetch(`${baseURL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            })
          } catch (error) {
            console.error('Logout API error:', error)
            // Continue with local logout even if API call fails
          }
        }

        // Clear local state
        this.user = null
        this.isAuthenticated = false
        this.hasCompletedOnboarding = false
        this.bookmarkedProjects = []
        
        // Clear localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_token')
          // Note: We keep onboarding_completed status and bookmarks for when user logs in again
        }
        
        // Redirect to login
        await navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout even if there's an error
        this.user = null
        this.isAuthenticated = false
        this.hasCompletedOnboarding = false
        this.bookmarkedProjects = []
        
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_token')
        }
        
        await navigateTo('/login')
      }
    },

    async initializeAuth() {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('auth_user')
        
        if (token && userData) {
          try {
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
            
            // Check user-specific onboarding completion status
            if (this.user) {
              const hasCompletedBefore = localStorage.getItem(`onboarding_completed_${this.user.id}`) === 'true'
              this.hasCompletedOnboarding = hasCompletedBefore
              
              // Load user's bookmarks
              this.loadBookmarks()
            } else {
              this.hasCompletedOnboarding = false
            }
          } catch (error) {
            console.error('Failed to parse stored user data:', error)
            this.logout()
          }
        }
      }
    },

    completeOnboarding() {
      this.hasCompletedOnboarding = true
      if (typeof localStorage !== 'undefined' && this.user) {
        // Store completion status specific to this user
        localStorage.setItem(`onboarding_completed_${this.user.id}`, 'true')
        
        // Also update the user object in localStorage
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      }
    },

    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(this.user))
        }
      }
    },
    
    /**
     * Reset onboarding status for a specific user (useful for testing)
     * @param userId - The user ID to reset onboarding for. If not provided, uses current user.
     */
    resetOnboarding(userId?: string) {
      const targetUserId = userId || this.user?.id
      if (!targetUserId) {
        console.warn('No user ID provided and no current user')
        return
      }
      
      this.hasCompletedOnboarding = false
      
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`onboarding_completed_${targetUserId}`)
        console.log(`Onboarding status reset for user: ${targetUserId}`)
      }
    },
    
    /**
     * Clear all onboarding completion records from localStorage (admin/debug function)
     */
    clearAllOnboardingData() {
      if (typeof localStorage !== 'undefined') {
        // Get all localStorage keys
        const keys = Object.keys(localStorage)
        const onboardingKeys = keys.filter(key => key.startsWith('onboarding_completed_'))
        
        onboardingKeys.forEach(key => {
          localStorage.removeItem(key)
        })
        
        console.log(`Cleared ${onboardingKeys.length} onboarding records`)
      }
    },

    /**
     * Toggle bookmark status for a project
     * @param projectId - The project ID to bookmark/unbookmark
     */
    toggleBookmark(projectId: string) {
      const index = this.bookmarkedProjects.indexOf(projectId)
      
      if (index > -1) {
        // Remove bookmark
        this.bookmarkedProjects.splice(index, 1)
      } else {
        // Add bookmark
        this.bookmarkedProjects.push(projectId)
      }
      
      // Save to localStorage
      if (typeof localStorage !== 'undefined' && this.user) {
        localStorage.setItem(`bookmarks_${this.user.id}`, JSON.stringify(this.bookmarkedProjects))
      }
    },

    /**
     * Check if a project is bookmarked
     * @param projectId - The project ID to check
     */
    isBookmarked(projectId: string): boolean {
      return this.bookmarkedProjects.includes(projectId)
    },

    /**
     * Load bookmarks from localStorage for current user
     */
    loadBookmarks() {
      if (typeof localStorage !== 'undefined' && this.user) {
        const savedBookmarks = localStorage.getItem(`bookmarks_${this.user.id}`)
        if (savedBookmarks) {
          try {
            this.bookmarkedProjects = JSON.parse(savedBookmarks)
          } catch (error) {
            console.error('Failed to parse bookmarks:', error)
            this.bookmarkedProjects = []
          }
        }
      }
    }
  }
})