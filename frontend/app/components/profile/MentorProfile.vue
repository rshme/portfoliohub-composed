<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      <!-- Total Projects -->
      <div class="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FolderIcon size="16" class="text-emerald-600" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.totalProjects || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Projects</p>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</p>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ stats.activeProjects || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">In Progress</p>
        </div>
      </div>

      <!-- Completed Projects -->
      <div class="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Done</p>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size="16" class="text-green-600" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ stats.completedProjects || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      <!-- Total Mentees -->
      <div class="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mentees</p>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UsersIcon size="16" class="text-purple-600" />
            </div>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-purple-600">{{ stats.totalMentees || 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Volunteers</p>
        </div>
      </div>

      <!-- Member Since -->
      <div class="bg-white rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-gray-500 hover:shadow-lg transition-shadow">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Since</p>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpenIcon size="16" class="text-gray-600" />
            </div>
          </div>
          <p class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ stats.activeSince }}</p>
          <p class="text-xs text-gray-500 mt-1">Active Member</p>
        </div>
      </div>
    </div>

    <!-- Expertise Areas -->
    <div v-if="user.skills && user.skills.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <CodeIcon size="24" class="mr-2 text-emerald-600" />
        Technical Expertise
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in user.skills"
          :key="skill.id || skill"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <CheckCircleIcon size="16" class="mr-2" />
          {{ typeof skill === 'string' ? skill : skill.name }}
        </span>
      </div>
    </div>

    <!-- Interests -->
    <div v-if="user.interests && user.interests.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HeartIcon size="24" class="mr-2 text-purple-600" />
        Mentoring Interests
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="interest in user.interests"
          :key="interest.id || interest"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium text-sm border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          {{ typeof interest === 'string' ? interest : interest.name }}
        </span>
      </div>
    </div>

    <!-- Current Active Projects -->
    <div v-if="stats.currentActiveProjects && stats.currentActiveProjects.length > 0" class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-200">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Currently Active Projects
          </h3>
          <p class="text-sm text-gray-600 mt-1">Projects you're actively mentoring right now</p>
        </div>
        <div class="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-200">
          <span class="text-2xl font-bold text-blue-600">{{ stats.currentActiveProjects.length }}</span>
          <span class="text-xs text-gray-600 ml-1">Active</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in stats.currentActiveProjects"
          :key="project.id"
          @click="navigateToProject(project.id)"
          class="group bg-white rounded-xl p-5 border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <!-- Project Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                {{ project.name }}
              </h4>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                  :class="getActiveProjectStatusClass(project.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(project.status)"></span>
                  {{ formatStatus(project.status) }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                  :class="getLevelBadgeClass(project.level)"
                >
                  {{ formatLevel(project.level) }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
            </div>
          </div>

          <!-- Project Actions Indicator -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 font-medium">View Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mentored Projects -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <BriefcaseIcon size="24" class="mr-2 text-emerald-600" />
          Mentored Projects
        </h3>
        <span class="text-sm text-gray-500">{{ projects.length }} projects</span>
      </div>

      <div v-if="projects.length === 0" class="text-center py-12">
        <FolderIcon size="48" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No mentored projects yet</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in sortedProjects"
          :key="project.id"
          class="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
          @click="navigateToProject(project.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h4 class="text-lg font-semibold text-gray-900">{{ project.name }}</h4>
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="getStatusClass(project.status)"
                >
                  {{ formatStatus(project.status) }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
                >
                  <AwardIcon size="14" class="mr-1" />
                  Mentoring
                </span>
              </div>
              
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>

              <!-- Project Tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in project.tags.slice(0, 5)"
                  :key="tag"
                  class="inline-block px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Mentoring Stats -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 p-4 bg-emerald-50 rounded-lg">
                <div class="text-center">
                  <div class="text-2xl font-bold text-emerald-700">{{ project.volunteersGuided }}</div>
                  <div class="text-xs text-gray-600">Volunteers Guided</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-emerald-700">{{ project.tasksCreated }}</div>
                  <div class="text-xs text-gray-600">Tasks Created</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-emerald-700">{{ project.volunteers_needed }}</div>
                  <div class="text-xs text-gray-600">Team Needed</div>
                </div>
              </div>

              <!-- Joined Date -->
              <div class="mt-4 flex items-center text-sm text-gray-600">
                <ClockIcon size="16" class="mr-2 text-emerald-600" />
                <span>Joined as mentor: {{ formatProjectDate(project.joined_at) }}</span>
              </div>
            </div>

            <!-- Mentor Badge -->
            <div class="ml-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <AwardIcon size="32" class="text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreProjects" class="flex justify-center mt-6">
          <button
            @click="loadMoreProjects"
            class="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>Load More Projects</span>
            <svg class="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Showing Count -->
        <div class="text-center mt-4 text-sm text-gray-600">
          Showing {{ sortedProjects.length }} of {{ projects.length }} projects
        </div>
      </div>
    </div>

    <!-- User Achievements from API -->
    <div v-if="achievements && achievements.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <AwardIcon size="24" class="mr-2 text-amber-500" />
        Achievements
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="flex items-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:shadow-md transition-all"
        >
          <div class="text-4xl mr-4">{{ achievement.iconUrl }}</div>
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ achievement.name }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ achievement.description }}</p>
            <div class="flex items-center mt-2">
              <span 
                class="inline-block px-2 py-0.5 text-xs rounded-full font-medium"
                :class="{
                  'bg-gray-200 text-gray-700': achievement.rarity === 'common',
                  'bg-green-200 text-green-700': achievement.rarity === 'uncommon',
                  'bg-blue-200 text-blue-700': achievement.rarity === 'rare',
                  'bg-purple-200 text-purple-700': achievement.rarity === 'epic',
                  'bg-amber-200 text-amber-700': achievement.rarity === 'legendary'
                }"
              >
                {{ achievement.rarity }}
              </span>
              <span class="text-xs text-gray-500 ml-2">{{ formatAchievementDate(achievement.awardedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div v-if="reviews && reviews.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <StarIcon size="24" class="mr-2 text-amber-500" />
          Mentor Reviews
        </h3>
        <div class="flex items-center">
          <div class="text-3xl font-bold text-gray-900 mr-2">{{ user.rating?.toFixed(1) }}</div>
          <div>
            <div class="flex items-center">
              <StarIcon v-for="i in 5" :key="i" size="16" :class="i <= Math.round(user.rating || 0) ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" />
            </div>
            <div class="text-xs text-gray-500 text-right">{{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }}</div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <img
                :src="review.reviewer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer.fullName)}`"
                :alt="review.reviewer.fullName"
                class="w-12 h-12 rounded-full border-2 border-gray-200 mr-3"
              />
              <div>
                <h4 class="text-sm font-semibold text-gray-900">{{ review.reviewer.fullName }}</h4>
                <p class="text-xs text-gray-500">@{{ review.reviewer.username }} • {{ getRoleBadge(review.reviewer.role) }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <StarIcon v-for="i in 5" :key="i" size="16" :class="i <= review.rating ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" />
            </div>
          </div>
          
          <p class="text-gray-700 text-sm leading-relaxed mb-2">{{ review.content }}</p>
          
          <div class="flex items-center text-xs text-gray-500">
            <ClockIcon size="14" class="mr-1" />
            {{ formatReviewDate(review.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../../../stores/auth'
import { useAuthStore } from '../../../stores/auth'

interface Props {
  user: User
  stats: {
    totalProjects: number
    activeProjects?: number
    completedProjects?: number
    pendingProjects?: number
    leftProjects?: number
    totalMentees?: number
    totalVolunteersGuided?: number
    totalTasksCreated?: number
    activeSince: string
    currentActiveProjects?: Array<{
      id: string
      name: string
      status: string
      level: string
    }>
  }
  projects: any[]
  reviews?: any[]
  achievements?: any[]
}

const props = defineProps<Props>()
const authStore = useAuthStore()

// Pagination for projects
const itemsPerPage = ref(3)
const displayedItems = ref(3)

// Computed: Sort projects by volunteers guided (highest to lowest) and slice by displayedItems
const sortedProjects = computed(() => {
  return [...props.projects]
    .sort((a, b) => (b.volunteersGuided || 0) - (a.volunteersGuided || 0))
    .slice(0, displayedItems.value)
})

// Computed: Check if there are more projects to load
const hasMoreProjects = computed(() => {
  return displayedItems.value < props.projects.length
})

// Method: Load more projects (3 at a time)
const loadMoreProjects = () => {
  displayedItems.value += itemsPerPage.value
}

// Helper methods for active projects
const getActiveProjectStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border border-green-300',
    in_progress: 'bg-blue-100 text-blue-700 border border-blue-300',
    draft: 'bg-gray-100 text-gray-700 border border-gray-300',
    completed: 'bg-purple-100 text-purple-700 border border-purple-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-700 border border-gray-300'
}

const getStatusDotClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-500 animate-pulse',
    in_progress: 'bg-blue-500 animate-pulse',
    draft: 'bg-gray-500',
    completed: 'bg-purple-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getLevelBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    intermediate: 'bg-amber-100 text-amber-700 border border-amber-300',
    advanced: 'bg-red-100 text-red-700 border border-red-300'
  }
  return classes[level] || 'bg-gray-100 text-gray-700 border border-gray-300'
}

const formatLevel = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

const getStatusClass = (status: string) => {
  const classes = {
    open: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    paused: 'bg-yellow-100 text-yellow-700'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const navigateToProject = (projectId: string) => {
  navigateTo(`/projects/${projectId}`)
}

const formatProjectDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}

const formatAchievementDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getRoleBadge = (role: string) => {
  const badges: Record<string, string> = {
    volunteer: 'Volunteer',
    mentor: 'Mentor',
    project_owner: 'Project Owner'
  }
  return badges[role] || role
}
</script>
