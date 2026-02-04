<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Explore Mentors</h1>
      <p class="text-gray-600">
        Connect with experienced mentors who can guide you and your projects to success.
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="card p-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <SearchIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="input pl-10"
              placeholder="Search mentors, expertise, or organizations..."
            />
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="flex gap-2">
          <button
            @click="showFilters = !showFilters"
            class="btn btn-secondary btn-md"
          >
            <FilterIcon size="20" class="mr-2" />
            Filters
            <span v-if="activeFiltersCount > 0" class="ml-2 badge badge-primary">
              {{ activeFiltersCount }}
            </span>
          </button>
          <button
            v-if="activeFiltersCount > 0"
            @click="clearAllFilters"
            class="btn btn-ghost btn-md"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Expanded Filters -->
      <div v-if="showFilters" class="mt-6 pt-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Availability Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div class="space-y-2">
              <label
                v-for="avail in availabilityOptions"
                :key="avail.value"
                class="flex items-center"
              >
                <input
                  v-model="filters.availability"
                  type="checkbox"
                  :value="avail.value"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-600">{{ avail.label }}</span>
              </label>
            </div>
          </div>

          <!-- Experience Level Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <div class="space-y-2">
              <label
                v-for="level in experienceLevelOptions"
                :key="level.value"
                class="flex items-center"
              >
                <input
                  v-model="filters.experienceLevel"
                  type="checkbox"
                  :value="level.value"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-600">{{ level.label }}</span>
              </label>
            </div>
          </div>

          <!-- Expertise Tags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expertise
            </label>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label
                v-for="expertise in popularExpertise"
                :key="expertise"
                class="flex items-center"
              >
                <input
                  v-model="filters.expertise"
                  type="checkbox"
                  :value="expertise"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-600">{{ expertise }}</span>
              </label>
            </div>
          </div>

          <!-- Minimum Rating -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select v-model.number="filters.minRating" class="input">
              <option :value="0">Any rating</option>
              <option :value="4.5">4.5+ stars</option>
              <option :value="4.7">4.7+ stars</option>
              <option :value="4.8">4.8+ stars</option>
              <option :value="4.9">4.9+ stars</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <p class="text-gray-600">
          {{ mentorsStore.filteredMentors.length }} mentor{{ mentorsStore.filteredMentors.length !== 1 ? 's' : '' }} found
        </p>
        <!-- Quick Stats -->
        <div class="flex items-center space-x-2 text-sm">
          <span class="badge badge-success">
            {{ mentorsStore.mentorsCountByAvailability.available }} available
          </span>
          <span class="badge badge-warning">
            {{ mentorsStore.mentorsCountByAvailability.limited }} limited
          </span>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Sort by:</span>
        <select v-model="sortBy" @change="handleSort" class="input w-auto">
          <option value="rating">Highest Rated</option>
          <option value="experience">Most Experience</option>
          <option value="projects">Most Projects</option>
          <option value="availability">Availability</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <LoaderIcon size="32" class="animate-spin mx-auto text-primary-600 mb-4" />
      <p class="text-gray-600">Loading mentors...</p>
    </div>

    <!-- Mentors Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="mentor in mentorsStore.filteredMentors"
        :key="mentor.id"
        class="card hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToMentor(mentor.id)"
      >
        <!-- Mentor Header -->
        <div class="p-6">
          <div class="flex items-center mb-4">
            <img
              :src="mentor.avatar"
              :alt="mentor.name"
              class="w-16 h-16 rounded-full mr-4"
            />
            <div class="flex-1">
              <h3 class="font-bold text-gray-900">{{ mentor.name }}</h3>
              <p class="text-sm text-gray-600">{{ mentor.title }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ mentor.organization }}</p>
            </div>
          </div>

          <!-- Rating and Stats -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <StarIcon size="16" class="text-yellow-500 mr-1" />
              <span class="text-sm font-medium text-gray-900">{{ mentor.rating.toFixed(1) }}</span>
              <span class="text-xs text-gray-500 ml-1">({{ mentor.total_reviews }})</span>
            </div>
            <span 
              class="badge text-xs"
              :class="{
                'badge-success': mentor.availability === 'available',
                'badge-warning': mentor.availability === 'limited',
                'badge-secondary': mentor.availability === 'unavailable'
              }"
            >
              {{ availabilityLabel(mentor.availability) }}
            </span>
          </div>

          <!-- Bio -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ mentor.bio }}</p>

          <!-- Experience Stats -->
          <div class="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ mentor.experience_years }}</div>
              <div class="text-xs text-gray-500">Years Exp</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ mentor.projects_mentored }}</div>
              <div class="text-xs text-gray-500">Projects</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ mentor.current_mentees }}/{{ mentor.max_mentees }}</div>
              <div class="text-xs text-gray-500">Mentees</div>
            </div>
          </div>

          <!-- Expertise Tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="expertise in mentor.expertise.slice(0, 4)"
              :key="expertise"
              class="badge badge-secondary text-xs"
            >
              {{ expertise }}
            </span>
            <span
              v-if="mentor.expertise.length > 4"
              class="badge badge-secondary text-xs"
            >
              +{{ mentor.expertise.length - 4 }}
            </span>
          </div>

          <!-- Languages & Timezone -->
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div class="flex items-center">
              <GlobeIcon size="14" class="mr-1" />
              {{ mentor.languages.slice(0, 2).join(', ') }}
            </div>
            <div class="flex items-center">
              <ClockIcon size="14" class="mr-1" />
              {{ mentor.timezone }}
            </div>
          </div>

          <!-- Action Button -->
          <button
            v-if="mentor.availability !== 'unavailable'"
            class="btn btn-primary btn-md w-full"
            :class="{ 'btn-secondary': mentor.availability === 'limited' }"
            @click.stop="navigateToMentor(mentor.id)"
          >
            <UserIcon size="18" class="mr-2" />
            View Profile
          </button>
          <button
            v-else
            class="btn btn-secondary btn-md w-full"
            disabled
          >
            Currently Unavailable
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && mentorsStore.filteredMentors.length === 0" class="text-center py-12">
      <SearchIcon size="48" class="mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
      <p class="text-gray-600 mb-4">
        Try adjusting your search criteria or clearing some filters.
      </p>
      <button @click="clearAllFilters" class="btn btn-primary btn-md">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Mentor } from '~/data/mockMentors'

definePageMeta({
  middleware: []
})

const mentorsStore = useMentorsStore()
const router = useRouter()

// Search and filters
const searchQuery = ref('')
const showFilters = ref(false)
const sortBy = ref('rating')
const isLoading = ref(false)

const filters = reactive({
  availability: [] as string[],
  experienceLevel: [] as string[],
  expertise: [] as string[],
  minRating: 0
})

// Filter options
const availabilityOptions = [
  { value: 'available', label: 'Available' },
  { value: 'limited', label: 'Limited availability' },
  { value: 'unavailable', label: 'Currently unavailable' }
]

const experienceLevelOptions = [
  { value: 'junior', label: 'Junior (< 5 years)' },
  { value: 'mid', label: 'Mid-level (5-10 years)' },
  { value: 'senior', label: 'Senior (10+ years)' }
]

const popularExpertise = [
  'JavaScript', 'Python', 'React', 'Vue.js', 'Node.js', 'TypeScript',
  'Machine Learning', 'Data Science', 'DevOps', 'Cloud Computing',
  'Mobile Development', 'UI/UX Design', 'System Design', 'Leadership',
  'Product Management', 'Backend', 'Frontend', 'Full Stack'
]

// Computed properties
const activeFiltersCount = computed(() => {
  return filters.availability.length + 
         filters.experienceLevel.length + 
         filters.expertise.length + 
         (filters.minRating > 0 ? 1 : 0)
})

// Methods
const availabilityLabel = (availability: string) => {
  const labels: Record<string, string> = {
    available: 'Available',
    limited: 'Limited',
    unavailable: 'Unavailable'
  }
  return labels[availability] || availability
}

const clearAllFilters = () => {
  filters.availability = []
  filters.experienceLevel = []
  filters.expertise = []
  filters.minRating = 0
  searchQuery.value = ''
}

const navigateToMentor = (mentorId: string) => {
  router.push(`/users/${mentorId}`)
}

const handleSort = () => {
  mentorsStore.sortMentors(sortBy.value as any)
}

// Watchers for filters
watch([searchQuery, filters], () => {
  mentorsStore.updateFilters({
    search: searchQuery.value,
    expertise: filters.expertise,
    experienceLevel: filters.experienceLevel,
    availability: filters.availability,
    minRating: filters.minRating
  })
}, { deep: true })

// Load mentors on mount
onMounted(async () => {
  isLoading.value = true
  await mentorsStore.fetchMentors()
  mentorsStore.sortMentors('rating')
  isLoading.value = false
})

// SEO
useHead({
  title: 'Explore Mentors - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Connect with experienced mentors who can guide you and your projects to success. Find the perfect mentor for your learning journey.'
    }
  ]
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
