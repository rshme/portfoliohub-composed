<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white" id="modal-title">
              {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon size="24" />
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-6">
          <div class="space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Task Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="e.g., Design Landing Page"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :class="{ 'border-red-500': errors.title }"
              />
              <p v-if="errors.title" class="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircleIcon size="16" class="mr-1" />
                {{ errors.title }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                placeholder="Describe the task in detail..."
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                :class="{ 'border-red-500': errors.description }"
              ></textarea>
              <p v-if="errors.description" class="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircleIcon size="16" class="mr-1" />
                {{ errors.description }}
              </p>
            </div>

            <!-- Priority and Status Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Priority -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Priority <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.priority"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  :class="{ 'border-red-500': errors.priority }"
                >
                  <option value="">Select priority</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <p v-if="errors.priority" class="mt-1.5 text-sm text-red-600 flex items-center">
                  <AlertCircleIcon size="16" class="mr-1" />
                  {{ errors.priority }}
                </p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  :class="{ 'border-red-500': errors.status }"
                >
                  <option value="">Select status</option>
                  <option value="todo">📋 To Do</option>
                  <option value="in_progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <p v-if="errors.status" class="mt-1.5 text-sm text-red-600 flex items-center">
                  <AlertCircleIcon size="16" class="mr-1" />
                  {{ errors.status }}
                </p>
              </div>
            </div>

            <!-- Assigned To -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Assign To
              </label>
              <select
                v-model="formData.assignedToId"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :class="{ 'border-red-500': errors.assignedToId }"
                :disabled="isLoadingVolunteers"
              >
                <option value="">Unassigned</option>
                <option
                  v-for="volunteer in volunteers"
                  :key="volunteer.userId"
                  :value="volunteer.userId"
                >
                  {{ volunteer.user.fullName }}
                </option>
              </select>
              <p v-if="isLoadingVolunteers" class="mt-1.5 text-sm text-gray-600 flex items-center">
                <LoaderIcon size="16" class="mr-1 animate-spin" />
                Loading volunteers...
              </p>
              <p v-if="errors.assignedToId" class="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircleIcon size="16" class="mr-1" />
                {{ errors.assignedToId }}
              </p>
            </div>

            <!-- Milestone -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Milestone
              </label>
              <select
                v-model="formData.milestoneId"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :class="{ 'border-red-500': errors.milestoneId }"
                :disabled="isLoadingMilestones"
              >
                <option value="">No Milestone</option>
                <option
                  v-for="milestone in milestones"
                  :key="milestone.id"
                  :value="milestone.id"
                >
                  {{ milestone.name }} ({{ milestone.taskCount }} tasks, {{ milestone.completionPercentage }}% complete)
                </option>
              </select>
              <p v-if="isLoadingMilestones" class="mt-1.5 text-sm text-gray-600 flex items-center">
                <LoaderIcon size="16" class="mr-1 animate-spin" />
                Loading milestones...
              </p>
              <p v-if="errors.milestoneId" class="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircleIcon size="16" class="mr-1" />
                {{ errors.milestoneId }}
              </p>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Due Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.dueDate"
                type="date"
                class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :class="{ 'border-red-500': errors.dueDate }"
              />
              <p v-if="errors.dueDate" class="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircleIcon size="16" class="mr-1" />
                {{ errors.dueDate }}
              </p>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tags
              </label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="Add a tag..."
                  class="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  @keypress.enter.prevent="addTag"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="btn btn-secondary btn-md"
                >
                  <PlusIcon size="20" />
                </button>
              </div>
              <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 border border-primary-200"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1.5 text-primary-600 hover:text-primary-800"
                  >
                    <XIcon size="14" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              @click="handleClose"
              class="btn btn-ghost btn-md w-full sm:w-auto"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-md w-full sm:w-auto"
              :disabled="isSubmitting"
            >
              <LoaderIcon v-if="isSubmitting" size="20" class="mr-2 animate-spin" />
              <span>{{ isEditMode ? 'Update Task' : 'Create Task' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon, AlertCircleIcon, PlusIcon, LoaderIcon } from 'lucide-vue-next'

interface TaskFormData {
  title: string
  description: string
  priority: string
  status: string
  assignedToId: string
  milestoneId: string
  dueDate: string
  tags: string[]
}

interface Volunteer {
  userId: string
  user: {
    id: string
    fullName: string
    avatarUrl: string | null
  }
}

interface Milestone {
  id: string
  name: string
  status: string
  orderPosition: number
  taskCount: number
  completionPercentage: number
}

const props = defineProps<{
  isOpen: boolean
  task?: any
  projectId: string
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: TaskFormData & { taskId?: string }]
}>()

// State
const formData = ref<TaskFormData>({
  title: '',
  description: '',
  priority: '',
  status: 'todo',
  assignedToId: '',
  milestoneId: '',
  dueDate: '',
  tags: []
})

const errors = ref<Record<string, string>>({})
const newTag = ref('')
const isSubmitting = ref(false)
const volunteers = ref<Volunteer[]>([])
const isLoadingVolunteers = ref(false)
const milestones = ref<Milestone[]>([])
const isLoadingMilestones = ref(false)

// Computed
const isEditMode = computed(() => !!props.task)

// Methods
const validateForm = (): boolean => {
  errors.value = {}

  // Title validation
  if (!formData.value.title.trim()) {
    errors.value.title = 'Task title is required'
  } else if (formData.value.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters'
  } else if (formData.value.title.trim().length > 200) {
    errors.value.title = 'Title must not exceed 200 characters'
  }

  // Description validation
  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required'
  } else if (formData.value.description.trim().length < 10) {
    errors.value.description = 'Description must be at least 10 characters'
  } else if (formData.value.description.trim().length > 1000) {
    errors.value.description = 'Description must not exceed 1000 characters'
  }

  // Priority validation
  if (!formData.value.priority) {
    errors.value.priority = 'Priority is required'
  }

  // Status validation
  if (!formData.value.status) {
    errors.value.status = 'Status is required'
  }

  // Due date validation
  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Due date is required'
  } else {
    const dueDate = new Date(formData.value.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dueDate < today) {
      errors.value.dueDate = 'Due date cannot be in the past'
    }
  }

  return Object.keys(errors.value).length === 0
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  const submitData: TaskFormData & { taskId?: string } = {
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    priority: formData.value.priority,
    status: formData.value.status,
    assignedToId: formData.value.assignedToId || null,
    milestoneId: formData.value.milestoneId || null,
    dueDate: formData.value.dueDate,
    tags: formData.value.tags
  }

  if (isEditMode.value && props.task?.id) {
    submitData.taskId = props.task.id
  }

  emit('submit', submitData)
}

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    priority: '',
    status: 'todo',
    assignedToId: '',
    milestoneId: '',
    dueDate: '',
    tags: []
  }
  errors.value = {}
  newTag.value = ''
  isSubmitting.value = false
}

const fetchVolunteers = async () => {
  if (!props.projectId) return
  
  isLoadingVolunteers.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl
    
    const response = await $fetch<any>(`${baseURL}/projects/${props.projectId}/volunteers?status=active`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    volunteers.value = response.data || []
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    volunteers.value = []
  } finally {
    isLoadingVolunteers.value = false
  }
}

const fetchMilestones = async () => {
  if (!props.projectId) return
  
  isLoadingMilestones.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl
    
    const response = await $fetch<any>(`${baseURL}/milestones/projects/${props.projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    milestones.value = response.data || []
  } catch (error) {
    console.error('Error fetching milestones:', error)
    milestones.value = []
  } finally {
    isLoadingMilestones.value = false
  }
}

// Watchers
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Reset submitting state
    isSubmitting.value = false
    errors.value = {}
    
    if (props.task) {
      // Edit mode - populate form
      formData.value = {
        title: props.task.title || '',
        description: props.task.description || '',
        priority: props.task.priority || '',
        status: props.task.status || 'todo',
        assignedToId: props.task.assigned_to || props.task.assignedToId || '',
        milestoneId: props.task.milestone_id || props.task.milestoneId || '',
        dueDate: props.task.due_date || props.task.dueDate || '',
        tags: props.task.tags || []
      }
    } else {
      // Create mode - reset form
      resetForm()
    }
    // Fetch volunteers and milestones whenever modal opens
    fetchVolunteers()
    fetchMilestones()
  } else {
    // Reset state when modal closes
    isSubmitting.value = false
  }
})

watch(() => props.task, (newTask) => {
  if (props.isOpen && newTask) {
    formData.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority || '',
      status: newTask.status || 'todo',
      assignedToId: newTask.assigned_to || newTask.assignedToId || '',
      milestoneId: newTask.milestone_id || newTask.milestoneId || '',
      dueDate: newTask.due_date || newTask.dueDate || '',
      tags: newTask.tags || []
    }
  }
})

// Expose reset method for parent component
defineExpose({
  resetForm
})
</script>
