<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <BookmarkIcon size="28" class="text-white" fill="white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          <p class="text-gray-600 mt-1">
            {{ bookmarkedProjects.length }} project{{ bookmarkedProjects.length !== 1 ? 's' : '' }} saved for later
          </p>
        </div>
      </div>
      
      <!-- Info Banner -->
      <div v-if="bookmarkedProjects.length > 0" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 mb-1">Quick Tip</h3>
          <p class="text-sm text-gray-700">
            Bookmarked projects are saved locally on this device. Click the bookmark icon again to remove a project from your list.
          </p>
        </div>
      </div>
    </div>

    <!-- Filters and Sort -->
    <div v-if="bookmarkedProjects.length > 0" class="card p-4 sm:p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <SearchIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="input pl-10 w-full"
              placeholder="Search bookmarked projects..."
            />
          </div>
        </div>

        <!-- Sort -->
        <div class="w-full sm:w-48">
          <select v-model="sortBy" class="input w-full">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            class="px-3 py-2 rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            class="px-3 py-2 rounded-md transition-colors"
            :class="viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="searchQuery" class="mt-4 flex items-center gap-2">
        <span class="text-sm text-gray-600">Active filters:</span>
        <button
          @click="searchQuery = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
        >
          Search: "{{ searchQuery }}"
          <XIcon size="14" class="ml-1" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <LoaderIcon size="32" class="animate-spin mx-auto text-yellow-600 mb-4" />
      <p class="text-gray-600">Loading your bookmarked projects...</p>
    </div>

    <!-- Projects Grid View -->
    <div v-else-if="filteredProjects.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="card hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col relative"
        @click="openProjectModal(project)"
      >
        <!-- Bookmark Badge -->
        <div class="absolute top-3 right-3 z-10">
          <button
            @click.stop="removeBookmark(project.id)"
            class="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-all shadow-lg hover:scale-110"
            title="Remove bookmark"
          >
            <BookmarkIcon size="18" fill="white" />
          </button>
        </div>

        <!-- Project Banner/Image -->
        <div class="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-t-lg overflow-hidden">
          <img 
            v-if="project.bannerUrl" 
            :src="project.bannerUrl" 
            :alt="project.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-6xl text-white/30">📁</span>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute top-3 left-3">
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg"
              :class="{
                'bg-green-500 text-white': project.status === 'active',
                'bg-blue-500 text-white': project.status === 'in_progress',
                'bg-gray-500 text-white': project.status === 'completed'
              }"
            >
              {{ statusLabel(project.status || 'active') }}
            </span>
          </div>
        </div>

        <!-- Project Content -->
        <div class="p-5 flex-1 flex flex-col">
          <!-- Project Title -->
          <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {{ project.name }}
          </h3>

          <!-- Project Description -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {{ project.description }}
          </p>

          <!-- Creator Info -->
          <div class="flex items-center mb-4 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span class="text-white font-medium text-sm">
                {{ getUserInitials(project.creator?.fullName || project.creator?.username || 'Unknown') }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-gray-900 text-sm truncate">{{ project.creator?.fullName || project.creator?.username || 'Unknown' }}</p>
              <p class="text-xs text-gray-500 truncate">@{{ project.creator?.username || 'unknown' }}</p>
            </div>
          </div>

          <!-- Project Stats -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                <UsersIcon size="16" class="text-blue-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Volunteers</p>
                <p class="font-semibold text-gray-900">{{ project.volunteerCount || 0 }}/{{ project.volunteersNeeded || 0 }}</p>
              </div>
            </div>

            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                <AwardIcon size="16" class="text-purple-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Level</p>
                <p class="font-semibold text-gray-900 capitalize">{{ project.level }}</p>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-600">Progress</span>
              <span class="text-xs font-semibold text-gray-900">{{ progress(project) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="{
                  'bg-gradient-to-r from-green-400 to-green-600': progress(project) === 100,
                  'bg-gradient-to-r from-blue-400 to-blue-600': progress(project) < 100 && progress(project) > 0,
                  'bg-gray-300': progress(project) === 0
                }"
                :style="{ width: `${progress(project)}%` }"
              ></div>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="project.categories && project.categories.length > 0" class="mb-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="category in project.categories.slice(0, 2)"
                :key="category.id"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                {{ category.icon }} {{ category.name }}
              </span>
              <span
                v-if="project.categories.length > 2"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
              >
                +{{ project.categories.length - 2 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects List View -->
    <div v-else-if="filteredProjects.length > 0 && viewMode === 'list'" class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
        @click="openProjectModal(project)"
      >
        <div class="p-6 flex flex-col sm:flex-row gap-6">
          <!-- Project Image -->
          <div class="relative w-full sm:w-48 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              v-if="project.bannerUrl" 
              :src="project.bannerUrl" 
              :alt="project.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-4xl text-white/30">📁</span>
            </div>
            
            <!-- Bookmark Button -->
            <button
              @click.stop="removeBookmark(project.id)"
              class="absolute top-2 right-2 p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-all shadow-lg hover:scale-110"
              title="Remove bookmark"
            >
              <BookmarkIcon size="16" fill="white" />
            </button>
          </div>

          <!-- Project Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {{ project.name }}
                </h3>
                <p class="text-gray-600 text-sm line-clamp-2 mb-2">
                  {{ project.description }}
                </p>
              </div>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                :class="{
                  'bg-green-500 text-white': project.status === 'active',
                  'bg-blue-500 text-white': project.status === 'in_progress',
                  'bg-gray-500 text-white': project.status === 'completed'
                }"
              >
                {{ statusLabel(project.status || 'active') }}
              </span>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <UsersIcon size="14" class="text-blue-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500">Volunteers</p>
                  <p class="text-sm font-semibold text-gray-900">{{ project.volunteerCount || 0 }}/{{ project.volunteersNeeded || 0 }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <AwardIcon size="14" class="text-purple-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500">Level</p>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ project.level }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Mentors</p>
                  <p class="text-sm font-semibold text-gray-900">{{ project.mentors?.length || 0 }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <TrendingUpIcon size="14" class="text-orange-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500">Progress</p>
                  <p class="text-sm font-semibold text-gray-900">{{ progress(project) }}%</p>
                </div>
              </div>
            </div>

            <!-- Categories -->
            <div v-if="project.categories && project.categories.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="category in project.categories.slice(0, 3)"
                :key="category.id"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                {{ category.icon }} {{ category.name }}
              </span>
              <span
                v-if="project.categories.length > 3"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
              >
                +{{ project.categories.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State - No Bookmarks -->
    <div v-else-if="!isLoading && bookmarkedProjects.length === 0" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookmarkIcon size="40" class="text-yellow-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">No Bookmarks Yet</h3>
        <p class="text-gray-600 mb-8">
          Start exploring projects and bookmark the ones you're interested in. You can find them all here later!
        </p>
        <NuxtLink to="/explore" class="btn btn-primary btn-lg inline-flex items-center">
          <SearchIcon size="20" class="mr-2" />
          Explore Projects
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State - No Search Results -->
    <div v-else-if="!isLoading && bookmarkedProjects.length > 0 && filteredProjects.length === 0" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchIcon size="40" class="text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
        <p class="text-gray-600 mb-6">
          No bookmarked projects match your search. Try adjusting your search term.
        </p>
        <button @click="searchQuery = ''" class="btn btn-secondary btn-md">
          <XIcon size="18" class="mr-2" />
          Clear Search
        </button>
      </div>
    </div>

    <!-- Quick Actions Footer -->
    <div v-if="bookmarkedProjects.length > 0" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border-2 border-primary-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Ready to join a project?</p>
          <p class="text-sm text-gray-600">Click on any project to view details and apply</p>
        </div>
      </div>
      <NuxtLink to="/explore" class="btn btn-primary btn-md whitespace-nowrap">
        <PlusIcon size="18" class="mr-2" />
        Explore More Projects
      </NuxtLink>
    </div>
  </div>

  <!-- Project Detail Modal -->
  <ProjectDetailModal
    v-if="selectedProject"
    :project="selectedProject"
    @close="selectedProject = null"
    @join="handleJoinProject"
  />
</template>

<script setup lang="ts">
import {
  Bookmark as BookmarkIcon,
  Search as SearchIcon,
  X as XIcon,
  Loader2 as LoaderIcon,
  Users as UsersIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Plus as PlusIcon,
} from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth-required']
})

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const config = useRuntimeConfig()

// State
const isLoading = ref(true)
const searchQuery = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedProject = ref(null)
const bookmarkedProjects = ref<any[]>([])

// Computed
const filteredProjects = computed(() => {
  let projects = [...bookmarkedProjects.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    projects = projects.filter(project =>
      project.name?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.creator?.fullName?.toLowerCase().includes(query)
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'newest':
      projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'name-asc':
      projects.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'name-desc':
      projects.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      break
  }

  return projects
})

// Methods
const getUserInitials = (name: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const progress = (project: any) => {
  if (!project.volunteersNeeded || project.volunteersNeeded === 0) return 0
  return Math.round((project.volunteerCount / project.volunteersNeeded) * 100)
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Active',
    in_progress: 'In Progress',
    completed: 'Completed',
    paused: 'Paused'
  }
  return labels[status] || status
}

const removeBookmark = async (projectId: string) => {
  // Remove from auth store
  authStore.toggleBookmark(projectId)
  
  // Remove from local array
  const index = bookmarkedProjects.value.findIndex(p => p.id === projectId)
  if (index > -1) {
    bookmarkedProjects.value.splice(index, 1)
  }
}

const openProjectModal = (project: any) => {
  selectedProject.value = project
}

const handleJoinProject = async (projectId: string) => {
  console.log('Joining project from bookmarks:', projectId)
  selectedProject.value = null
}

const fetchBookmarkedProjects = async () => {
  isLoading.value = true
  
  try {
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    const token = localStorage.getItem('auth_token')
    
    // Get bookmarked project IDs from auth store
    const bookmarkIds = authStore.bookmarkedProjects
    
    if (bookmarkIds.length === 0) {
      bookmarkedProjects.value = []
      return
    }

    // Fetch each bookmarked project
    const projectPromises = bookmarkIds.map(async (projectId) => {
      try {
        const response = await $fetch(`${baseURL}/projects/${projectId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })
        return response.data
      } catch (error) {
        console.error(`Failed to fetch project ${projectId}:`, error)
        return null
      }
    })

    const projects = await Promise.all(projectPromises)
    bookmarkedProjects.value = projects.filter(p => p !== null)
  } catch (error) {
    console.error('Error fetching bookmarked projects:', error)
  } finally {
    isLoading.value = false
  }
}

// Load bookmarked projects on mount
onMounted(async () => {
  await fetchBookmarkedProjects()
})

// Watch for changes in bookmarked projects
watch(() => authStore.bookmarkedProjects, async () => {
  await fetchBookmarkedProjects()
}, { deep: true })

// SEO
useHead({
  title: 'My Bookmarks - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'View and manage your bookmarked projects on PortfolioHub.'
    }
  ]
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
