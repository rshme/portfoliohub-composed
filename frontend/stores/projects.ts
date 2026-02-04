import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export interface GalleryImage {
  id: string
  url: string
  caption: string
  type: 'diagram' | 'mockup' | 'screenshot' | 'photo'
}

export interface ProjectCategory {
  id: string
  name: string
  icon: string
  description: string
}

export interface ProjectSkill {
  id: string
  name: string
  icon: string
  isMandatory: boolean
}

export interface RecommendedProject {
  projectId: string
  projectName: string
  similarityScore: number
  similarityPercentage: number
  matchingSkillsCount: number
  totalProjectSkills: number
  matchingSkills: string[]
  project: ApiProject
}

export interface ApiProject {
  id: string
  creatorId: string
  creator: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
    socialLinks: Record<string, string>
    createdAt: string
    updatedAt: string
  }
  name: string
  description: string
  status: 'active' | 'in_progress' | 'completed' | 'paused'
  level: 'beginner' | 'intermediate' | 'advanced'
  volunteersNeeded: number
  volunteerCount: number
  startDate: string
  endDate: string
  links: {
    github?: string
    discord?: string
  }
  images: string[] | null
  bannerUrl: string | null
  isVerified: boolean
  verifiedBy: string | null
  verifier?: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  }
  createdAt: string
  updatedAt: string
  volunteers: any[] | null
  mentors: any[] | null
  categories: ProjectCategory[]
  skills: ProjectSkill[]
}

export interface Project {
  id: string
  name: string
  description: string
  creator: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
    socialLinks?: Record<string, string>
    name?: string
    avatar?: string
    organization?: string
  }
  tags: string[]
  skills_required: string[]
  volunteers_needed: number
  volunteers_joined: number
  volunteersNeeded?: number
  volunteerCount?: number
  status: 'open' | 'in_progress' | 'completed' | 'paused' | 'active'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration_estimate: string
  github_url?: string
  discord_url?: string
  links?: {
    github?: string
    discord?: string
  }
  created_at: string
  updated_at: string
  startDate?: string
  endDate?: string
  bannerUrl?: string | null
  gallery?: GalleryImage[]
  milestones: Milestone[]
  volunteers: any[]
  mentors: any[]
  tasks: ProjectTask[]
  categories?: ProjectCategory[]
  skills?: ProjectSkill[]
  isVerified?: boolean
  verifier?: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  }
}

export interface Milestone {
  id: string
  projectId: string
  name: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  orderPosition: number
  startDate: string
  endDate: string
  tags: string[]
  createdAt: string
  updatedAt: string
  taskCount: number
  completedTaskCount: number
  completionPercentage: number
}

export interface ProjectVolunteer {
  id: string
  user_id: string
  user?: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  }
  name: string
  avatar?: string
  skills: string[]
  joined_at: string
  contribution_score: number
  status: 'active' | 'inactive'
  tasks_completed?: number
}

export interface ProjectMentor {
  id: string
  user_id: string
  user?: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  }
  name: string
  avatar?: string
  expertise: string[]
  assigned_at: string
}

export interface ProjectTask {
  id: string
  projectId: string
  milestoneId: string
  milestone: {
    id: string
    name: string
    status: string
  }
  assignedToId: string | null
  assignedTo: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  } | null
  createdById: string
  createdBy: {
    id: string
    fullName: string
  }
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'completed'
  dueDate: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface PendingVolunteer {
  id: string
  projectId: string
  userId: string
  user: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
    socialLinks: Record<string, string>
  }
  applicationMessage: string
  status: 'pending'
  contributionScore: number
  tasksCompleted: number
  joinedAt: string
}

export interface PendingMentor {
  id: string
  projectId: string
  userId: string
  user: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
    bio: string
    socialLinks: Record<string, string>
  }
  applicationMessage: string
  expertiseAreas: string[]
  status: 'pending'
  joinedAt: string
}

export interface VolunteerApplication {
  id: string
  project_id: string
  project_name: string
  volunteer_id: string
  volunteer_name: string
  skills: string[]
  message: string
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
}

export interface MentorshipRequest {
  id: string
  project_id: string
  project_name: string
  volunteer_id: string
  volunteer_name: string
  mentor_id: string
  mentor_name: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  requested_at: string
}

export interface ProjectStatistics {
  projectId: string
  projectName: string
  projectStatus: string
  projectLevel: string
  isVerified: boolean
  volunteers: {
    total: number
    active: number
    pending: number
    rejected: number
    left: number
  }
  mentors: {
    total: number
    active: number
    pending: number
    rejected: number
    left: number
  }
  tasks: {
    total: number
    todo: number
    inProgress: number
    inReview: number
    completed: number
    cancelled: number
    completionPercentage: number
  }
  milestones: {
    total: number
    notStarted: number
    inProgress: number
    completed: number
    onHold: number
    completionPercentage: number
  }
  categories: number
  skills: number
  volunteersNeeded: number
  volunteersFillPercentage: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface ProjectsState {
  projects: Project[]
  recommendations: RecommendedProject[]
  currentProject: Project | null
  isLoading: boolean
  isLoadingRecommendations: boolean
  volunteerApplications: VolunteerApplication[]
  mentorshipRequests: MentorshipRequest[]
  pendingVolunteers: PendingVolunteer[]
  pendingMentors: PendingMentor[]
  projectStatistics: ProjectStatistics | null
  filters: {
    tags: string[]
    difficulty: string[]
    status: string[]
    search: string
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  taskPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  sortOptions: {
    sortBy: 'createdAt' | 'volunteerCount' | 'name'
    sortOrder: 'ASC' | 'DESC'
  }
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    recommendations: [],
    currentProject: null,
    isLoading: false,
    isLoadingRecommendations: false,
    volunteerApplications: [],
    mentorshipRequests: [],
    pendingVolunteers: [],
    pendingMentors: [],
    projectStatistics: null,
    filters: {
      tags: [],
      difficulty: [],
      status: [],
      search: ''
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasMore: true
    },
    taskPagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    sortOptions: {
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    }
  }),

  getters: {
    filteredProjects: (state) => {
      let filtered = state.projects

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(project => 
          project.name.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search) ||
          project.tags.some(tag => tag.toLowerCase().includes(search))
        )
      }

      if (state.filters.tags.length > 0) {
        filtered = filtered.filter(project =>
          state.filters.tags.some(tag => project.tags.includes(tag))
        )
      }

      if (state.filters.difficulty.length > 0) {
        filtered = filtered.filter(project =>
          state.filters.difficulty.includes(project.difficulty)
        )
      }

      if (state.filters.status.length > 0) {
        filtered = filtered.filter(project =>
          state.filters.status.includes(project.status)
        )
      }

      return filtered
    },

    recommendedProjects: (state) => {
      const { user } = useAuthStore()
      if (!user?.skills || user.role !== 'volunteer') return []

      return state.projects
        .filter(project => project.status === 'open')
        .map(project => {
          const matchingSkills = project.skills_required.filter(skill =>
            user.skills?.some(userSkill => 
              userSkill.toLowerCase() === skill.toLowerCase()
            )
          )
          const matchScore = matchingSkills.length / project.skills_required.length
          return { ...project, matchScore, matchingSkills }
        })
        .filter(project => project.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6)
    }
  },

  actions: {
    /**
     * Fetch milestones for a project
     */
    async fetchMilestones(projectId: string) {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: Milestone[]
        }>(`${baseURL}/milestones/projects/${projectId}`, {
          headers
        })
        
        if (response.data && this.currentProject) {
          this.currentProject.milestones = response.data
        }
        
        return response.data || []
      } catch (error) {
        console.error('Failed to fetch milestones:', error)
        return []
      }
    },

    /**
     * Fetch tasks for a project with filters
     */
    async fetchTasks(projectId: string, options: {
      page?: number
      limit?: number
      status?: string
      priority?: string
      assignedToId?: string
      keyword?: string
    } = {}) {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        const params = new URLSearchParams()
        params.append('page', (options.page || this.taskPagination.page).toString())
        params.append('limit', (options.limit || this.taskPagination.limit).toString())
        
        if (options.status) params.append('status', options.status)
        if (options.priority) params.append('priority', options.priority)
        if (options.assignedToId) params.append('assignedToId', options.assignedToId)
        if (options.keyword) params.append('keyword', options.keyword)
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: ProjectTask[]
          meta: {
            page: number
            limit: number
            total: number
            totalPages: number
          }
        }>(`${baseURL}/projects/${projectId}/tasks?${params.toString()}`, {
          headers
        })
        
        if (response.data && this.currentProject) {
          this.currentProject.tasks = response.data
          this.taskPagination = response.meta
        }
        
        return response.data || []
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        return []
      }
    },

    /**
     * Fetch project statistics
     */
    async fetchStatistics(projectId: string) {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: ProjectStatistics
        }>(`${baseURL}/projects/${projectId}/statistics`, {
          headers
        })
        
        if (response.data) {
          this.projectStatistics = response.data
        }
        
        return response.data || null
      } catch (error) {
        console.error('Failed to fetch project statistics:', error)
        return null
      }
    },

    /**
     * Fetch pending volunteers
     */
    async fetchPendingVolunteers(projectId: string) {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: PendingVolunteer[]
        }>(`${baseURL}/projects/${projectId}/volunteers/pending`, {
          headers
        })
        
        if (response.data) {
          this.pendingVolunteers = response.data
        }
        
        return response.data || []
      } catch (error) {
        console.error('Failed to fetch pending volunteers:', error)
        return []
      }
    },

    /**
     * Fetch pending mentors
     */
    async fetchPendingMentors(projectId: string) {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: PendingMentor[]
        }>(`${baseURL}/projects/${projectId}/mentors/pending`, {
          headers
        })
        
        if (response.data) {
          this.pendingMentors = response.data
        }
        
        return response.data || []
      } catch (error) {
        console.error('Failed to fetch pending mentors:', error)
        return []
      }
    },

    /**
     * Approve or reject volunteer application
     */
    async handleVolunteerApplication(projectId: string, volunteerId: string, action: 'approve' | 'reject') {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        await $fetch(`${baseURL}/projects/${projectId}/volunteers/${volunteerId}/${action}`, {
          method: 'PATCH',
          headers
        })
        
        // Remove from pending list
        this.pendingVolunteers = this.pendingVolunteers.filter(v => v.userId !== volunteerId)
        
        return { success: true }
      } catch (error) {
        console.error(`Failed to ${action} volunteer:`, error)
        return { success: false, error }
      }
    },

    /**
     * Approve or reject mentor application
     */
    async handleMentorApplication(projectId: string, mentorId: string, action: 'approve' | 'reject') {
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        await $fetch(`${baseURL}/projects/${projectId}/mentors/${mentorId}/${action}`, {
          method: 'PATCH',
          headers
        })
        
        // Remove from pending list
        this.pendingMentors = this.pendingMentors.filter(m => m.userId !== mentorId)
        
        return { success: true }
      } catch (error) {
        console.error(`Failed to ${action} mentor:`, error)
        return { success: false, error }
      }
    },

    /**
     * Transform API project to internal Project format
     */
    transformApiProject(apiProject: ApiProject): Project {
      const difficultyMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      }

      const statusMap: Record<string, 'open' | 'in_progress' | 'completed' | 'paused' | 'active'> = {
        active: 'active',
        in_progress: 'in_progress',
        completed: 'completed',
        paused: 'paused'
      }

      const tags = [
        ...apiProject.categories.map(cat => cat.name),
        ...apiProject.skills.slice(0, 5).map(skill => skill.name)
      ]

      const duration = this.calculateDuration(apiProject.startDate, apiProject.endDate)

      return {
        id: apiProject.id,
        name: apiProject.name,
        description: apiProject.description,
        creator: {
          ...apiProject.creator,
          name: apiProject.creator.fullName,
          avatar: apiProject.creator.avatarUrl || undefined,
          organization: undefined
        },
        tags,
        skills_required: apiProject.skills.filter(s => s.isMandatory).map(s => s.name),
        volunteers_needed: apiProject.volunteersNeeded,
        volunteers_joined: apiProject.volunteerCount,
        volunteersNeeded: apiProject.volunteersNeeded,
        volunteerCount: apiProject.volunteerCount,
        status: statusMap[apiProject.status] || 'active',
        difficulty: difficultyMap[apiProject.level] || 'Intermediate',
        level: apiProject.level,
        duration_estimate: duration,
        github_url: apiProject.links.github,
        discord_url: apiProject.links.discord,
        links: apiProject.links,
        created_at: apiProject.createdAt,
        updated_at: apiProject.updatedAt,
        startDate: apiProject.startDate,
        endDate: apiProject.endDate,
        bannerUrl: apiProject.bannerUrl,
        milestones: [],
        volunteers: apiProject.volunteers || [],
        mentors: apiProject.mentors || [],
        tasks: [],
        categories: apiProject.categories,
        skills: apiProject.skills,
        isVerified: apiProject.isVerified,
        verifier: apiProject.verifier
      }
    },

    /**
     * Calculate duration between two dates
     */
    calculateDuration(startDate: string, endDate: string): string {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
      
      if (diffMonths < 2) {
        return '1-2 months'
      } else if (diffMonths < 4) {
        return '2-4 months'
      } else if (diffMonths < 7) {
        return '3-6 months'
      } else {
        return '6+ months'
      }
    },

    /**
     * Fetch projects from API with filters and pagination
     */
    async fetchProjects(options: {
      page?: number
      limit?: number
      keyword?: string
      status?: string
      isVerified?: boolean
      sortBy?: 'createdAt' | 'volunteerCount' | 'name'
      sortOrder?: 'ASC' | 'DESC'
      append?: boolean
    } = {}) {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        // Build query params
        const params = new URLSearchParams()
        params.append('page', (options.page || this.pagination.page).toString())
        params.append('limit', (options.limit || this.pagination.limit).toString())
        
        if (options.keyword || this.filters.search) {
          params.append('keyword', options.keyword || this.filters.search)
        }
        
        if (options.status) {
          params.append('status', options.status)
        }
        
        if (options.isVerified !== undefined) {
          params.append('isVerified', options.isVerified.toString())
        }
        
        params.append('sortBy', options.sortBy || this.sortOptions.sortBy)
        params.append('sortOrder', options.sortOrder || this.sortOptions.sortOrder)
        
        // Get auth token if available
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: ApiProject[]
          meta: {
            page: number
            limit: number
            total: number
            totalPages: number
          }
          timestamp: string
        }>(`${baseURL}/projects?${params.toString()}`, {
          headers
        })
        
        if (response.data && Array.isArray(response.data)) {
          const transformedProjects = response.data.map(p => this.transformApiProject(p))
          
          if (options.append) {
            this.projects = [...this.projects, ...transformedProjects]
          } else {
            this.projects = transformedProjects
          }
          
          // Update pagination
          if (response.meta) {
            this.pagination = {
              page: response.meta.page,
              limit: response.meta.limit,
              total: response.meta.total,
              totalPages: response.meta.totalPages,
              hasMore: response.meta.page < response.meta.totalPages
            }
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch projects:', error)
        // Show user-friendly error message
        if (error.statusCode === 401) {
          console.error('Unauthorized - please login')
        } else if (error.statusCode >= 500) {
          console.error('Server error - please try again later')
        }
        // Keep existing projects on error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch recommended projects based on user skills
     */
    async fetchRecommendations(options: {
      limit?: number
      minSimilarity?: number
    } = {}) {
      this.isLoadingRecommendations = true
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        // Build query params
        const params = new URLSearchParams()
        if (options.limit) {
          params.append('limit', options.limit.toString())
        }
        if (options.minSimilarity !== undefined) {
          params.append('minSimilarity', options.minSimilarity.toString())
        }
        
        // Get auth token if available
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: RecommendedProject[]
          timestamp: string
        }>(`${baseURL}/projects/recommendations/me?${params.toString()}`, {
          headers
        })
        
        if (response.data && Array.isArray(response.data)) {
          this.recommendations = response.data
        } else {
          this.recommendations = []
        }
      } catch (error: any) {
        console.error('Failed to fetch recommendations:', error)
        this.recommendations = []
      } finally {
        this.isLoadingRecommendations = false
      }
    },

    /**
     * Load more projects (pagination)
     */
    async loadMoreProjects() {
      if (!this.pagination.hasMore || this.isLoading) return
      
      await this.fetchProjects({
        page: this.pagination.page + 1,
        append: true
      })
    },

    /**
     * Update sort options and refetch
     */
    async updateSort(sortBy: 'createdAt' | 'volunteerCount' | 'name', sortOrder: 'ASC' | 'DESC') {
      this.sortOptions = { sortBy, sortOrder }
      this.pagination.page = 1
      await this.fetchProjects()
    },

    async fetchProject(id: string) {
      this.isLoading = true
      
      try {
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
        
        // Get auth token if available
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('auth_token')
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }
        
        const response = await $fetch<{
          statusCode: number
          message: string
          data: ApiProject
          timestamp: string
        }>(`${baseURL}/projects/${id}`, {
          headers
        })
        
        if (response.data) {
          const apiProject = response.data
          
          // Map API response to frontend Project format
          this.currentProject = {
            id: apiProject.id,
            name: apiProject.name,
            description: apiProject.description,
            creator: {
              id: apiProject.creator.id,
              name: apiProject.creator.fullName,
              avatar: apiProject.creator.avatarUrl || undefined,
              organization: apiProject.creator.bio || undefined
            },
            tags: apiProject.categories.map(cat => cat.name),
            skills_required: apiProject.skills.map(skill => skill.name),
            volunteers_needed: apiProject.volunteersNeeded,
            volunteers_joined: apiProject.volunteerCount,
            status: apiProject.status,
            difficulty: this.mapLevel(apiProject.level),
            level: apiProject.level,
            duration_estimate: this.calculateDuration(apiProject.startDate, apiProject.endDate),
            github_url: apiProject.links.github,
            discord_url: apiProject.links.discord,
            created_at: apiProject.createdAt,
            updated_at: apiProject.updatedAt,
            gallery: apiProject.images ? apiProject.images.map((url, idx) => ({
              id: `img-${idx}`,
              url,
              caption: '',
              type: 'screenshot' as const
            })) : [],
            milestones: [], // Not available in API yet
            volunteers: apiProject.volunteers?.map(v => ({
              id: v.id,
              user_id: v.user.id,
              user: {
                id: v.user.id,
                username: v.user.username,
                fullName: v.user.fullName,
                avatarUrl: v.user.avatarUrl
              },
              name: v.user.fullName,
              avatar: v.user.avatarUrl || '',
              skills: [],
              joined_at: v.joinedAt,
              contribution_score: v.contributionScore || 0,
              status: v.status,
              tasks_completed: v.tasksCompleted || 0
            })) || [],
            mentors: apiProject.mentors?.map(m => ({
              id: m.id,
              user_id: m.user.id,
              user: {
                id: m.user.id,
                username: m.user.username,
                fullName: m.user.fullName,
                avatarUrl: m.user.avatarUrl
              },
              name: m.user.fullName,
              avatar: m.user.avatarUrl || '',
              expertise: m.expertiseAreas || [],
              assigned_at: m.joinedAt
            })) || [],
            tasks: [], // Not available in API yet
            categories: apiProject.categories,
            skills: apiProject.skills,
            isVerified: apiProject.isVerified,
            bannerUrl: apiProject.bannerUrl,
            startDate: apiProject.startDate,
            endDate: apiProject.endDate,
            verifier: apiProject.verifier
          }
        } else {
          this.currentProject = null
        }
      } catch (error) {
        this.currentProject = null
      } finally {
        this.isLoading = false
      }
    },

    // Helper method to map level to difficulty
    mapLevel(level: 'beginner' | 'intermediate' | 'advanced'): 'Beginner' | 'Intermediate' | 'Advanced' {
      const map = {
        beginner: 'Beginner' as const,
        intermediate: 'Intermediate' as const,
        advanced: 'Advanced' as const
      }
      return map[level]
    },

    updateFilters(newFilters: Partial<ProjectsState['filters']>) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = {
        tags: [],
        difficulty: [],
        status: [],
        search: ''
      }
    },

    async joinProject(projectId: string) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const project = this.projects.find(p => p.id === projectId)
        if (project && project.volunteers_joined < project.volunteers_needed) {
          project.volunteers_joined += 1
        }
        
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to join project' }
      }
    },

    // Volunteer Application Management
    async applyToProject(projectId: string, message: string) {
      try {
        const { user } = useAuthStore()
        if (!user) return { success: false, error: 'User not authenticated' }

        const project = this.projects.find(p => p.id === projectId)
        if (!project) return { success: false, error: 'Project not found' }

        // Create application
        const application: VolunteerApplication = {
          id: Date.now().toString(),
          project_id: projectId,
          project_name: project.name,
          volunteer_id: user.id,
          volunteer_name: user.name,
          skills: user.skills || [],
          message,
          status: 'pending',
          applied_at: new Date().toISOString()
        }

        this.volunteerApplications.push(application)
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to apply to project' }
      }
    },

    async approveVolunteerApplication(applicationId: string) {
      try {
        const application = this.volunteerApplications.find(app => app.id === applicationId)
        if (!application) return { success: false, error: 'Application not found' }

        application.status = 'approved'
        
        // Add volunteer to project
        const project = this.projects.find(p => p.id === application.project_id)
        if (project) {
          project.volunteers_joined += 1
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to approve application' }
      }
    },

    async rejectVolunteerApplication(applicationId: string) {
      try {
        const application = this.volunteerApplications.find(app => app.id === applicationId)
        if (!application) return { success: false, error: 'Application not found' }

        application.status = 'rejected'
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to reject application' }
      }
    },

    // Task Management
    async createTask(taskData: {
      project_id: string
      title: string
      description: string
      priority: 'low' | 'medium' | 'high'
      due_date?: string
      tags: string[]
    }) {
      try {
        const { user } = useAuthStore()
        if (!user) return { success: false, error: 'User not authenticated' }

        const project = this.projects.find(p => p.id === taskData.project_id)
        if (!project) return { success: false, error: 'Project not found' }

        const task: ProjectTask = {
          id: Date.now().toString(),
          title: taskData.title,
          description: taskData.description,
          status: 'todo',
          priority: taskData.priority,
          tags: taskData.tags,
          created_by: user.id,
          created_at: new Date().toISOString(),
          due_date: taskData.due_date
        }

        project.tasks.push(task)
        return { success: true, task }
      } catch (error) {
        return { success: false, error: 'Failed to create task' }
      }
    },

    async updateTaskStatus(taskId: string, status: ProjectTask['status']) {
      try {
        // Find task across all projects
        for (const project of this.projects) {
          const task = project.tasks.find(t => t.id === taskId)
          if (task) {
            task.status = status
            return { success: true }
          }
        }
        
        return { success: false, error: 'Task not found' }
      } catch (error) {
        return { success: false, error: 'Failed to update task status' }
      }
    },

    async assignTaskToVolunteer(taskId: string, volunteerId: string, volunteerName: string) {
      try {
        // Find task across all projects
        for (const project of this.projects) {
          const task = project.tasks.find(t => t.id === taskId)
          if (task) {
            task.assigned_to = volunteerId
            task.assigned_to_name = volunteerName
            return { success: true }
          }
        }
        
        return { success: false, error: 'Task not found' }
      } catch (error) {
        return { success: false, error: 'Failed to assign task' }
      }
    },

    // Mentorship Management
    async requestMentorship(projectId: string, mentorId: string, message: string) {
      try {
        const { user } = useAuthStore()
        if (!user) return { success: false, error: 'User not authenticated' }

        const project = this.projects.find(p => p.id === projectId)
        if (!project) return { success: false, error: 'Project not found' }

        const request: MentorshipRequest = {
          id: Date.now().toString(),
          project_id: projectId,
          project_name: project.name,
          volunteer_id: user.id,
          volunteer_name: user.name,
          mentor_id: mentorId,
          mentor_name: 'Mentor Name', // This would come from mentor lookup
          message,
          status: 'pending',
          requested_at: new Date().toISOString()
        }

        this.mentorshipRequests.push(request)
        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to request mentorship' }
      }
    },

    async respondToMentorshipRequest(requestId: string, status: 'accepted' | 'declined') {
      try {
        const request = this.mentorshipRequests.find(req => req.id === requestId)
        if (!request) return { success: false, error: 'Request not found' }

        request.status = status
        
        // If accepted, add mentor to project
        if (status === 'accepted') {
          const project = this.projects.find(p => p.id === request.project_id)
          if (project) {
            const mentor: ProjectMentor = {
              id: Date.now().toString(),
              user_id: request.mentor_id,
              name: request.mentor_name,
              expertise: [],
              assigned_at: new Date().toISOString()
            }
            project.mentors.push(mentor)
          }
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to respond to mentorship request' }
      }
    },

    // Project Creation
    async createProject(projectData: {
      name: string
      description: string
      difficulty: 'beginner' | 'intermediate' | 'advanced'
      volunteers_needed: number
      duration_estimate: string
      skills_required: string[]
      tags: string[]
      github_url?: string
      discord_url?: string
    }) {
      try {
        const { user } = useAuthStore()
        if (!user) return { success: false, error: 'User not authenticated' }

        const project: Project = {
          id: Date.now().toString(),
          name: projectData.name,
          description: projectData.description,
          creator: {
            id: user.id,
            name: user.name,
            organization: user.organization
          },
          tags: projectData.tags,
          skills_required: projectData.skills_required,
          volunteers_needed: projectData.volunteers_needed,
          volunteers_joined: 0,
          status: 'open',
          difficulty: projectData.difficulty,
          duration_estimate: projectData.duration_estimate,
          github_url: projectData.github_url,
          discord_url: projectData.discord_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          milestones: [],
          volunteers: [],
          mentors: [],
          tasks: []
        }

        this.projects.push(project)
        return { success: true, project }
      } catch (error) {
        return { success: false, error: 'Failed to create project' }
      }
    }
  }
})