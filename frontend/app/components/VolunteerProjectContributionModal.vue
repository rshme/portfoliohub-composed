<template>
  <div
    v-if="project"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 z-10">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h2 class="text-2xl font-bold">{{ project.name }}</h2>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur"
              >
                {{ formatStatus(project.status) }}
              </span>
            </div>
            <p class="text-blue-100 text-sm">Your Contribution Details</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors ml-4"
          >
            <XIcon size="24" />
          </button>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="bg-white/10 backdrop-blur rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <TrophyIcon size="20" class="text-amber-300" />
              <div>
                <p class="text-xs text-blue-100">Contribution Score</p>
                <p class="text-2xl font-bold">{{ project.contribution_score }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <CheckCircleIcon size="20" class="text-emerald-300" />
              <div>
                <p class="text-xs text-blue-100">Tasks Completed</p>
                <p class="text-2xl font-bold">{{ project.tasks_completed }}/{{ project.tasks_total }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-3">
            <div class="flex items-center space-x-2">
              <CalendarIcon size="20" class="text-blue-200" />
              <div>
                <p class="text-xs text-blue-100">Joined</p>
                <p class="text-lg font-semibold">{{ formatJoinDate(project.joined_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-240px)] pb-10">
        <div class="p-6 space-y-6">
          <!-- Project Description -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="font-semibold text-gray-900 mb-2 flex items-center">
              <InfoIcon size="20" class="mr-2 text-blue-600" />
              About This Project
            </h3>
            <p class="text-gray-700 leading-relaxed">{{ project.description }}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="badge badge-secondary text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: People -->
            <div class="space-y-6">
              <!-- Project Creator -->
              <div class="bg-white border border-gray-200 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon size="20" class="mr-2 text-purple-600" />
                  Project Creator
                </h3>
                <NuxtLink
                  :to="`/users/${project.creator.id}`"
                  class="flex items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-colors group"
                >
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <span class="text-white font-bold text-lg">
                      {{ project.creator.name.charAt(0) }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {{ project.creator.name }}
                    </h4>
                    <p class="text-sm text-gray-600">{{ project.creator.organization || 'Independent' }}</p>
                  </div>
                  <ChevronRightIcon size="20" class="text-gray-400 group-hover:text-purple-600 transition-colors" />
                </NuxtLink>
              </div>

              <!-- Project Mentors -->
              <div v-if="project.mentors && project.mentors.length > 0" class="bg-white border border-gray-200 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <AwardIcon size="20" class="mr-2 text-blue-600" />
                  Project Mentors
                  <span class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {{ project.mentors.length }}
                  </span>
                </h3>
                <div class="space-y-2">
                  <NuxtLink
                    v-for="mentor in project.mentors"
                    :key="mentor.id"
                    :to="`/users/${mentor.user_id}`"
                    class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow">
                      <span class="text-white font-medium text-sm">
                        {{ getMentorInitials(mentor.name) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {{ mentor.name }}
                      </h4>
                      <p class="text-xs text-gray-600">
                        {{ mentor.expertise.slice(0, 2).join(', ') }}
                        <span v-if="mentor.expertise.length > 2">+{{ mentor.expertise.length - 2 }}</span>
                      </p>
                    </div>
                    <ChevronRightIcon size="18" class="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </NuxtLink>
                </div>
              </div>

              <!-- Team Members -->
              <div v-if="project.volunteers && project.volunteers.length > 0" class="bg-white border border-gray-200 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <UsersIcon size="20" class="mr-2 text-emerald-600" />
                  Team Members
                  <span class="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {{ project.volunteers.length }}
                  </span>
                </h3>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <NuxtLink
                    v-for="volunteer in project.volunteers"
                    :key="volunteer.id"
                    :to="`/users/${volunteer.user_id}`"
                    class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3 shadow">
                      <span class="text-white font-medium text-sm">
                        {{ getVolunteerInitials(volunteer.name) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {{ volunteer.name }}
                      </h4>
                      <p class="text-xs text-gray-600">
                        Score: {{ volunteer.contribution_score }}
                      </p>
                    </div>
                    <ChevronRightIcon size="18" class="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Right Column: Tasks -->
            <div class="space-y-6">
              <!-- My Tasks -->
              <div class="bg-white border border-gray-200 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckSquareIcon size="20" class="mr-2 text-orange-600" />
                  My Tasks
                  <span class="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {{ myTasks.length }}
                  </span>
                </h3>

                <div v-if="myTasks.length === 0" class="text-center py-8">
                  <ClipboardIcon size="40" class="text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-500 text-sm">No tasks assigned yet</p>
                </div>

                <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                  <div
                    v-for="task in myTasks"
                    :key="task.id"
                    class="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition-all"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-medium text-gray-900 flex-1">{{ task.title }}</h4>
                      <span
                        class="badge badge-sm ml-2"
                        :class="{
                          'badge-secondary': task.status === 'todo',
                          'badge-warning': task.status === 'in_progress',
                          'badge-primary': task.status === 'review',
                          'badge-success': task.status === 'completed'
                        }"
                      >
                        {{ formatTaskStatus(task.status) }}
                      </span>
                    </div>

                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ task.description }}</p>

                    <div class="flex items-center justify-between text-xs">
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
                        <div v-if="task.tags && task.tags.length > 0" class="flex gap-1">
                          <span
                            v-for="tag in task.tags.slice(0, 2)"
                            :key="tag"
                            class="px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                      <div v-if="task.due_date" class="flex items-center text-gray-500">
                        <ClockIcon size="14" class="mr-1" />
                        <span>Due {{ formatDueDate(task.due_date) }}</span>
                      </div>
                    </div>

                    <!-- Task created by -->
                    <div v-if="task.created_by" class="mt-3 pt-3 border-t border-gray-100">
                      <p class="text-xs text-gray-500">
                        Created by {{ task.created_by_name || 'Mentor' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChartIcon size="20" class="mr-2 text-orange-600" />
                  Task Statistics
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Completed</span>
                    <div class="flex items-center">
                      <div class="w-32 h-2 bg-white rounded-full mr-2">
                        <div
                          class="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                          :style="{ width: `${(completedTasks / myTasks.length) * 100}%` }"
                        ></div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">{{ completedTasks }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">In Progress</span>
                    <div class="flex items-center">
                      <div class="w-32 h-2 bg-white rounded-full mr-2">
                        <div
                          class="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          :style="{ width: `${(inProgressTasks / myTasks.length) * 100}%` }"
                        ></div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">{{ inProgressTasks }}</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">To Do</span>
                    <div class="flex items-center">
                      <div class="w-32 h-2 bg-white rounded-full mr-2">
                        <div
                          class="h-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full"
                          :style="{ width: `${(todoTasks / myTasks.length) * 100}%` }"
                        ></div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">{{ todoTasks }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          <span class="font-medium text-gray-900">Total Contribution:</span>
          <span class="ml-2 text-lg font-bold text-purple-600">{{ project.contribution_score }} points</span>
        </div>
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="btn btn-secondary btn-md"
          >
            Close
          </button>
          <NuxtLink
            :to="`/projects/${project.id}`"
            class="btn btn-primary btn-md"
          >
            <ExternalLinkIcon size="18" class="mr-2" />
            View Full Project
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
  due_date?: string
  created_by?: string
  created_by_name?: string
}

interface Props {
  project: any
  volunteerUserId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Get tasks assigned to current volunteer
const myTasks = computed(() => {
  if (!props.project.tasks || !props.volunteerUserId) return []
  
  return props.project.tasks.filter((task: any) => 
    task.assigned_to === props.volunteerUserId
  )
})

// Task statistics
const completedTasks = computed(() => 
  myTasks.value.filter(task => task.status === 'completed').length
)

const inProgressTasks = computed(() => 
  myTasks.value.filter(task => task.status === 'in_progress').length
)

const todoTasks = computed(() => 
  myTasks.value.filter(task => task.status === 'todo').length
)

// Helper functions
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatTaskStatus = (status: string) => {
  const labels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    completed: 'Completed'
  }
  return labels[status] || status
}

const formatJoinDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `in ${diffDays}d`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getMentorInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}

const getVolunteerInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}

// Close modal on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close')
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
