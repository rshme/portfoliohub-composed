<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, Volunteer!
      </h1>
      <p class="text-gray-600 mt-2">
        Track your projects, complete tasks, and grow your skills.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <FolderIcon size="24" class="text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Joined Projects</p>
            <p class="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon size="24" class="text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tasks Completed</p>
            <p class="text-2xl font-bold text-gray-900">28</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <StarIcon size="24" class="text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Contribution Score</p>
            <p class="text-2xl font-bold text-gray-900">1250</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <UserIcon size="24" class="text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Mentorships</p>
            <p class="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- My Projects -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">My Projects</h2>
          <NuxtLink to="/explore" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Find Projects
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div>
              <h3 class="font-medium text-gray-900">Learning Platform</h3>
              <p class="text-sm text-gray-500">Frontend Developer • 65% complete</p>
            </div>
            <span class="badge badge-success">active</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div>
              <h3 class="font-medium text-gray-900">Environmental Tracker</h3>
              <p class="text-sm text-gray-500">Data Analyst • 30% complete</p>
            </div>
            <span class="badge badge-warning">in_progress</span>
          </div>
        </div>
      </div>

      <!-- My Tasks -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">My Tasks</h2>
          <span class="text-sm text-gray-500">2 pending</span>
        </div>
        <div class="space-y-3">
          <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">Implement user authentication</h3>
              <p class="text-sm text-gray-500 mb-2">Learning Platform</p>
              <div class="flex items-center space-x-2">
                <span class="badge badge-sm badge-danger">high</span>
                <span class="text-xs text-gray-500">Due Feb 15</span>
              </div>
            </div>
            <select class="ml-3 text-sm border border-gray-300 rounded px-2 py-1">
              <option value="todo">To Do</option>
              <option value="in_progress" selected>In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">Design dashboard layout</h3>
              <p class="text-sm text-gray-500 mb-2">Environmental Tracker</p>
              <div class="flex items-center space-x-2">
                <span class="badge badge-sm badge-warning">medium</span>
                <span class="text-xs text-gray-500">Due Feb 20</span>
              </div>
            </div>
            <select class="ml-3 text-sm border border-gray-300 rounded px-2 py-1">
              <option value="todo" selected>To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Projects (Bookmarks) -->
    <div v-if="bookmarkedProjects.length > 0" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Saved Projects</h2>
        <span class="text-sm text-gray-500">{{ bookmarkedProjects.length }} saved</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in bookmarkedProjects"
          :key="project.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
        >
          <!-- Remove Bookmark Button -->
          <button
            @click.stop="removeBookmark(project.id)"
            class="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-yellow-500"
          >
            <BookmarkIcon size="18" fill="currentColor" />
          </button>

          <div
            class="pr-8"
            @click="openProject(project.id)"
          >
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span class="text-gray-600 font-medium text-sm">
                  {{ project.creator?.name?.charAt(0) || 'P' }}
                </span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ project.name }}</h3>
                <p class="text-sm text-gray-500">{{ project.creator?.organization || project.creator?.name }}</p>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ project.description }}</p>
            
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center text-sm text-gray-500">
                <UsersIcon size="16" class="mr-1" />
                {{ project.volunteers_joined }}/{{ project.volunteers_needed }}
              </div>
              <span class="badge badge-sm badge-warning">{{ project.difficulty }}</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div class="bg-primary-500 h-2 rounded-full" :style="{ width: `${Math.round((project.volunteers_joined / project.volunteers_needed) * 100)}%` }"></div>
            </div>

            <div class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in project.tags.slice(0, 3)"
                :key="tag"
                class="badge badge-secondary text-xs"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ project.duration_estimate }}</span>
              <button
                v-if="project.status === 'open'"
                @click.stop="joinProject(project.id)"
                class="btn btn-primary btn-sm"
              >
                Join Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Projects -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recommended Projects</h2>
        <NuxtLink to="/explore" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span class="text-gray-600 font-medium text-sm">T</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Healthcare Platform</h3>
              <p class="text-sm text-gray-500">TechForGood NGO</p>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mb-3">Building a platform to connect patients with healthcare providers...</p>
          
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <UsersIcon size="16" class="mr-1" />
              6/10
            </div>
            <span class="badge badge-sm badge-warning">intermediate</span>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div class="bg-primary-500 h-2 rounded-full" style="width: 60%"></div>
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
            <span class="badge badge-secondary text-xs">React</span>
            <span class="badge badge-secondary text-xs">Node.js</span>
            <span class="badge badge-secondary text-xs">Healthcare</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">3-6 months</span>
            <button class="btn btn-primary btn-sm">Join Project</button>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span class="text-gray-600 font-medium text-sm">E</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">E-Learning Tools</h3>
              <p class="text-sm text-gray-500">Education First</p>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mb-3">Create interactive learning tools for students worldwide...</p>
          
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <UsersIcon size="16" class="mr-1" />
              3/8
            </div>
            <span class="badge badge-sm badge-success">beginner</span>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div class="bg-primary-500 h-2 rounded-full" style="width: 37%"></div>
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
            <span class="badge badge-secondary text-xs">Vue.js</span>
            <span class="badge badge-secondary text-xs">Education</span>
            <span class="badge badge-secondary text-xs">UI/UX</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">2-4 months</span>
            <button class="btn btn-primary btn-sm">Join Project</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mentorship Requests -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Mentorship Requests</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-900">Dr. Sarah Wilson</h3>
            <p class="text-sm text-gray-600">Learning Platform • React, System Architecture</p>
            <span class="text-xs text-gray-500">Requested Feb 1</span>
          </div>
          <span class="badge badge-warning">pending</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()

// Get bookmarked projects
const bookmarkedProjects = computed(() => {
  return projectsStore.projects.filter(project => 
    authStore.bookmarkedProjects.includes(project.id)
  )
})

// Methods
const removeBookmark = (projectId: string) => {
  authStore.toggleBookmark(projectId)
}

const openProject = (projectId: string) => {
  router.push(`/projects/${projectId}`)
}

const joinProject = (projectId: string) => {
  console.log('Joining project:', projectId)
  router.push(`/projects/${projectId}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>