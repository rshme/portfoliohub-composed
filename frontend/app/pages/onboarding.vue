<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center space-x-2 mb-6">
          <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">PH</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Welcome to PortfolioHub!
        </h1>
        <p class="text-gray-600">
          Let's get you set up to make the most of your experience as a {{ roleLabel }}.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm font-medium text-gray-700">{{ currentStep }}/{{ totalSteps }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="card p-8 mb-8">
        <!-- Step 1: Welcome & Role Overview -->
        <div v-if="currentStep === 1">
          <div class="text-center mb-6">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              :class="roleIconBg"
            >
              <UserIcon size="40" :class="roleIconColor" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              You're joining as a {{ roleLabel }}
            </h2>
            <p class="text-gray-600">{{ roleDescription }}</p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">What you can do:</h3>
            <ul class="space-y-2">
              <li
                v-for="benefit in roleBenefits"
                :key="benefit"
                class="flex items-start"
              >
                <CheckIcon size="20" class="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span class="text-gray-600">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Step 2: Profile Setup -->
        <div v-if="currentStep === 2">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  v-model="profile.bio"
                  rows="8"
                  class="input"
                  placeholder="Tell us about yourself and your experience..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  v-model="profile.location"
                  type="text"
                  class="input"
                  placeholder="City, Country"
                />

                <label class="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  GitHub Profile (Optional)
                </label>
                <input
                  v-model="profile.github"
                  type="url"
                  class="input"
                  placeholder="https://github.com/yourusername"
                />

                <label class="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  v-model="profile.linkedin"
                  type="url"
                  class="input"
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- Step 3: Skills/Interests Selection (for volunteers and mentors) -->
        <div v-if="currentStep === 3 && (isVolunteer || isMentor)">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ isVolunteer ? 'Select Your Skills & Interests' : 'Select Your Expertise & Interests' }}
            </h2>
            <p class="text-gray-600">
              {{ isVolunteer 
                ? 'Choose the technologies and areas you\'re interested in. This helps us match you with relevant projects.' 
                : 'Choose your technical expertise and areas where you can provide mentorship. This helps us match you with teams that need your guidance.'
              }}
            </p>
          </div>

          <div class="space-y-8">
            <!-- Skills Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ isVolunteer ? 'Technical Skills' : 'Technical Expertise' }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">{{ selectedSkills.length }} selected</p>
                </div>
                <div class="relative w-64">
                  <SearchIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="skillsSearch"
                    type="text"
                    placeholder="Search skills..."
                    class="input pl-10 py-2 text-sm"
                  />
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isLoadingSkills" class="flex items-center justify-center py-12">
                <LoaderIcon size="32" class="text-primary-600 animate-spin" />
              </div>

              <!-- Error State -->
              <div v-else-if="skillsError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p class="text-red-600 text-sm">{{ skillsError }}</p>
                <button @click="fetchSkills" class="btn btn-sm btn-primary mt-3">
                  Try Again
                </button>
              </div>

              <!-- Skills Grid -->
              <div v-else-if="filteredSkills.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-1">
                <button
                  v-for="skill in filteredSkills"
                  :key="skill.id"
                  @click="toggleSkill(skill.id)"
                  class="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                  :class="[
                    selectedSkills.includes(skill.id)
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  ]"
                >
                  <div 
                    class="text-3xl mb-2 transition-transform duration-200 group-hover:scale-110"
                    :class="selectedSkills.includes(skill.id) ? 'scale-110' : ''"
                  >
                    {{ skill.icon }}
                  </div>
                  <span 
                    class="text-sm font-medium text-center leading-tight"
                    :class="selectedSkills.includes(skill.id) ? 'text-primary-700' : 'text-gray-700'"
                  >
                    {{ skill.name }}
                  </span>
                  <CheckCircleIcon
                    v-if="selectedSkills.includes(skill.id)"
                    size="18"
                    class="absolute top-2 right-2 text-primary-600"
                  />
                </button>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
                <SearchIcon size="48" class="mx-auto text-gray-300 mb-3" />
                <p class="text-gray-500">No skills found matching "{{ skillsSearch }}"</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200"></div>

            <!-- Categories/Interests Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Areas of Interest</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ selectedInterests.length }} selected</p>
                </div>
                <div class="relative w-64">
                  <SearchIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="categoriesSearch"
                    type="text"
                    placeholder="Search interests..."
                    class="input pl-10 py-2 text-sm"
                  />
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isLoadingCategories" class="flex items-center justify-center py-12">
                <LoaderIcon size="32" class="text-primary-600 animate-spin" />
              </div>

              <!-- Error State -->
              <div v-else-if="categoriesError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p class="text-red-600 text-sm">{{ categoriesError }}</p>
                <button @click="fetchCategories" class="btn btn-sm btn-primary mt-3">
                  Try Again
                </button>
              </div>

              <!-- Categories Grid -->
              <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                <button
                  v-for="category in filteredCategories"
                  :key="category.id"
                  @click="toggleCategory(category.id)"
                  class="group relative flex items-start p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md text-left"
                  :class="[
                    selectedInterests.includes(category.id)
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  ]"
                >
                  <div class="flex-shrink-0 mr-3">
                    <div 
                      class="text-3xl transition-transform duration-200 group-hover:scale-110"
                      :class="selectedInterests.includes(category.id) ? 'scale-110' : ''"
                    >
                      {{ category.icon }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 
                      class="text-sm font-semibold mb-1"
                      :class="selectedInterests.includes(category.id) ? 'text-primary-700' : 'text-gray-900'"
                    >
                      {{ category.name }}
                    </h4>
                    <p class="text-xs text-gray-500 line-clamp-2">
                      {{ category.description }}
                    </p>
                  </div>
                  <CheckCircleIcon
                    v-if="selectedInterests.includes(category.id)"
                    size="18"
                    class="absolute top-3 right-3 text-primary-600"
                  />
                </button>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
                <SearchIcon size="48" class="mx-auto text-gray-300 mb-3" />
                <p class="text-gray-500">No interests found matching "{{ categoriesSearch }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Organization Details (for project creators) -->
        <div v-if="currentStep === 3 && isProjectCreator">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Organization</h2>
            <p class="text-gray-600 mb-4">
              Add your organization details to help volunteers understand your mission and projects.
            </p>
            
            <!-- Skip Option -->
            <div class="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                id="skipOrg"
                v-model="skipOrganization"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="skipOrg" class="ml-3 text-sm text-gray-700">
                Skip this step (you can add organization details later from your profile)
              </label>
            </div>
          </div>
          
          <div v-if="!skipOrganization" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="orgDetails.name"
                  type="text"
                  required
                  class="input"
                  placeholder="Tech Innovation Hub"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Industry <span class="text-red-500">*</span>
                </label>
                <select v-model="orgDetails.industry" required class="input">
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Non-profit">Non-profit</option>
                  <option value="Government">Government</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="orgDetails.description"
                rows="3"
                required
                class="input"
                placeholder="A brief description of your organization..."
              ></textarea>
            </div>

            <!-- Mission & Vision -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mission (Optional)
                </label>
                <textarea
                  v-model="orgDetails.mission"
                  rows="3"
                  class="input"
                  placeholder="Your organization's mission statement..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vision (Optional)
                </label>
                <textarea
                  v-model="orgDetails.vision"
                  rows="3"
                  class="input"
                  placeholder="Your organization's vision statement..."
                ></textarea>
              </div>
            </div>

            <!-- Location & Website -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  v-model="orgDetails.location"
                  type="text"
                  class="input"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  v-model="orgDetails.websiteUrl"
                  type="url"
                  class="input"
                  placeholder="https://yourorganization.com"
                />
              </div>
            </div>

            <!-- Employee Count & Founded Year -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Employee Count (Optional)
                </label>
                <input
                  v-model.number="orgDetails.employeeCount"
                  type="number"
                  min="1"
                  class="input"
                  placeholder="50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year (Optional)
                </label>
                <input
                  v-model.number="orgDetails.foundedYear"
                  type="number"
                  min="1800"
                  :max="new Date().getFullYear()"
                  class="input"
                  placeholder="2020"
                />
              </div>
            </div>

            <!-- Social Links -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Social Media (Optional)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    v-model="orgDetails.linkedinUrl"
                    type="url"
                    class="input"
                    placeholder="https://linkedin.com/company/yourorg"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    v-model="orgDetails.twitterUrl"
                    type="url"
                    class="input"
                    placeholder="https://twitter.com/yourorg"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Skip Message -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightIcon size="32" class="text-blue-600" />
            </div>
            <p class="text-gray-600">
              You've chosen to skip organization setup. You can add this information later from your profile settings.
            </p>
          </div>
        </div>

        <!-- Final Step -->
        <div v-if="currentStep === totalSteps">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon size="40" class="text-green-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              You're All Set!
            </h2>
            <p class="text-gray-600 mb-6">
              Your profile is complete. You can now start {{ finalActionText }}.
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="btn btn-ghost btn-md"
        >
          <ArrowLeftIcon size="20" class="mr-2" />
          Previous
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          class="btn btn-primary btn-md"
          :disabled="!canProceed"
        >
          Next
          <ArrowRightIcon size="20" class="ml-2" />
        </button>
        <button
          v-else
          @click="completeOnboarding"
          class="btn btn-primary btn-md"
        >
          Get Started
          <ArrowRightIcon size="20" class="ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Skill {
  id: string
  name: string
  icon: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  createdAt: string
}

interface SkillsResponse {
  statusCode: number
  message: string
  data: Skill[]
  timestamp: string
}

interface CategoriesResponse {
  statusCode: number
  message: string
  data: Category[]
  timestamp: string
}

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const authStore = useAuthStore()
const { user, isVolunteer, isProjectCreator, isMentor, updateUser, completeOnboarding: finishOnboarding } = storeToRefs(authStore)
const router = useRouter()
const config = useRuntimeConfig()

const currentStep = ref(1)
const totalSteps = 4

// Profile data
const profile = reactive({
  bio: '',
  location: '',
  github: '',
  linkedin: ''
})

// API data
const skills = ref<Skill[]>([])
const categories = ref<Category[]>([])
const isLoadingSkills = ref(false)
const isLoadingCategories = ref(false)
const skillsError = ref('')
const categoriesError = ref('')

// Search and filter
const skillsSearch = ref('')
const categoriesSearch = ref('')

// Skills and interests (now storing IDs)
const selectedSkills = ref<string[]>([])
const selectedInterests = ref<string[]>([])

// Organization details
const orgDetails = reactive({
  name: '',
  description: '',
  industry: '',
  websiteUrl: '',
  location: '',
  employeeCount: undefined as number | undefined,
  foundedYear: undefined as number | undefined,
  linkedinUrl: '',
  twitterUrl: '',
  mission: '',
  vision: ''
})

const skipOrganization = ref(false)
const isSavingOrganization = ref(false)

// Mentor details
const mentorDetails = reactive({
  experience: ''
})
const mentorExpertise = ref<string[]>([])
const selectedMentorshipAreas = ref<string[]>([])

// Filtered results
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

// Data options for non-volunteer roles (kept for backwards compatibility)
const programmingLanguages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 
  'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'R', 'SQL'
]

const frameworks = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 
  'Spring Boot', 'Laravel', 'React Native', 'Flutter', 'Next.js', 'Nuxt.js'
]

const mentorshipAreas = [
  'Technical Architecture', 'Code Review', 'Career Guidance', 'Project Management',
  'Team Leadership', 'Best Practices', 'Testing Strategies', 'Deployment',
  'Performance Optimization', 'Code Quality'
]

// Computed properties
const roleLabel = computed(() => {
  if (isVolunteer.value) return 'Volunteer'
  if (isProjectCreator.value) return 'Project Creator'
  if (isMentor.value) return 'Mentor'
  return 'User'
})

const roleDescription = computed(() => {
  if (isVolunteer.value) return 'Join meaningful projects and build your portfolio while making real impact.'
  if (isProjectCreator.value) return 'Create projects and find talented contributors to bring your ideas to life.'
  if (isMentor.value) return 'Guide and support project teams with your expertise and experience.'
  return ''
})

const roleBenefits = computed(() => {
  if (isVolunteer.value) return [
    'Access to real-world projects from NGOs and startups',
    'Get mentorship from experienced professionals',
    'Build a portfolio with meaningful contributions',
    'Network with like-minded developers and creators'
  ]
  if (isProjectCreator.value) return [
    'Find motivated contributors for your projects',
    'Access to a diverse talent pool',
    'Flexible collaboration terms',
    'Community-driven development approach'
  ]
  if (isMentor.value) return [
    'Share your expertise with the next generation',
    'Give back to the developer community',
    'Build leadership and mentoring skills',
    'Expand your professional network'
  ]
  return []
})

const roleIcon = computed(() => {
  if (isVolunteer.value) return UserIcon
  if (isProjectCreator.value) return BriefcaseIcon
  if (isMentor.value) return StarIcon
  return UserIcon
})

const roleIconBg = computed(() => {
  if (isVolunteer.value) return 'bg-primary-100'
  if (isProjectCreator.value) return 'bg-green-100'
  if (isMentor.value) return 'bg-yellow-100'
  return 'bg-gray-100'
})

const roleIconColor = computed(() => {
  if (isVolunteer.value) return 'text-primary-600'
  if (isProjectCreator.value) return 'text-green-600'
  if (isMentor.value) return 'text-yellow-600'
  return 'text-gray-600'
})

const finalActionText = computed(() => {
  if (isVolunteer.value) return 'exploring projects and building your portfolio'
  if (isProjectCreator.value) return 'creating projects and finding contributors'
  if (isMentor.value) return 'mentoring teams and sharing your expertise'
  return 'using PortfolioHub'
})

const canProceed = computed(() => {
  if (currentStep.value === 2) {
    return profile.bio.trim().length > 10
  }
  if (currentStep.value === 3) {
    if (isVolunteer.value || isMentor.value) {
      return selectedSkills.value.length > 0
    }
    if (isProjectCreator.value) {
      // Can proceed if skipping OR all required fields are filled
      return skipOrganization.value || (
        orgDetails.name.trim().length > 0 &&
        orgDetails.industry.trim().length > 0 &&
        orgDetails.description.trim().length > 10
      )
    }
  }
  return true
})

// Fetch skills from API
const fetchSkills = async () => {
  isLoadingSkills.value = true
  skillsError.value = ''
  
  try {
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    const response = await $fetch<SkillsResponse>(`${baseURL}/skills`)
    if (response.data) {
      skills.value = response.data
    }
  } catch (error: any) {
    console.error('Error fetching skills:', error)
    skillsError.value = 'Failed to load skills. Please try again.'
  } finally {
    isLoadingSkills.value = false
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  isLoadingCategories.value = true
  categoriesError.value = ''
  
  try {
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    const response = await $fetch<CategoriesResponse>(`${baseURL}/categories`)
    if (response.data) {
      categories.value = response.data
    }
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    categoriesError.value = 'Failed to load categories. Please try again.'
  } finally {
    isLoadingCategories.value = false
  }
}

// Toggle skill selection
const toggleSkill = (skillId: string) => {
  const index = selectedSkills.value.indexOf(skillId)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(skillId)
  }
}

// Toggle category selection
const toggleCategory = (categoryId: string) => {
  const index = selectedInterests.value.indexOf(categoryId)
  if (index > -1) {
    selectedInterests.value.splice(index, 1)
  } else {
    selectedInterests.value.push(categoryId)
  }
}

// Load data when component mounts
onMounted(async () => {
  // Initialize auth from localStorage first
  await authStore.initializeAuth()
  
  console.log('Onboarding mounted after init, isVolunteer:', isVolunteer.value, 'isMentor:', isMentor.value, 'user role:', user.value?.role)
  if (isVolunteer.value || isMentor.value) {
    fetchSkills()
    fetchCategories()
  }
})

// Watch for step changes to load data when reaching step 3
watch(currentStep, (newStep) => {
  if (newStep === 3 && (isVolunteer.value || isMentor.value)) {
    // Load skills if not already loaded
    if (skills.value.length === 0 && !isLoadingSkills.value) {
      console.log('Loading skills at step 3')
      fetchSkills()
    }
    // Load categories if not already loaded
    if (categories.value.length === 0 && !isLoadingCategories.value) {
      console.log('Loading categories at step 3')
      fetchCategories()
    }
  }
})

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const saveProfile = () => {
  // This would normally save to the backend
  console.log('Saving profile:', profile)
}

const completeOnboarding = async () => {
  console.log('Completing onboarding for user:', user.value?.email)
  isSavingOrganization.value = true
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    let organizationId: string | undefined

    // Handle Project Creator flow
    if (isProjectCreator.value) {
      // Create organization first if not skipped
      if (!skipOrganization.value) {
        console.log('Creating organization...')
        
        const organizationData: any = {
          name: orgDetails.name,
          description: orgDetails.description,
          industry: orgDetails.industry,
        }

        // Add optional fields only if they have values
        if (orgDetails.websiteUrl) organizationData.websiteUrl = orgDetails.websiteUrl
        if (orgDetails.location) organizationData.location = orgDetails.location
        if (orgDetails.employeeCount) organizationData.employeeCount = orgDetails.employeeCount
        if (orgDetails.foundedYear) organizationData.foundedYear = orgDetails.foundedYear
        if (orgDetails.mission) organizationData.mission = orgDetails.mission
        if (orgDetails.vision) organizationData.vision = orgDetails.vision

        // Add social links if any exist
        const socialLinks: any = {}
        if (orgDetails.linkedinUrl) socialLinks.linkedin = orgDetails.linkedinUrl
        if (orgDetails.twitterUrl) socialLinks.twitter = orgDetails.twitterUrl
        if (Object.keys(socialLinks).length > 0) {
          organizationData.socialLinks = socialLinks
        }

        console.log('Organization data:', organizationData)

        try {
          const orgResponse = await $fetch<any>(`${baseURL}/organizations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: organizationData
          })

          console.log('Organization created:', orgResponse)
          
          // Extract organization ID from response
          organizationId = orgResponse.data?.id || orgResponse.id
          console.log('Organization ID:', organizationId)
        } catch (orgError: any) {
          console.error('Error creating organization:', orgError)
          throw new Error('Failed to create organization. Please try again.')
        }
      }

      // Update user profile with organization ID and other details
      console.log('Updating user profile...')
      
      const profileData: any = {
        bio: profile.bio,
      }

      // Add social links
      const userSocialLinks: any = {}
      if (profile.github) userSocialLinks.github = profile.github
      if (profile.linkedin) userSocialLinks.linkedin = profile.linkedin
      if (Object.keys(userSocialLinks).length > 0) {
        profileData.socialLinks = userSocialLinks
      }

      // Add organization ID if created
      if (organizationId) {
        profileData.organizationId = organizationId
      }

      console.log('Profile data:', profileData)

      await $fetch(`${baseURL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: profileData
      })

      console.log('User profile updated successfully')

      // Update local user data
      authStore.updateUser({
        bio: profile.bio,
        github: profile.github,
        linkedin: profile.linkedin,
        organization: organizationId,
      })
    }
    // Handle Volunteer/Mentor flow
    else if (isVolunteer.value || isMentor.value) {
      const onboardingData: any = {
        bio: profile.bio,
        location: profile.location || undefined,
        github: profile.github || undefined,
        linkedin: profile.linkedin || undefined,
        skills: selectedSkills.value,
        interests: selectedInterests.value
      }

      console.log('Sending onboarding data to API:', onboardingData)

      await $fetch(`${baseURL}/users/profile/onboarding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: onboardingData
      })

      console.log('Onboarding data saved successfully')

      // Update local user data
      authStore.updateUser({
        bio: profile.bio,
        github: profile.github,
        linkedin: profile.linkedin,
        skills: selectedSkills.value,
      })
    }
    
    // Mark onboarding as completed
    console.log('Marking onboarding as completed')
    authStore.completeOnboarding()
    
    console.log('Onboarding completed! Redirecting to user profile...')
    // Redirect to user profile page
    const username = user.value?.username || authStore.user?.username
    if (username) {
      await router.push(`/users/${username}`)
    } else {
      // Fallback to dashboard if username not found
      console.warn('Username not found, redirecting to dashboard')
      await router.push('/dashboard')
    }
  } catch (error: any) {
    console.error('Error completing onboarding:', error)
    // Show error to user
    const errorMessage = error.message || 'Failed to save onboarding data. Please try again.'
    alert(errorMessage)
  } finally {
    isSavingOrganization.value = false
  }
}

// SEO
useHead({
  title: 'Welcome - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Complete your PortfolioHub profile setup and start your journey.'
    }
  ]
})
</script>