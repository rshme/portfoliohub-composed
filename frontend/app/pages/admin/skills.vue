<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Skills Management</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage skill tags and maintain skill database for the platform
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Skill
        </button>
      </div>
    </div>
    
    <!-- Search -->
    <div class="mb-6 bg-white shadow-sm rounded-lg border border-gray-200 p-4">
      <div class="max-w-md">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Skills</label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Search by skill name..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="bg-white shadow-sm rounded-lg border border-gray-200 p-12">
      <div class="flex justify-center items-center">
        <svg class="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-gray-600">Loading skills...</span>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error loading skills</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchSkills"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
    
    <!-- Skills Grid -->
    <div v-else>
      <div v-if="filteredSkills.length === 0" class="bg-white shadow-sm rounded-lg border border-gray-200 p-12">
        <div class="text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>{{ searchQuery ? 'No skills match your search' : 'No skills found' }}</p>
          <button
            v-if="!searchQuery"
            @click="openCreateModal"
            class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Skill
          </button>
        </div>
      </div>
      
      <div v-else>
        <div class="mb-4 text-sm text-gray-600">
          Showing {{ filteredSkills.length }} of {{ skills.length }} skills
        </div>
        
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="skill in filteredSkills"
            :key="skill.id"
            class="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <div class="text-2xl flex-shrink-0">{{ skill.icon || '⭐' }}</div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 truncate">{{ skill.name }}</h3>
                  <p class="mt-1 text-xs text-gray-400">
                    Added {{ formatDate(skill.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-3 flex justify-end space-x-2">
              <button
                @click="openEditModal(skill)"
                class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                title="Edit Skill"
              >
                <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                @click="confirmDelete(skill)"
                class="inline-flex items-center px-2.5 py-1.5 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                title="Delete Skill"
              >
                <svg class="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ isEditMode ? 'Edit Skill' : 'Create New Skill' }}
                </h3>
                <button
                  type="button"
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label for="icon" class="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    id="icon"
                    v-model="formData.icon"
                    type="text"
                    placeholder="⭐ (Optional)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxlength="2"
                  />
                  <p class="mt-1 text-xs text-gray-500">Use an emoji to represent this skill</p>
                </div>
                
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="e.g., JavaScript, Python, React"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    :class="{ 'border-red-500': formErrors.name }"
                  />
                  <p v-if="formErrors.name" class="mt-1 text-xs text-red-500">{{ formErrors.name }}</p>
                </div>
              </div>
              
              <div v-if="formError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700">{{ formError }}</p>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="submit"
                :disabled="submitting"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Saving...' : (isEditMode ? 'Update Skill' : 'Create Skill') }}
              </button>
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Skill {
  id: string
  name: string
  icon: string
  createdAt: string
}

interface FormData {
  name: string
  icon: string
}

interface FormErrors {
  name?: string
}

const skills = ref<Skill[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const editingSkill = ref<Skill | null>(null)
const submitting = ref(false)
const formError = ref('')

const formData = reactive<FormData>({
  name: '',
  icon: ''
})

const formErrors = reactive<FormErrors>({})

// Client-side filtering
const filteredSkills = computed(() => {
  if (!searchQuery.value.trim()) {
    return skills.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return skills.value.filter(skill =>
    skill.name.toLowerCase().includes(query)
  )
})

// Fetch skills from API
const fetchSkills = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    const response = await $fetch(`${baseURL}/skills`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (response && response.data) {
      skills.value = response.data
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'An error occurred while fetching skills'
    console.error('Error fetching skills:', err)
  } finally {
    loading.value = false
  }
}

// Open create modal
const openCreateModal = () => {
  isEditMode.value = false
  editingSkill.value = null
  formData.name = ''
  formData.icon = ''
  formErrors.name = undefined
  formError.value = ''
  showModal.value = true
}

// Open edit modal
const openEditModal = (skill: Skill) => {
  isEditMode.value = true
  editingSkill.value = skill
  formData.name = skill.name
  formData.icon = skill.icon
  formErrors.name = undefined
  formError.value = ''
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    isEditMode.value = false
    editingSkill.value = null
    formData.name = ''
    formData.icon = ''
    formErrors.name = undefined
    formError.value = ''
  }, 300)
}

// Validate form
const validateForm = (): boolean => {
  formErrors.name = undefined
  
  let isValid = true
  
  if (!formData.name.trim()) {
    formErrors.name = 'Skill name is required'
    isValid = false
  }
  
  return isValid
}

// Handle form submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  submitting.value = true
  formError.value = ''
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    const requestBody: any = {
      name: formData.name.trim()
    }
    
    // Only include icon if it's not empty
    if (formData.icon.trim()) {
      requestBody.icon = formData.icon.trim()
    }
    
    if (isEditMode.value && editingSkill.value) {
      // Update skill
      await $fetch(`${baseURL}/skills/${editingSkill.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    } else {
      // Create skill
      await $fetch(`${baseURL}/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    }
    
    // Refresh skills list
    await fetchSkills()
    
    closeModal()
  } catch (err: any) {
    formError.value = err.data?.message || err.message || 'An error occurred while saving the skill'
    console.error('Error saving skill:', err)
  } finally {
    submitting.value = false
  }
}

// Delete skill
const deleteSkill = async (skillId: string) => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    await $fetch(`${baseURL}/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    // Refresh skills list
    await fetchSkills()
    
    alert('Skill deleted successfully')
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Failed to delete skill'
    alert(`Error deleting skill: ${errorMessage}`)
    console.error('Error deleting skill:', err)
  }
}

// Confirm delete
const confirmDelete = (skill: Skill) => {
  if (confirm(`Are you sure you want to delete skill "${skill.name}"? This action cannot be undone.`)) {
    deleteSkill(skill.id)
  }
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load skills on mount
onMounted(() => {
  fetchSkills()
})
</script>
