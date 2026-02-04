import { defineStore } from 'pinia'
import { mockUsers } from '../data/mockUsers'
import type { User } from './auth'

interface MentorFilters {
  search: string
  expertise: string[]
  availability: string[]
  experienceLevel: string[]
  minRating: number
}

export const useMentorsStore = defineStore('mentors', {
  state: () => ({
    mentors: [] as User[],
    filteredMentors: [] as User[],
    selectedMentor: null as User | null,
    filters: {
      search: '',
      expertise: [],
      availability: [],
      experienceLevel: [],
      minRating: 0
    } as MentorFilters,
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * Get mentors by availability
     */
    availableMentors: (state) => {
      return state.mentors.filter(mentor => mentor.availability === 'available')
    },

    /**
     * Get top rated mentors
     */
    topRatedMentors: (state) => {
      return state.mentors
        .filter(mentor => mentor.rating && mentor.rating >= 4.8)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    },

    /**
     * Get all unique expertise tags
     */
    allExpertiseTags: (state) => {
      const tags = new Set<string>()
      state.mentors.forEach(mentor => {
        if (mentor.expertise) {
          mentor.expertise.forEach(skill => tags.add(skill))
        }
      })
      return Array.from(tags).sort()
    },

    /**
     * Get mentors count by availability
     */
    mentorsCountByAvailability: (state) => {
      return {
        available: state.mentors.filter(m => m.availability === 'available').length,
        limited: state.mentors.filter(m => m.availability === 'limited').length,
        unavailable: state.mentors.filter(m => m.availability === 'unavailable').length
      }
    }
  },

  actions: {
    /**
     * Fetch all mentors (simulated API call)
     */
    async fetchMentors() {
      this.loading = true
      this.error = null

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Filter users to only get mentors
        this.mentors = mockUsers.filter(user => user.role === 'mentor')
        this.applyFilters()
      } catch (error) {
        this.error = 'Failed to fetch mentors'
        console.error('Error fetching mentors:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Update filters and apply them
     */
    updateFilters(newFilters: Partial<MentorFilters>) {
      this.filters = { ...this.filters, ...newFilters }
      this.applyFilters()
    },

    /**
     * Apply current filters to mentors list
     */
    applyFilters() {
      let filtered = [...this.mentors]

      // Search filter
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase()
        filtered = filtered.filter(mentor =>
          mentor.name.toLowerCase().includes(searchLower) ||
          (mentor.title && mentor.title.toLowerCase().includes(searchLower)) ||
          (mentor.organization && mentor.organization.toLowerCase().includes(searchLower)) ||
          (mentor.bio && mentor.bio.toLowerCase().includes(searchLower)) ||
          (mentor.expertise && mentor.expertise.some(skill => skill.toLowerCase().includes(searchLower)))
        )
      }

      // Expertise filter
      if (this.filters.expertise.length > 0) {
        filtered = filtered.filter(mentor =>
          mentor.expertise && this.filters.expertise.some(expertise =>
            mentor.expertise!.some(skill =>
              skill.toLowerCase().includes(expertise.toLowerCase())
            )
          )
        )
      }

      // Availability filter
      if (this.filters.availability.length > 0) {
        filtered = filtered.filter(mentor =>
          mentor.availability && this.filters.availability.includes(mentor.availability)
        )
      }

      // Experience level filter
      if (this.filters.experienceLevel.length > 0) {
        filtered = filtered.filter(mentor => {
          const years = mentor.experience_years || 0
          if (this.filters.experienceLevel.includes('junior') && years < 5) return true
          if (this.filters.experienceLevel.includes('mid') && years >= 5 && years < 10) return true
          if (this.filters.experienceLevel.includes('senior') && years >= 10) return true
          return false
        })
      }

      // Rating filter
      if (this.filters.minRating > 0) {
        filtered = filtered.filter(mentor => 
          mentor.rating && mentor.rating >= this.filters.minRating
        )
      }

      this.filteredMentors = filtered
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: '',
        expertise: [],
        availability: [],
        experienceLevel: [],
        minRating: 0
      }
      this.applyFilters()
    },

    /**
     * Get mentor by ID
     */
    getMentorById(id: string): User | undefined {
      return this.mentors.find(mentor => mentor.id === id)
    },

    /**
     * Select a mentor
     */
    selectMentor(mentor: User | null) {
      this.selectedMentor = mentor
    },

    /**
     * Request a mentor (simulated)
     */
    async requestMentor(mentorId: string, projectId?: string) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('Requesting mentor:', mentorId, 'for project:', projectId)
        
        // In a real app, this would make an API call
        // and update the mentor's current_mentees count
        
        return {
          success: true,
          message: 'Mentor request sent successfully'
        }
      } catch (error) {
        console.error('Error requesting mentor:', error)
        return {
          success: false,
          message: 'Failed to send mentor request'
        }
      }
    },

    /**
     * Sort mentors
     */
    sortMentors(sortBy: 'rating' | 'experience' | 'projects' | 'availability') {
      switch (sortBy) {
        case 'rating':
          this.filteredMentors.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'experience':
          this.filteredMentors.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0))
          break
        case 'projects':
          this.filteredMentors.sort((a, b) => (b.projects_mentored || 0) - (a.projects_mentored || 0))
          break
        case 'availability':
          this.filteredMentors.sort((a, b) => {
            const order = { available: 0, limited: 1, unavailable: 2 }
            return (order[a.availability as keyof typeof order] || 3) - (order[b.availability as keyof typeof order] || 3)
          })
          break
      }
    }
  }
})
