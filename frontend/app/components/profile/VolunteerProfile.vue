<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Projects Joined</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FolderIcon size="24" class="text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Contribution Score -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Score</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalContributions }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUpIcon size="24" class="text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Tasks Completed -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Tasks Done</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalTasksCompleted }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon size="24" class="text-emerald-600" />
          </div>
        </div>
      </div>

      <!-- Rank Badge -->
      <div class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white/80">Rank</p>
            <p class="text-lg font-bold mt-1">{{ stats.rank }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <AwardIcon size="24" class="text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Skills & Expertise -->
    <div v-if="user.skills && user.skills.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <CodeIcon size="24" class="mr-2 text-primary-600" />
        Skills & Expertise
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in user.skills"
          :key="skill.id || skill"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          {{ typeof skill === 'string' ? skill : skill.name }}
        </span>
      </div>
    </div>

    <!-- Interests -->
    <div v-if="user.interests && user.interests.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HeartIcon size="24" class="mr-2 text-purple-600" />
        Areas of Interest
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

    <!-- Achievement Badges -->
    <div v-if="user.achievements && user.achievements.length > 0" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <StarIcon size="24" class="mr-2 text-amber-500" />
        Achievements
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="achievement in user.achievements"
          :key="achievement.id"
          class="text-center p-4 rounded-lg border-2 transition-all hover:scale-105"
          :class="getAchievementClass(achievement.rarity)"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl"
            :class="getAchievementBgClass(achievement.rarity)"
          >
            {{ achievement.iconUrl }}
          </div>
          <p class="text-sm font-semibold text-gray-900">{{ achievement.name }}</p>
          <p class="text-xs text-gray-600 mt-1">{{ achievement.description }}</p>
          <p class="text-xs text-gray-500 mt-2">
            {{ formatAchievementDate(achievement.awardedAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Current Active Projects -->
    <div v-if="props.activeProjects && props.activeProjects.length > 0" class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-lg p-4 sm:p-6 border-2 border-blue-200">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
          <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-white sm:w-5 sm:h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Current Active Projects</span>
        </h3>
        <div class="flex items-center gap-2">
          <span class="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500"></span>
          </span>
          <span class="text-xs sm:text-sm font-semibold text-gray-700">{{ props.activeProjects.length }} active</span>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="project in sortedActiveProjects"
          :key="project.projectId"
          class="relative group bg-white rounded-xl p-4 sm:p-5 border-2 border-transparent hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          @click="openContributionModal(mapActiveProject(project))"
        >
          <!-- Active Indicator Ribbon -->
          <div class="absolute top-0 right-0 z-10">
            <div class="bg-gradient-to-br from-green-400 to-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-0.5 sm:py-1 shadow-lg" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%);">
              ACTIVE
            </div>
          </div>

          <!-- Gradient Border Effect on Hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" style="padding: 2px; z-index: -1;"></div>

          <div class="flex flex-col sm:flex-row items-start gap-4">
            <div class="flex-1 w-full sm:w-auto">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 pr-12 sm:pr-0">
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{{ project.projectName }}</h4>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium shadow-sm w-fit"
                  :class="getStatusClass(project.projectStatus)"
                >
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" :class="project.projectStatus === 'in_progress' ? 'bg-blue-600' : 'bg-green-600'"></span>
                  {{ formatStatus(project.projectStatus) }}
                </span>
              </div>
              
              <p class="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-2">{{ project.projectDescription }}</p>

              <!-- Project Tags -->
              <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                <span
                  v-for="tag in project.projectTags.slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-[10px] sm:text-xs font-medium border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all"
                >
                  {{ tag }}
                </span>
                <span v-if="project.projectTags.length > 3" class="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-medium">
                  +{{ project.projectTags.length - 3 }} more
                </span>
              </div>

              <!-- Stats Row with Enhanced Icons -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div class="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-200">
                  <TrophyIcon size="14" class="mr-1 sm:mr-1.5 text-amber-500" />
                  <span class="font-bold text-amber-700">{{ project.contributionScore }}</span>
                  <span class="ml-0.5 sm:ml-1 text-amber-600">pts</span>
                </div>
                <div class="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-200">
                  <CheckIcon size="14" class="mr-1 sm:mr-1.5 text-emerald-500" />
                  <span class="font-bold text-emerald-700">{{ project.tasksCompleted }}/{{ project.tasksTotal }}</span>
                  <span class="ml-0.5 sm:ml-1 text-emerald-600">tasks</span>
                </div>
                <div class="hidden sm:flex items-center text-gray-500">
                  <CalendarIcon size="16" class="mr-1.5" />
                  <span>{{ formatJoinDate(project.joinedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Enhanced Contribution Score Badge -->
            <div class="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-center">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div class="text-white">
                  <div class="text-lg sm:text-2xl font-bold">{{ project.contributionScore }}</div>
                  <div class="text-[8px] sm:text-xs opacity-90">score</div>
                </div>
              </div>
              <!-- Progress Ring -->
              <svg class="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
                <circle :cx="32" :cy="32" :r="29" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" fill="none" class="sm:hidden" />
                <circle 
                  :cx="32" 
                  :cy="32" 
                  :r="29" 
                  stroke="white" 
                  stroke-width="2.5" 
                  fill="none"
                  :stroke-dasharray="182"
                  :stroke-dashoffset="182 - (182 * (project.tasksCompleted / project.tasksTotal))"
                  class="transition-all duration-500 sm:hidden"
                />
                <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" stroke-width="3" fill="none" class="hidden sm:block" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke="white" 
                  stroke-width="3" 
                  fill="none"
                  :stroke-dasharray="226"
                  :stroke-dashoffset="226 - (226 * (project.tasksCompleted / project.tasksTotal))"
                  class="transition-all duration-500 hidden sm:block"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Load More Button for Active Projects -->
        <div v-if="hasMoreActiveProjects" class="flex justify-center mt-4 sm:mt-6">
          <button
            @click="loadMoreActiveProjects"
            class="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <span class="sm:inline">Load More Active Projects</span>
            <span class="sm:hidden">Load More</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Showing Count for Active Projects -->
        <div class="text-center mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-gray-700">
          Showing {{ sortedActiveProjects.length }} of {{ props.activeProjects.length }} active projects
        </div>
      </div>
    </div>

    <!-- All Project Contributions -->
    <div class="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
          <BriefcaseIcon size="20" class="mr-2 text-primary-600 sm:w-6 sm:h-6" />
          <span>Project Contributions</span>
        </h3>
        <span class="text-xs sm:text-sm text-gray-500">{{ projects.length }} projects</span>
      </div>

      <div v-if="projects.length === 0" class="text-center py-12">
        <FolderIcon size="48" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No projects yet</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in sortedProjects"
          :key="project.id"
          class="relative border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          @click="openContributionModal(project)"
        >
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <div class="flex-1 w-full sm:w-auto">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 pr-12 sm:pr-0">
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{{ project.name }}</h4>
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-[10px] sm:text-xs font-medium w-fit"
                  :class="getStatusClass(project.status)"
                >
                  {{ formatStatus(project.status) }}
                </span>
              </div>
              
              <p class="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{{ project.description }}</p>

              <!-- Project Tags -->
              <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                <span
                  v-for="tag in project.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-block px-2 py-0.5 sm:py-1 rounded bg-gray-100 text-gray-600 text-[10px] sm:text-xs"
                >
                  {{ tag }}
                </span>
                <span v-if="project.tags.length > 3" class="inline-block px-2 py-0.5 sm:py-1 rounded bg-gray-100 text-gray-600 text-[10px] sm:text-xs">
                  +{{ project.tags.length - 3 }}
                </span>
              </div>

              <!-- Stats Row -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                <div class="flex items-center">
                  <TrophyIcon size="14" class="mr-1 text-amber-500" />
                  <span class="font-medium text-gray-900">{{ project.contribution_score }}</span>
                  <span class="ml-0.5 sm:ml-1">pts</span>
                </div>
                <div class="flex items-center">
                  <CheckIcon size="14" class="mr-1 text-emerald-500" />
                  <span class="font-medium text-gray-900">{{ project.tasks_completed }}/{{ project.tasks_total }}</span>
                  <span class="ml-0.5 sm:ml-1">tasks</span>
                </div>
                <div class="hidden sm:flex items-center">
                  <CalendarIcon size="16" class="mr-1" />
                  <span>Joined {{ formatJoinDate(project.joined_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Contribution Score Badge -->
            <div class="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-center">
              <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <div class="text-white">
                  <div class="text-lg sm:text-2xl font-bold">{{ project.contribution_score }}</div>
                  <div class="text-[8px] sm:text-xs opacity-90">score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreProjects" class="flex justify-center mt-4 sm:mt-6">
          <button
            @click="loadMoreProjects"
            class="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
          >
            <span class="sm:inline">Load More Projects</span>
            <span class="sm:hidden">Load More</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Showing Count -->
        <div class="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
          Showing {{ sortedProjects.length }} of {{ projects.length }} projects
        </div>
      </div>
    </div>
  </div>

  <!-- Contribution Modal -->
  <VolunteerProjectContributionModal
    v-if="selectedProject"
    :project="selectedProject"
    :volunteer-user-id="user.id"
    @close="selectedProject = null"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../../../stores/auth'

interface Props {
  user: User & { achievements?: any[] }
  stats: {
    totalProjects: number
    totalContributions: number
    totalTasksCompleted: number
    averageScore: number
    rank: string
    activeSince?: string
  }
  projects: any[]
  activeProjects?: any[]
}

const props = defineProps<Props>()

const selectedProject = ref<any>(null)
const itemsPerPage = ref(3)
const displayedItems = ref(3)
const displayedActiveItems = ref(3)

// Computed: Sort active projects by contribution score and slice by displayedActiveItems
const sortedActiveProjects = computed(() => {
  if (!props.activeProjects) return []
  return [...props.activeProjects]
    .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
    .slice(0, displayedActiveItems.value)
})

// Computed: Check if there are more active projects to load
const hasMoreActiveProjects = computed(() => {
  if (!props.activeProjects) return false
  return displayedActiveItems.value < props.activeProjects.length
})

// Computed: Sort projects by contribution score (highest to lowest) and slice by displayedItems
const sortedProjects = computed(() => {
  return [...props.projects]
    .sort((a, b) => (b.contribution_score || 0) - (a.contribution_score || 0))
    .slice(0, displayedItems.value)
})

// Computed: Check if there are more projects to load
const hasMoreProjects = computed(() => {
  return displayedItems.value < props.projects.length
})

// Method: Load more active projects (3 at a time)
const loadMoreActiveProjects = () => {
  displayedActiveItems.value += itemsPerPage.value
}

// Method: Load more projects (3 at a time)
const loadMoreProjects = () => {
  displayedItems.value += itemsPerPage.value
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

const formatJoinDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

const openContributionModal = (project: any) => {
  // Navigate to project detail page instead of opening modal
  navigateTo(`/projects/${project.id}`)
  // selectedProject.value = project
}

const mapActiveProject = (project: any) => {
  return {
    id: project.projectId,
    name: project.projectName,
    description: project.projectDescription,
    status: project.projectStatus,
    tags: project.projectTags || [],
    contribution_score: project.contributionScore || 0,
    joined_at: project.joinedAt,
    tasks_completed: project.tasksCompleted || 0,
    tasks_total: project.tasksTotal || 0
  }
}

const getAchievementClass = (rarity: string) => {
  const classes = {
    common: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300',
    uncommon: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300',
    rare: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
    epic: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300',
    legendary: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300'
  }
  return classes[rarity as keyof typeof classes] || classes.common
}

const getAchievementBgClass = (rarity: string) => {
  const classes = {
    common: 'bg-gray-200',
    uncommon: 'bg-green-200',
    rare: 'bg-blue-200',
    epic: 'bg-purple-200',
    legendary: 'bg-amber-200'
  }
  return classes[rarity as keyof typeof classes] || classes.common
}

const formatAchievementDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}
</script>
