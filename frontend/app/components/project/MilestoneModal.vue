<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {{ isEditMode ? 'Edit Milestone' : 'Create New Milestone' }}
            </h3>
            <button 
              @click="closeModal" 
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-6">
          <div class="space-y-5">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Milestone Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                placeholder="e.g., Phase 1 - Foundation"
                :class="[
                  'w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors',
                  validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                ]"
              />
              <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ validationErrors.name }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                required
                rows="4"
                placeholder="Describe what this milestone aims to achieve..."
                :class="[
                  'w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors resize-none',
                  validationErrors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                ]"
              ></textarea>
              <p v-if="validationErrors.description" class="mt-1 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ validationErrors.description }}
              </p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                id="status"
                v-model="formData.status"
                required
                :class="[
                  'w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors',
                  validationErrors.status ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                ]"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p v-if="validationErrors.status" class="mt-1 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ validationErrors.status }}
              </p>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="startDate"
                  v-model="formData.startDate"
                  type="date"
                  required
                  :class="[
                    'w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors',
                    validationErrors.startDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                  ]"
                />
                <p v-if="validationErrors.startDate" class="mt-1 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ validationErrors.startDate }}
                </p>
              </div>
              <div>
                <label for="endDate" class="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="endDate"
                  v-model="formData.endDate"
                  type="date"
                  required
                  :min="formData.startDate"
                  :class="[
                    'w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors',
                    validationErrors.endDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                  ]"
                />
                <p v-if="validationErrors.endDate" class="mt-1 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ validationErrors.endDate }}
                </p>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-semibold text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                v-model="tagsInput"
                type="text"
                placeholder="e.g., backend, setup, foundation"
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <p class="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
              
              <!-- Tags Preview -->
              <div v-if="formData.tags.length > 0" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1.5 text-primary-600 hover:text-primary-800"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Order Position (for edit mode) -->
            <div v-if="isEditMode">
              <label for="orderPosition" class="block text-sm font-semibold text-gray-700 mb-2">
                Order Position
              </label>
              <input
                id="orderPosition"
                v-model.number="formData.orderPosition"
                type="number"
                min="0"
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <p class="mt-1 text-xs text-gray-500">Controls the order of milestones in the timeline</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              @click="closeModal"
              class="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Milestone' : 'Create Milestone') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface MilestoneFormData {
  name: string
  description: string
  status: string
  orderPosition: number
  startDate: string
  endDate: string
  tags: string[]
}

interface ValidationErrors {
  name?: string
  description?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface Props {
  isOpen: boolean
  milestone?: any
  projectId: string | number
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'submit'])

const isSubmitting = ref(false)
const tagsInput = ref('')
const validationErrors = ref<ValidationErrors>({})

const isEditMode = computed(() => !!props.milestone)

const formData = ref<MilestoneFormData>({
  name: '',
  description: '',
  status: 'not_started',
  orderPosition: 0,
  startDate: '',
  endDate: '',
  tags: []
})

// Watch for milestone prop changes (for edit mode)
watch(() => props.milestone, (newMilestone) => {
  if (newMilestone) {
    formData.value = {
      name: newMilestone.name || '',
      description: newMilestone.description || '',
      status: newMilestone.status || 'not_started',
      orderPosition: newMilestone.orderPosition || 0,
      startDate: newMilestone.startDate || '',
      endDate: newMilestone.endDate || '',
      tags: newMilestone.tags || []
    }
    tagsInput.value = newMilestone.tags ? newMilestone.tags.join(', ') : ''
  }
  validationErrors.value = {}
}, { immediate: true })

// Watch for modal open/close to reset validation errors
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    validationErrors.value = {}
  }
})

// Watch tags input and convert to array
watch(tagsInput, (newValue) => {
  if (newValue) {
    formData.value.tags = newValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else {
    formData.value.tags = []
  }
})

const validateForm = (): boolean => {
  const errors: ValidationErrors = {}
  
  // Name validation
  if (!formData.value.name.trim()) {
    errors.name = 'Milestone name is required'
  } else if (formData.value.name.trim().length < 3) {
    errors.name = 'Milestone name must be at least 3 characters'
  } else if (formData.value.name.trim().length > 100) {
    errors.name = 'Milestone name must not exceed 100 characters'
  }
  
  // Description validation
  if (!formData.value.description.trim()) {
    errors.description = 'Description is required'
  } else if (formData.value.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  } else if (formData.value.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters'
  }
  
  // Status validation
  if (!formData.value.status) {
    errors.status = 'Please select a status'
  }
  
  // Start date validation
  if (!formData.value.startDate) {
    errors.startDate = 'Start date is required'
  }
  
  // End date validation
  if (!formData.value.endDate) {
    errors.endDate = 'End date is required'
  } else if (formData.value.startDate && formData.value.endDate) {
    const startDate = new Date(formData.value.startDate)
    const endDate = new Date(formData.value.endDate)
    
    if (endDate < startDate) {
      errors.endDate = 'End date must be after start date'
    }
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
  tagsInput.value = formData.value.tags.join(', ')
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    status: 'not_started',
    orderPosition: 0,
    startDate: '',
    endDate: '',
    tags: []
  }
  tagsInput.value = ''
  isSubmitting.value = false
  validationErrors.value = {}
}

const handleSubmit = async () => {
  // Validate form before submission
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    await emit('submit', {
      ...formData.value,
      milestoneId: props.milestone?.id
    })
    closeModal()
  } catch (error) {
    console.error('Error submitting milestone:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
