/**
 * API Client Composable
 * Provides a centralized way to make API requests with proper error handling
 */

export interface ApiResponse<T = any> {
  statusCode: number
  message: string
  data?: T
  error?: string
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Base API URL - defaults to localhost:3000 if not configured
  const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'

  /**
   * Make API request with proper error handling
   */
  const makeRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const url = `${baseURL}${endpoint}`
      
      // Get token from localStorage if available
      let token: string | null = null
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('auth_token')
      }

      // Set default headers
      const headers: Record<string, string> = {}
      
      // Don't set Content-Type for FormData, let browser set it with boundary
      const isFormData = options.body instanceof FormData
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json'
      }
      
      // Merge with custom headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headers[key] = value
          }
        })
      }

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized - Clear auth and redirect to login
        if (response.status === 401) {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          }
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        
        throw data as ApiError
      }

      return data as ApiResponse<T>
    } catch (error: any) {
      // Handle API errors
      if (error.statusCode) {
        // Handle 401 Unauthorized in catch block as well
        if (error.statusCode === 401) {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          }
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        
        throw error as ApiError
      }
      
      // Handle network errors
      throw {
        statusCode: 500,
        message: 'Network error occurred',
        error: 'NetworkError',
      } as ApiError
    }
  }

  /**
   * GET request
   */
  const get = <T = any>(endpoint: string, options?: RequestInit) => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  const post = <T = any>(endpoint: string, body?: any, options?: RequestInit) => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PUT request
   */
  const put = <T = any>(endpoint: string, body?: any, options?: RequestInit) => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PATCH request
   */
  const patch = <T = any>(endpoint: string, body?: any, options?: RequestInit) => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * DELETE request
   */
  const del = <T = any>(endpoint: string, options?: RequestInit) => {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * User API Methods
   */
  const getUserByUsername = async (username: string) => {
    return get(`/users/username/${username}`)
  }

  const getUserStatistics = async (userId: string) => {
    return get(`/users/${userId}/statistics`)
  }

  const getUserVolunteerProfile = async (username: string) => {
    return get(`/users/volunteer/username/${username}`)
  }

  const getUserMentorProfile = async (username: string) => {
    return get(`/users/mentor/username/${username}`)
  }

  const getUserProjectCreatorProfile = async (username: string) => {
    return get(`/users/project-owner/username/${username}`)
  }

  const updateUserProfile = async (profileData: any) => {
    return put(`/users/profile`, profileData)
  }

  /**
   * Skills API Methods
   */
  const getSkills = async () => {
    return get(`/skills`)
  }

  /**
   * Categories API Methods
   */
  const getCategories = async () => {
    return get(`/categories`)
  }

  /**
   * Project API Methods
   */
  const getProjectsByCreator = async (creatorId: string) => {
    return get(`/projects/creator/${creatorId}`)
  }

  return {
    makeRequest,
    get,
    post,
    put,
    patch,
    delete: del,
    // User methods
    getUserByUsername,
    getUserStatistics,
    getUserVolunteerProfile,
    getUserMentorProfile,
    getUserProjectCreatorProfile,
    updateUserProfile,
    // Skills methods
    getSkills,
    // Categories methods
    getCategories,
    // Project methods
    getProjectsByCreator,
  }
}
