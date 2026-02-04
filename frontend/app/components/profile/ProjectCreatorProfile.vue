<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Projects Created</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FolderIcon size="24" class="text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Total Volunteers -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Volunteers</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalVolunteers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon size="24" class="text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Completed Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.completedProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon size="24" class="text-emerald-600" />
          </div>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.activeProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <ActivityIcon size="24" class="text-amber-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Organization Info (only show if organization exists) -->
    <div v-if="user.organization" class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <BuildingIcon size="24" class="mr-2 text-purple-600" />
        About {{ user.organization }}
      </h3>
      <p class="text-gray-700 leading-relaxed mb-4">
        {{ user.bio }}
      </p>
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center text-gray-600">
          <CalendarIcon size="16" class="mr-2" />
          <span>Member since {{ formatDate(user.created_at) }}</span>
        </div>
        <div class="flex items-center text-gray-600">
          <UsersIcon size="16" class="mr-2" />
          <span>{{ stats.totalVolunteers }} volunteers recruited</span>
        </div>
        <div class="flex items-center text-gray-600">
          <TrendingUpIcon size="16" class="mr-2" />
          <span>{{ stats.completedProjects }} projects completed</span>
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <BriefcaseIcon size="24" class="mr-2 text-purple-600" />
          My Projects
        </h3>
        <div class="flex items-center space-x-2">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="setActiveFilter(filter.value)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="activeFilter === filter.value 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <FolderIcon size="48" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No {{ activeFilter }} projects</p>
      </div>

      <div v-else>
        <!-- Projects Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div
            v-for="project in displayedProjects"
            :key="project.id"
            class="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
            @click="navigateToProject(project.id)"
          >
          <!-- Project Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                {{ project.name }}
              </h4>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="getStatusClass(project.status)"
                >
                  {{ formatStatus(project.status) }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="getDifficultyClass(project.level)"
                >
                  {{ project.level }}
                </span>
                <span v-if="project.isVerified" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  ✓ Verified
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600">{{ project.volunteers?.length || 0 }}</div>
              <div class="text-xs text-gray-500">/ {{ project.volunteersNeeded }}</div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ project.description }}</p>

          <!-- Skills/Tags -->
          <div v-if="project.skills && project.skills.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="skill in project.skills.slice(0, 4)"
              :key="skill.id"
              class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
              :class="skill.isMandatory ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-purple-50 text-purple-600'"
            >
              <span v-if="skill.icon" class="mr-1">{{ skill.icon }}</span>
              {{ skill.name }}
            </span>
            <span 
              v-if="project.skills.length > 4"
              class="inline-block px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs"
            >
              +{{ project.skills.length - 4 }}
            </span>
          </div>

          <!-- Project Stats -->
          <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ project.volunteers?.length || 0 }}</div>
              <div class="text-xs text-gray-600">Volunteers</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ project.mentors?.length || 0 }}</div>
              <div class="text-xs text-gray-600">Mentors</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ project.tasks?.length || 0 }}</div>
              <div class="text-xs text-gray-600">Tasks</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Team Progress</span>
              <span>{{ Math.round(((project.volunteers?.length || 0) / project.volunteersNeeded) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                :style="{ width: `${Math.min(100, ((project.volunteers?.length || 0) / project.volunteersNeeded) * 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div v-if="project.startDate" class="flex items-center">
                <CalendarIcon size="14" class="mr-1" />
                <span>{{ formatProjectDate(project.startDate) }}</span>
              </div>
            </div>
            <button class="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
              View Details
              <ArrowRightIcon size="16" class="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreProjects" class="flex justify-center">
          <button
            @click="loadMore"
            class="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>Load More Projects</span>
            <svg class="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Showing Count -->
        <div class="text-center mt-4 text-sm text-gray-600">
          Showing {{ displayedProjects.length }} of {{ filteredProjects.length }} projects
        </div>
      </div>
    </div>

    <!-- Impact Summary -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <BarChartIcon size="24" class="mr-2 text-purple-600" />
        Impact Summary
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Community Building -->
        <div class="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon size="28" class="text-white" />
          </div>
          <div class="text-3xl font-bold text-blue-700 mb-2">{{ stats.totalVolunteers }}</div>
          <p class="text-sm font-medium text-gray-700">Volunteers Recruited</p>
          <p class="text-xs text-gray-600 mt-1">Building strong teams</p>
        </div>

        <!-- Project Delivery -->
        <div class="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
          <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size="28" class="text-white" />
          </div>
          <div class="text-3xl font-bold text-emerald-700 mb-2">{{ stats.completedProjects }}</div>
          <p class="text-sm font-medium text-gray-700">Projects Delivered</p>
          <p class="text-xs text-gray-600 mt-1">Making real impact</p>
        </div>

        <!-- Innovation -->
        <div class="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <RocketIcon size="28" class="text-white" />
          </div>
          <div class="text-3xl font-bold text-purple-700 mb-2">{{ stats.totalProjects }}</div>
          <p class="text-sm font-medium text-gray-700">Total Initiatives</p>
          <p class="text-xs text-gray-600 mt-1">Driving innovation</p>
        </div>
      </div>
    </div>

    <!-- Additional Stats (from API) -->
    <div v-if="stats.verifiedProjects !== undefined" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Verified Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Verified Projects</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.verifiedProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">✓</span>
          </div>
        </div>
      </div>

      <!-- Draft Projects -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Draft Projects</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.draftProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📝</span>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completion Rate</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.completionRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">📊</span>
          </div>
        </div>
      </div>

      <!-- Total Mentors -->
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Mentors</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalMentors }}</p>
          </div>
          <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <span class="text-2xl">👨‍🏫</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tasks & Milestones Stats -->
    <div v-if="stats.tasksTotal !== undefined" class="bg-white rounded-xl shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span class="text-2xl mr-2">📋</span>
        Tasks & Milestones Overview
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Tasks Section -->
        <div class="border border-gray-200 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Tasks</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Tasks</span>
              <span class="font-bold text-gray-900">{{ stats.tasksTotal }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Completed</span>
              <span class="font-bold text-emerald-600">{{ stats.tasksCompleted }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">In Progress</span>
              <span class="font-bold text-blue-600">{{ stats.tasksInProgress }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Todo</span>
              <span class="font-bold text-amber-600">{{ stats.tasksTodo }}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Completion Rate</span>
                <span class="text-sm font-bold text-gray-900">{{ stats.tasksCompletionRate }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all"
                  :style="{ width: `${stats.tasksCompletionRate}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Milestones Section -->
        <div class="border border-gray-200 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Milestones</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Total Milestones</span>
              <span class="font-bold text-gray-900">{{ stats.milestonesTotal }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Completed</span>
              <span class="font-bold text-emerald-600">{{ stats.milestonesCompleted }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Remaining</span>
              <span class="font-bold text-amber-600">{{ stats.milestonesTotal - stats.milestonesCompleted }}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Completion Rate</span>
                <span class="text-sm font-bold text-gray-900">{{ stats.milestonesCompletionRate }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                  :style="{ width: `${stats.milestonesCompletionRate}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Active Project -->
    <div v-if="stats.mostActiveProject" class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
      <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span class="text-2xl mr-2">🔥</span>
        Most Active Project
      </h3>
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-2">{{ stats.mostActiveProject.name }}</h4>
          <div class="flex items-center space-x-3">
            <span
              class="inline-flex items-center px-3 py-1 rounded text-xs font-medium"
              :class="getStatusClass(stats.mostActiveProject.status)"
            >
              {{ formatStatus(stats.mostActiveProject.status) }}
            </span>
            <span class="text-sm text-gray-600">
              {{ stats.mostActiveProject.volunteerCount || 0 }} volunteers
            </span>
          </div>
        </div>
        <button 
          @click="navigateToProject(stats.mostActiveProject.id)"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          View Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  user: any
  stats: {
    totalProjects: number
    totalVolunteers: number
    completedProjects: number
    activeProjects: number
    draftProjects?: number
    verifiedProjects?: number
    completionRate?: number
    totalMentors?: number
    totalTeamMembers?: number
    tasksTotal?: number
    tasksCompleted?: number
    tasksInProgress?: number
    tasksTodo?: number
    tasksCompletionRate?: number
    milestonesTotal?: number
    milestonesCompleted?: number
    milestonesCompletionRate?: number
    mostActiveProject?: {
      id: string
      name: string
      status: string
      volunteerCount: number
    }
  }
  projects: any[]
}

const props = defineProps<Props>()
const router = useRouter()

const activeFilter = ref('all')
const itemsPerPage = ref(6)
const displayedItems = ref(6)

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Draft', value: 'draft' }
]

// Reset displayed items when filter changes
const setActiveFilter = (filterValue: string) => {
  activeFilter.value = filterValue
  displayedItems.value = itemsPerPage.value
}

const filteredProjects = computed(() => {
  let filtered = props.projects
  
  if (activeFilter.value === 'active') {
    filtered = props.projects.filter(p => p.status === 'active' || p.status === 'in_progress')
  } else if (activeFilter.value === 'completed') {
    filtered = props.projects.filter(p => p.status === 'completed')
  } else if (activeFilter.value === 'draft') {
    filtered = props.projects.filter(p => p.status === 'draft')
  }
  
  return filtered
})

const displayedProjects = computed(() => {
  return filteredProjects.value.slice(0, displayedItems.value)
})

const hasMoreProjects = computed(() => {
  return displayedItems.value < filteredProjects.value.length
})

const loadMore = () => {
  displayedItems.value += itemsPerPage.value
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const getDifficultyClass = (difficulty: string) => {
  const classes = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const formatProjectDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const navigateToProject = (projectId: string) => {
  navigateTo(`/projects/${projectId}`)
}
</script>
