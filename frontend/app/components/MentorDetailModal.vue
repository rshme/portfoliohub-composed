<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div
        class="relative inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
      >
        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon size="24" />
        </button>

        <!-- Mentor Header -->
        <div class="flex items-start mb-6">
          <img
            :src="mentor.avatar"
            :alt="mentor.name"
            class="w-24 h-24 rounded-full mr-6"
          />
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ mentor.name }}</h2>
            <p class="text-lg text-gray-700 mb-1">{{ mentor.title }}</p>
            <p class="text-sm text-gray-600 mb-3">{{ mentor.organization }}</p>
            
            <!-- Rating & Status -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <StarIcon size="18" class="text-yellow-500 mr-1" />
                <span class="font-medium text-gray-900">{{ mentor.rating.toFixed(1) }}</span>
                <span class="text-sm text-gray-500 ml-1">({{ mentor.total_reviews }} reviews)</span>
              </div>
              <span 
                class="badge"
                :class="{
                  'badge-success': mentor.availability === 'available',
                  'badge-warning': mentor.availability === 'limited',
                  'badge-secondary': mentor.availability === 'unavailable'
                }"
              >
                {{ availabilityLabel(mentor.availability) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ mentor.experience_years }}</div>
            <div class="text-sm text-gray-600">Years Experience</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ mentor.projects_mentored }}</div>
            <div class="text-sm text-gray-600">Projects Mentored</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ mentor.current_mentees }}/{{ mentor.max_mentees }}</div>
            <div class="text-sm text-gray-600">Current Mentees</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ mentor.rating.toFixed(1) }}</div>
            <div class="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <!-- Bio -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p class="text-gray-700 leading-relaxed">{{ mentor.bio }}</p>
        </div>

        <!-- Expertise -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="expertise in mentor.expertise"
              :key="expertise"
              class="badge badge-primary"
            >
              {{ expertise }}
            </span>
          </div>
        </div>

        <!-- Languages & Timezone -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Languages</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="language in mentor.languages"
                :key="language"
                class="inline-flex items-center text-sm text-gray-700"
              >
                <GlobeIcon size="14" class="mr-1" />
                {{ language }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Timezone</h3>
            <div class="flex items-center text-sm text-gray-700">
              <ClockIcon size="14" class="mr-2" />
              {{ mentor.timezone }}
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Connect</h3>
          <div class="flex space-x-3">
            <a
              v-if="mentor.github"
              :href="mentor.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <GithubIcon size="16" class="mr-2" />
              GitHub
            </a>
            <a
              v-if="mentor.linkedin"
              :href="mentor.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <LinkedinIcon size="16" class="mr-2" />
              LinkedIn
            </a>
          </div>
        </div>

        <!-- Request Form -->
        <div v-if="mentor.availability !== 'unavailable'" class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Request Mentorship</h3>
          
          <form @submit.prevent="handleSubmit">
            <!-- Project Selection (optional) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Project (Optional)
              </label>
              <select v-model="selectedProject" class="input">
                <option value="">General mentorship request</option>
                <option value="project_1">Learning Platform</option>
                <option value="project_2">Environmental Tracker</option>
                <option value="project_3">Community Health App</option>
              </select>
            </div>

            <!-- Message -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message to Mentor
              </label>
              <textarea
                v-model="message"
                rows="4"
                class="input"
                placeholder="Introduce yourself and explain why you'd like this mentor's guidance..."
                required
              ></textarea>
            </div>

            <!-- Goals -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                What are your learning goals?
              </label>
              <textarea
                v-model="goals"
                rows="3"
                class="input"
                placeholder="What do you hope to achieve with this mentorship?"
                required
              ></textarea>
            </div>

            <!-- Commitment -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Time Commitment
              </label>
              <select v-model="timeCommitment" class="input" required>
                <option value="">Select your availability</option>
                <option value="1-2">1-2 hours per week</option>
                <option value="3-5">3-5 hours per week</option>
                <option value="5-10">5-10 hours per week</option>
                <option value="10+">10+ hours per week</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                class="btn btn-secondary btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-md"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Sending...</span>
                <span v-else>
                  <UserIcon size="18" class="inline mr-2" />
                  Send Request
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Unavailable Notice -->
        <div v-else class="border-t border-gray-200 pt-6">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-gray-700 font-medium mb-2">This mentor is currently unavailable</p>
            <p class="text-sm text-gray-600">
              They have reached their maximum capacity of mentees. Please check back later or explore other mentors.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Mentor } from '~/data/mockMentors'

interface Props {
  mentor: Mentor
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  request: [mentorId: string]
}>()

// Form data
const selectedProject = ref('')
const message = ref('')
const goals = ref('')
const timeCommitment = ref('')
const isSubmitting = ref(false)

const availabilityLabel = (availability: string) => {
  const labels: Record<string, string> = {
    available: 'Available',
    limited: 'Limited Availability',
    unavailable: 'Unavailable'
  }
  return labels[availability] || availability
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Emit request event with mentor ID and form data
    emit('request', props.mentor.id)

    // Reset form
    selectedProject.value = ''
    message.value = ''
    goals.value = ''
    timeCommitment.value = ''
  } catch (error) {
    console.error('Error submitting request:', error)
    alert('Failed to send request. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Modal animation could be added here if needed */
</style>
