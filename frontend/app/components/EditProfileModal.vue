<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">Edit Profile</h2>
                  <p class="text-blue-100 text-sm">Update your personal information</p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Avatar Upload Section -->
              <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                <label class="block text-sm font-semibold text-gray-900 mb-4">
                  Profile Picture
                </label>
                <div class="flex flex-col sm:flex-row items-center gap-6">
                  <!-- Avatar Preview -->
                  <div class="relative group">
                    <div class="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity bg-gradient-to-br from-blue-500 to-purple-500"></div>
                    <img
                      :src="avatarPreview || formData.avatar"
                      :alt="formData.fullName"
                      class="relative w-28 h-28 rounded-2xl border-4 border-white shadow-xl object-cover"
                    />
                  </div>

                  <!-- Upload Controls -->
                  <div class="flex-1">
                    <div class="space-y-3">
                      <p class="text-sm text-gray-600">
                        Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <label class="btn btn-primary btn-sm cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleAvatarChange"
                          />
                        </label>
                        <button
                          v-if="avatarPreview"
                          type="button"
                          @click="removeAvatar"
                          class="btn btn-outline btn-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Basic Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h3>

                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    required
                    class="input input-bordered w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Bio <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.bio"
                    required
                    rows="4"
                    class="textarea textarea-bordered w-full"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">{{ formData.bio.length }} characters</p>
                </div>
              </div>

              <!-- Social Links -->
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Social Links
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- GitHub -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </label>
                    <input
                      v-model="formData.socialLinks.github"
                      type="url"
                      class="input input-bordered w-full"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <!-- LinkedIn -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </label>
                    <input
                      v-model="formData.socialLinks.linkedin"
                      type="url"
                      class="input input-bordered w-full"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <!-- Twitter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </label>
                    <input
                      v-model="formData.socialLinks.twitter"
                      type="url"
                      class="input input-bordered w-full"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              <!-- Skills & Interests (Only for Mentor/Volunteer) -->
              <div v-if="showSkillsAndInterests" class="space-y-6">
                <!-- Skills -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Skills
                      </h3>
                      <p class="text-xs text-gray-500 mt-1">{{ formData.skills.length }} selected</p>
                    </div>
                    <!-- Search Bar -->
                    <div class="relative w-48">
                      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        v-model="skillsSearch"
                        type="text"
                        placeholder="Search skills..."
                        class="input input-sm input-bordered w-full pl-9 text-sm"
                      />
                    </div>
                  </div>

                  <!-- Skills Loading State -->
                  <div v-if="loadingSkills" class="text-center py-8">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p class="text-sm text-gray-600 mt-3">Loading skills...</p>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="skillsError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p class="text-red-600 text-sm">{{ skillsError }}</p>
                    <button @click="loadSkills" class="btn btn-sm btn-primary mt-3">
                      Try Again
                    </button>
                  </div>

                  <!-- Skills Grid -->
                  <div v-else-if="filteredSkills.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <button
                      v-for="skill in filteredSkills"
                      :key="skill.id"
                      type="button"
                      @click="toggleSkill(skill.id)"
                      class="group relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
                      :class="formData.skills.includes(skill.id) 
                        ? 'bg-blue-100 border-blue-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-blue-300'"
                    >
                      <div 
                        class="text-2xl mb-1.5 transition-transform duration-200"
                        :class="formData.skills.includes(skill.id) ? 'scale-110' : ''"
                      >
                        {{ skill.icon }}
                      </div>
                      <span 
                        class="text-xs font-medium text-center line-clamp-2 transition-colors"
                        :class="formData.skills.includes(skill.id) ? 'text-blue-700' : 'text-gray-700'"
                      >
                        {{ skill.name }}
                      </span>
                      <svg
                        v-if="formData.skills.includes(skill.id)"
                        xmlns="http://www.w3.org/2000/svg"
                        class="absolute top-1.5 right-1.5 w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-8 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-gray-500 text-sm">No skills found matching "{{ skillsSearch }}"</p>
                  </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-200"></div>

                <!-- Interests -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Interests
                      </h3>
                      <p class="text-xs text-gray-500 mt-1">{{ formData.interests.length }} selected</p>
                    </div>
                    <!-- Search Bar -->
                    <div class="relative w-48">
                      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        v-model="categoriesSearch"
                        type="text"
                        placeholder="Search interests..."
                        class="input input-sm input-bordered w-full pl-9 text-sm"
                      />
                    </div>
                  </div>

                  <!-- Interests Loading State -->
                  <div v-if="loadingCategories" class="text-center py-8">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p class="text-sm text-gray-600 mt-3">Loading interests...</p>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="categoriesError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p class="text-red-600 text-sm">{{ categoriesError }}</p>
                    <button @click="loadCategories" class="btn btn-sm btn-primary mt-3">
                      Try Again
                    </button>
                  </div>

                  <!-- Interests Grid -->
                  <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <button
                      v-for="category in filteredCategories"
                      :key="category.id"
                      type="button"
                      @click="toggleCategory(category.id)"
                      class="group relative flex items-start p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left"
                      :class="formData.interests.includes(category.id) 
                        ? 'bg-purple-100 border-purple-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-purple-300'"
                    >
                      <div class="flex-shrink-0 mr-3">
                        <div 
                          class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all"
                          :class="formData.interests.includes(category.id) 
                            ? 'bg-purple-200 scale-110' 
                            : 'bg-gray-100'"
                        >
                          {{ category.icon }}
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div 
                          class="font-semibold text-sm mb-0.5 transition-colors"
                          :class="formData.interests.includes(category.id) ? 'text-purple-700' : 'text-gray-900'"
                        >
                          {{ category.name }}
                        </div>
                        <p class="text-xs text-gray-500 line-clamp-2">
                          {{ category.description }}
                        </p>
                      </div>
                      <svg
                        v-if="formData.interests.includes(category.id)"
                        xmlns="http://www.w3.org/2000/svg"
                        class="absolute top-2 right-2 w-5 h-5 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-8 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-gray-500 text-sm">No interests found matching "{{ categoriesSearch }}"</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="btn btn-outline btn-md"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleSubmit"
                class="btn btn-primary btn-md"
                :disabled="isSubmitting"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="!isSubmitting">Save Changes</span>
                <span v-else>Saving...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import Swal from 'sweetalert2'

interface Props {
  isOpen: boolean
  userData: any
}

interface Emits {
  (e: 'close'): void
  (e: 'update'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const api = useApi()

// State
const isSubmitting = ref(false)
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const selectedSkill = ref('')
const selectedInterest = ref('')
const skillsSearch = ref('')
const categoriesSearch = ref('')
const skillsError = ref('')
const categoriesError = ref('')

// Skills & Categories
const skills = ref<any[]>([])
const categories = ref<any[]>([])
const loadingSkills = ref(false)
const loadingCategories = ref(false)

// Form Data
const formData = reactive({
  fullName: '',
  bio: '',
  avatar: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
  },
  skills: [] as string[],
  interests: [] as string[],
})

// Computed
const showSkillsAndInterests = computed(() => {
  if (typeof localStorage === 'undefined') return false
  const user = localStorage.getItem('auth_user')
  if (!user) return false
  const userData = JSON.parse(user)
  return userData.role === 'mentor' || userData.role === 'volunteer'
})

const availableSkills = computed(() => {
  return skills.value.filter(skill => !formData.skills.includes(skill.id))
})

const availableCategories = computed(() => {
  return categories.value.filter(category => !formData.interests.includes(category.id))
})

const filteredSkills = computed(() => {
  if (!skillsSearch.value) return skills.value
  return skills.value.filter(skill => 
    skill.name.toLowerCase().includes(skillsSearch.value.toLowerCase())
  )
})

const filteredCategories = computed(() => {
  if (!categoriesSearch.value) return categories.value
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(categoriesSearch.value.toLowerCase()) ||
    category.description.toLowerCase().includes(categoriesSearch.value.toLowerCase())
  )
})

// Methods
const closeModal = () => {
  emit('close')
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select a valid image file (JPG, PNG, or GIF)',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      })
      return
    }

    avatarFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  avatarPreview.value = ''
  avatarFile.value = null
}

const addSkill = () => {
  if (selectedSkill.value && !formData.skills.includes(selectedSkill.value)) {
    formData.skills.push(selectedSkill.value)
    selectedSkill.value = ''
  }
}

const removeSkill = (skillId: string) => {
  const index = formData.skills.indexOf(skillId)
  if (index > -1) {
    formData.skills.splice(index, 1)
  }
}

const toggleSkill = (skillId: string) => {
  const index = formData.skills.indexOf(skillId)
  if (index > -1) {
    formData.skills.splice(index, 1)
  } else {
    formData.skills.push(skillId)
  }
}

const addInterest = () => {
  if (selectedInterest.value && !formData.interests.includes(selectedInterest.value)) {
    formData.interests.push(selectedInterest.value)
    selectedInterest.value = ''
  }
}

const removeInterest = (interestId: string) => {
  const index = formData.interests.indexOf(interestId)
  if (index > -1) {
    formData.interests.splice(index, 1)
  }
}

const toggleCategory = (categoryId: string) => {
  const index = formData.interests.indexOf(categoryId)
  if (index > -1) {
    formData.interests.splice(index, 1)
  } else {
    formData.interests.push(categoryId)
  }
}

const getSkillName = (skillId: string) => {
  const skill = skills.value.find(s => s.id === skillId)
  return skill?.name || 'Unknown'
}

const getSkillIcon = (skillId: string) => {
  const skill = skills.value.find(s => s.id === skillId)
  return skill?.icon || '📌'
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Unknown'
}

const getCategoryIcon = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.icon || '📌'
}

const loadSkills = async () => {
  if (!showSkillsAndInterests.value) return
  
  loadingSkills.value = true
  skillsError.value = ''
  try {
    const response = await api.getSkills()
    if (response.data) {
      skills.value = response.data
    }
  } catch (error: any) {
    console.error('Error loading skills:', error)
    skillsError.value = error.message || 'Could not load skills list'
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Skills',
      text: error.message || 'Could not load skills list',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    })
  } finally {
    loadingSkills.value = false
  }
}

const loadCategories = async () => {
  if (!showSkillsAndInterests.value) return
  
  loadingCategories.value = true
  categoriesError.value = ''
  try {
    const response = await api.getCategories()
    if (response.data) {
      categories.value = response.data
    }
  } catch (error: any) {
    console.error('Error loading categories:', error)
    categoriesError.value = error.message || 'Could not load interests list'
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Interests',
      text: error.message || 'Could not load interests list',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    })
  } finally {
    loadingCategories.value = false
  }
}

const handleSubmit = async () => {
  // Validate required fields
  if (!formData.fullName.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please enter your full name',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    })
    return
  }

  if (!formData.bio.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please enter your bio',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    })
    return
  }

  isSubmitting.value = true

  try {
    // Prepare request body
    const requestBody: any = {
      fullName: formData.fullName.trim(),
      bio: formData.bio.trim(),
      socialLinks: {
        github: formData.socialLinks.github.trim() || undefined,
        linkedin: formData.socialLinks.linkedin.trim() || undefined,
        twitter: formData.socialLinks.twitter.trim() || undefined,
      },
    }

    // Only add skills and interests if user is mentor or volunteer
    if (showSkillsAndInterests.value) {
      if (formData.skills.length > 0) {
        requestBody.skills = formData.skills
      }
      if (formData.interests.length > 0) {
        requestBody.interests = formData.interests
      }
    }

    // Make API request
    const response = await api.updateUserProfile(requestBody)

    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: response.message || 'Your profile has been updated successfully',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#3b82f6',
      timer: 2000,
      timerProgressBar: true,
    })

    // Emit update event and close modal
    emit('update')
    emit('close')
  } catch (error: any) {
    console.error('Error updating profile:', error)
    
    // Show error message
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.message || 'Failed to update profile. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset form with user data
    formData.fullName = props.userData?.name || ''
    formData.bio = props.userData?.bio || ''
    formData.avatar = props.userData?.avatar || ''
    formData.socialLinks.github = props.userData?.github || ''
    formData.socialLinks.linkedin = props.userData?.linkedin || ''
    formData.socialLinks.twitter = props.userData?.twitter || ''
    formData.skills = props.userData?.skills?.map((s: any) => s.id || s) || []
    formData.interests = props.userData?.interests?.map((i: any) => i.id || i) || []
    
    // Clear preview and search
    avatarPreview.value = ''
    avatarFile.value = null
    skillsSearch.value = ''
    categoriesSearch.value = ''

    // Load skills and categories if needed
    if (showSkillsAndInterests.value) {
      loadSkills()
      loadCategories()
    }
  }
})

// Load data on mount if modal is open
onMounted(() => {
  if (props.isOpen && showSkillsAndInterests.value) {
    loadSkills()
    loadCategories()
  }
})
</script>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .fixed > div,
.modal-leave-active .fixed > div {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .fixed > div,
.modal-leave-to .fixed > div {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
