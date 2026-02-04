<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, {{ user?.name }}!
      </h1>
      <p class="text-gray-600 mt-2">
        Guide projects, manage tasks, and mentor volunteers.
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
            <p class="text-sm font-medium text-gray-600">Mentoring Projects</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.mentoringProjects }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <UsersIcon size="24" class="text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Mentees</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.mentees }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <CheckSquareIcon size="24" class="text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tasks Created</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.tasksCreated }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <ClockIcon size="24" class="text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Mentorship Requests</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.mentorshipRequests }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- My Projects -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">My Projects</h2>
          <span class="text-sm text-gray-500">{{ mentoringProjects.length }} active</span>
        </div>
        <div class="space-y-4">
          <div
            v-for="project in mentoringProjects"
            :key="project.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push(`/projects/${project.id}`)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">{{ project.name }}</h3>
              <span 
                class="badge"
                :class="{
                  'badge-success': project.status === 'open',
                  'badge-warning': project.status === 'in_progress',
                  'badge-secondary': project.status === 'completed'
                }"
              >
                {{ project.status }}
              </span>
            </div>
            
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center text-sm text-gray-500">
                <UsersIcon size="16" class="mr-1" />
                {{ project.volunteers }} volunteers
              </div>
              <span class="text-sm text-gray-500">{{ project.tasks_pending }} pending tasks</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">{{ project.progress }}% complete</span>
              <div class="flex space-x-2">
                <button 
                  class="btn btn-primary btn-sm"
                  @click.stop="manageTasks(project)"
                >
                  Manage Tasks
                </button>
                <button 
                  class="btn btn-secondary btn-sm"
                  @click.stop="assignVolunteers(project)"
                >
                  Assign Volunteers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Management -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Task Management</h2>
          <button 
            class="btn btn-primary btn-sm"
            @click="showCreateTask = true"
          >
            <PlusIcon size="16" class="mr-1" />
            Create Task
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="border border-gray-200 rounded-lg p-3"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
                <p class="text-sm text-gray-600">{{ task.project_name }}</p>
              </div>
              <span 
                class="badge badge-sm"
                :class="{
                  'badge-secondary': task.status === 'todo',
                  'badge-warning': task.status === 'in_progress',
                  'badge-primary': task.status === 'review',
                  'badge-success': task.status === 'completed'
                }"
              >
                {{ task.status.replace('_', ' ') }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span 
                  class="badge badge-sm"
                  :class="{
                    'badge-danger': task.priority === 'high',
                    'badge-warning': task.priority === 'medium',
                    'badge-secondary': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
                <span v-if="task.assigned_to" class="text-xs text-gray-500">
                  Assigned to {{ task.assigned_to }}
                </span>
              </div>
              <div class="flex space-x-1">
                <button 
                  class="btn btn-ghost btn-sm"
                  @click="editTask(task)"
                >
                  Edit
                </button>
                <button 
                  v-if="!task.assigned_to"
                  class="btn btn-primary btn-sm"
                  @click="assignTask(task)"
                >
                  Assign
                </button>
              </div>
            </div>
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
                @click.stop="offerMentorship(project.id)"
                class="btn btn-primary btn-sm"
              >
                Offer Mentorship
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mentorship Requests -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Mentorship Requests</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="request in mentorshipRequests"
          :key="request.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-medium text-sm">
                  {{ request.volunteer_name.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ request.volunteer_name }}</h3>
                <p class="text-sm text-gray-600">{{ request.project_name }}</p>
              </div>
            </div>
            <span 
              class="badge badge-sm"
              :class="{
                'badge-warning': request.status === 'pending',
                'badge-success': request.status === 'accepted',
                'badge-danger': request.status === 'declined'
              }"
            >
              {{ request.status }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-3">{{ request.message }}</p>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ formatDate(request.requested_at) }}</span>
            <div v-if="request.status === 'pending'" class="flex space-x-2">
              <button 
                class="btn btn-secondary btn-sm"
                @click="declineMentorship(request)"
              >
                Decline
              </button>
              <button 
                class="btn btn-primary btn-sm"
                @click="acceptMentorship(request)"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Volunteer Assignment -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Volunteers</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="volunteer in availableVolunteers"
          :key="volunteer.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span class="text-primary-600 font-medium text-sm">
                {{ volunteer.name.split(' ').map(n => n[0]).join('') }}
              </span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ volunteer.name }}</h3>
              <p class="text-sm text-gray-600">Score: {{ volunteer.contribution_score }}</p>
            </div>
          </div>

          <div class="mb-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in volunteer.skills.slice(0, 3)"
                :key="skill"
                class="badge badge-secondary text-xs"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <button 
            class="btn btn-primary btn-sm w-full"
            @click="assignVolunteerToTask(volunteer)"
          >
            Assign to Task
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Task Modal -->
  <div v-if="showCreateTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-lg w-full mx-4">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Create New Task</h2>
          <button @click="showCreateTask = false" class="text-gray-400 hover:text-gray-600">
            <XIcon size="24" />
          </button>
        </div>

        <form @submit.prevent="createTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select v-model="newTask.project_id" required class="input">
              <option value="">Select Project</option>
              <option v-for="project in mentoringProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input v-model="newTask.title" type="text" required class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="newTask.description" required class="textarea" rows="3"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select v-model="newTask.priority" class="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="newTask.due_date" type="date" class="input" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input v-model="newTask.tags" type="text" placeholder="frontend, api, testing" class="input" />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showCreateTask = false" class="btn btn-secondary btn-md">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-md">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const router = useRouter()
const { user } = authStore

const showCreateTask = ref(false)

// Get bookmarked projects
const bookmarkedProjects = computed(() => {
  return projectsStore.projects.filter(project => 
    authStore.bookmarkedProjects.includes(project.id)
  )
})

// Mock data for mentor dashboard
const stats = ref({
  mentoringProjects: 4,
  mentees: 15,
  tasksCreated: 32,
  mentorshipRequests: 6
})

const mentoringProjects = ref([
  {
    id: '1',
    name: 'Learning Platform',
    status: 'in_progress',
    volunteers: 8,
    tasks_pending: 5,
    progress: 65
  },
  {
    id: '2',
    name: 'Environmental Tracker',
    status: 'open',
    volunteers: 4,
    tasks_pending: 3,
    progress: 25
  }
])

const recentTasks = ref([
  {
    id: '1',
    title: 'Implement user authentication',
    project_name: 'Learning Platform',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'Alice Johnson'
  },
  {
    id: '2',
    title: 'Create API documentation',
    project_name: 'Environmental Tracker',
    status: 'todo',
    priority: 'medium',
    assigned_to: null
  },
  {
    id: '3',
    title: 'Setup database schema',
    project_name: 'Learning Platform',
    status: 'completed',
    priority: 'high',
    assigned_to: 'Bob Smith'
  }
])

const mentorshipRequests = ref([
  {
    id: '1',
    volunteer_name: 'Emma Wilson',
    project_name: 'Learning Platform',
    message: 'Would love guidance on React architecture and best practices.',
    status: 'pending',
    requested_at: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    volunteer_name: 'David Chen',
    project_name: 'Environmental Tracker',
    message: 'Need help with Python data processing and machine learning implementation.',
    status: 'pending',
    requested_at: '2024-02-02T14:30:00Z'
  }
])

const availableVolunteers = ref([
  {
    id: '1',
    name: 'Alice Johnson',
    skills: ['JavaScript', 'React', 'Node.js'],
    contribution_score: 850
  },
  {
    id: '2',
    name: 'Bob Smith',
    skills: ['Python', 'Django', 'PostgreSQL'],
    contribution_score: 720
  },
  {
    id: '3',
    name: 'Carol Davis',
    skills: ['UI/UX Design', 'Figma', 'CSS'],
    contribution_score: 650
  }
])

const newTask = ref({
  project_id: '',
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  tags: ''
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const manageTasks = (project: any) => {
  // Navigate to project task management
  console.log('Managing tasks for project:', project.id)
}

const assignVolunteers = (project: any) => {
  // Open volunteer assignment modal
  console.log('Assigning volunteers to project:', project.id)
}

const editTask = (task: any) => {
  // Open task edit modal
  console.log('Editing task:', task.id)
}

const assignTask = (task: any) => {
  // Open volunteer assignment modal for specific task
  console.log('Assigning task:', task.id)
}

const acceptMentorship = async (request: any) => {
  // API call to accept mentorship request
  console.log('Accepting mentorship request:', request.id)
  
  // Update status
  request.status = 'accepted'
}

const declineMentorship = async (request: any) => {
  // API call to decline mentorship request
  console.log('Declining mentorship request:', request.id)
  
  // Update status
  request.status = 'declined'
}

const assignVolunteerToTask = (volunteer: any) => {
  // Open task selection modal for volunteer assignment
  console.log('Assigning volunteer to task:', volunteer.id)
}

const createTask = async () => {
  // API call to create new task
  console.log('Creating task:', newTask.value)
  
  // Add to tasks list
  recentTasks.value.unshift({
    id: Date.now().toString(),
    title: newTask.value.title,
    project_name: mentoringProjects.value.find(p => p.id === newTask.value.project_id)?.name || '',
    status: 'todo',
    priority: newTask.value.priority,
    assigned_to: null
  })
  
  // Reset form and close modal
  newTask.value = {
    project_id: '',
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: ''
  }
  showCreateTask.value = false
}

// Bookmark methods
const removeBookmark = (projectId: string) => {
  authStore.toggleBookmark(projectId)
}

const openProject = (projectId: string) => {
  router.push(`/projects/${projectId}`)
}

const offerMentorship = (projectId: string) => {
  console.log('Offering mentorship for project:', projectId)
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