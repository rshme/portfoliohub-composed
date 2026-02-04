<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Explore Projects</h1>
      <p class="text-gray-600">
        Discover meaningful projects where you can contribute and build your portfolio.
      </p>
    </div>

    <!-- Recommended Projects Section - Only show for authenticated volunteers/mentors with skills -->
    <div v-if="shouldShowRecommendations" class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Recommended For You</h2>
            <p class="text-sm text-gray-600">Projects matching your skills and interests</p>
          </div>
        </div>
        <button
          v-if="projectsStore.recommendations.length > 0"
          @click="refreshRecommendations"
          :disabled="projectsStore.isLoadingRecommendations"
          class="btn btn-secondary btn-sm"
        >
          <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': projectsStore.isLoadingRecommendations }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Recommendations Loading -->
      <div v-if="projectsStore.isLoadingRecommendations" class="text-center py-12">
        <LoaderIcon size="32" class="animate-spin mx-auto text-purple-600 mb-4" />
        <p class="text-gray-600">Loading recommendations...</p>
      </div>

      <!-- Recommendations Grid -->
      <div v-else-if="projectsStore.recommendations.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <div
          v-for="rec in projectsStore.recommendations"
          :key="rec.projectId"
          class="card hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
          @click="openProjectModal(rec.project)"
        >
          <!-- Gradient Border Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          <div class="absolute inset-[2px] bg-white rounded-lg z-0"></div>
          
          <!-- Content -->
          <div class="relative z-10 p-5">
            <!-- Match Score Badge -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="relative">
                  <svg class="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#E5E7EB" stroke-width="4" fill="none" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      :stroke="getSimilarityColor(rec.similarityPercentage)"
                      stroke-width="4" 
                      fill="none"
                      stroke-linecap="round"
                      :stroke-dasharray="`${(rec.similarityPercentage / 100) * 175.93} 175.93`"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-sm font-bold" :style="{ color: getSimilarityColor(rec.similarityPercentage) }">
                      {{ rec.similarityPercentage }}%
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-medium">Match Score</p>
                  <p class="text-xs text-gray-600">
                    {{ rec.matchingSkillsCount }}/{{ rec.totalProjectSkills }} skills
                  </p>
                </div>
              </div>
              
              <span v-if="rec.project.isVerified" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                <CheckCircleIcon size="12" class="mr-1" />
                Verified
              </span>
            </div>

            <!-- Project Title -->
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {{ rec.project.name }}
            </h3>

            <!-- Project Description -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ rec.project.description }}
            </p>

            <!-- Matching Skills -->
            <div class="mb-4">
              <p class="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Your Matching Skills
              </p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in rec.matchingSkills.slice(0, 3)"
                  :key="skill"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-300"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="rec.matchingSkills.length > 3"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                >
                  +{{ rec.matchingSkills.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Project Stats -->
            <div class="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-gray-100">
              <div class="text-center">
                <p class="text-xs text-gray-500">Volunteers</p>
                <p class="text-sm font-bold text-gray-900">{{ rec.project.volunteerCount }}/{{ rec.project.volunteersNeeded }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500">Level</p>
                <p class="text-sm font-bold text-gray-900 capitalize">{{ rec.project.level }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500">Status</p>
                <span 
                  class="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-800': rec.project.status === 'active',
                    'bg-yellow-100 text-yellow-800': rec.project.status === 'in_progress',
                    'bg-gray-100 text-gray-800': rec.project.status === 'completed'
                  }"
                >
                  {{ statusLabel(rec.project.status || 'active') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Recommendations -->
      <div v-else class="card p-8 text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
        <p class="text-gray-600 text-sm">
          {{ authStore.isAuthenticated 
            ? 'Complete your profile with skills to get personalized project recommendations.'
            : 'Sign in and add your skills to get personalized recommendations.'
          }}
        </p>
      </div>
    </div>

    <!-- Divider -->
    <div v-if="shouldShowRecommendations && projectsStore.recommendations.length > 0" class="relative mb-12">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="px-4 bg-white text-sm font-medium text-gray-500">All Projects</span>
      </div>
    </div>

    <!-- All Projects Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Browse All Projects</h2>
        <p class="text-sm text-gray-600">{{ pagination.total }} projects available</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card p-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <SearchIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              class="input pl-10"
              placeholder="Search projects by name, description, or technologies..."
            />
          </div>
        </div>

        <!-- Sort Dropdown -->
        <div class="w-full lg:w-48">
          <select v-model="sortBy" class="input w-full">
            <option value="createdAt-DESC">Newest First</option>
            <option value="createdAt-ASC">Oldest First</option>
            <option value="volunteerCount-DESC">Most Popular</option>
            <option value="volunteerCount-ASC">Least Popular</option>
          </select>
        </div>

        <!-- Filter Button -->
        <button
          @click="showFilters = !showFilters"
          class="btn btn-secondary btn-md whitespace-nowrap"
        >
          <FilterIcon size="20" class="mr-2" />
          Filters
          <span v-if="activeFiltersCount > 0" class="ml-2 badge badge-primary">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <!-- Active Filters Pills -->
      <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2 mt-4">
        <button
          v-if="filters.status"
          @click="filters.status = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 hover:bg-primary-200"
        >
          {{ statusLabel(filters.status) }}
          <XIcon size="14" class="ml-1" />
        </button>
        <button
          v-if="filters.level"
          @click="filters.level = ''"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 hover:bg-primary-200"
        >
          {{ levelLabel(filters.level) }}
          <XIcon size="14" class="ml-1" />
        </button>
        <button
          v-if="filters.isVerified !== null"
          @click="filters.isVerified = null"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 hover:bg-primary-200"
        >
          Verified Only
          <XIcon size="14" class="ml-1" />
        </button>
        <button
          @click="clearAllFilters"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Clear All
        </button>
      </div>

      <!-- Expanded Filters -->
      <div v-if="showFilters" class="mt-6 pt-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Project Status
            </label>
            <div class="space-y-2">
              <label
                v-for="status in statusOptions"
                :key="status.value"
                class="flex items-center cursor-pointer group"
              >
                <input
                  v-model="filters.status"
                  type="radio"
                  :value="status.value"
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  {{ status.label }}
                </span>
              </label>
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.status"
                  type="radio"
                  value=""
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  All Statuses
                </span>
              </label>
            </div>
          </div>

          <!-- Level Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div class="space-y-2">
              <label
                v-for="level in levelOptions"
                :key="level.value"
                class="flex items-center cursor-pointer group"
              >
                <input
                  v-model="filters.level"
                  type="radio"
                  :value="level.value"
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  {{ level.label }}
                </span>
              </label>
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.level"
                  type="radio"
                  value=""
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  All Levels
                </span>
              </label>
            </div>
          </div>

          <!-- Verification Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Verification Status
            </label>
            <div class="space-y-2">
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.isVerified"
                  type="radio"
                  :value="true"
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  Verified Only
                </span>
              </label>
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.isVerified"
                  type="radio"
                  :value="false"
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  Unverified Only
                </span>
              </label>
              <label class="flex items-center cursor-pointer group">
                <input
                  v-model="filters.isVerified"
                  type="radio"
                  :value="null"
                  class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  All Projects
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <p class="text-lg font-medium text-gray-900">
          {{ projectsStore.projects.length }} Project{{ projectsStore.projects.length !== 1 ? 's' : '' }}
        </p>
        <p class="text-sm text-gray-600">
          Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }}-{{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
          of {{ pagination.total }} total projects
        </p>
      </div>

      <!-- Results per page -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Show:</span>
        <select v-model="pagination.limit" class="input w-20">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <LoaderIcon size="32" class="animate-spin mx-auto text-primary-600 mb-4" />
      <p class="text-gray-600">Loading projects...</p>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="project in projectsStore.projects"
        :key="project.id"
        class="card hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
        @click="openProjectModal(project)"
      >
        <!-- Project Banner/Image -->
        <div class="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-t-lg overflow-hidden">
          <img 
            v-if="project.bannerUrl" 
            :src="project.bannerUrl" 
            :alt="project.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-6xl text-white/30">📁</span>
          </div>
          
          <!-- Badges Overlay -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-2">
            <span 
              v-if="project.isVerified"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg"
            >
              <CheckCircleIcon size="14" class="mr-1" />
              Verified
            </span>
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg"
              :class="{
                'bg-green-500 text-white': project.status === 'active',
                'bg-yellow-500 text-white': project.status === 'in_progress',
                'bg-gray-500 text-white': project.status === 'completed'
              }"
            >
              {{ statusLabel(project.status || 'active') }}
            </span>
          </div>

          <!-- Bookmark Button -->
          <button
            v-if="authStore.isVolunteer || authStore.isMentor"
            @click.stop="toggleBookmark(project.id)"
            class="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
            :class="authStore.isBookmarked(project.id) ? 'text-yellow-500' : 'text-gray-400'"
          >
            <BookmarkIcon
              size="18"
              :fill="authStore.isBookmarked(project.id) ? 'currentColor' : 'none'"
            />
          </button>
        </div>

        <!-- Project Content -->
        <div class="p-5 flex-1 flex flex-col">
          <!-- Project Title -->
          <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {{ project.name }}
          </h3>

          <!-- Project Description -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {{ project.description }}
          </p>

          <!-- Creator Info -->
          <div class="flex items-center mb-4 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span class="text-white font-medium text-sm">
                {{ project.creator?.fullName?.charAt(0) || project.creator?.username?.charAt(0) || '?' }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-gray-900 text-sm truncate">{{ project.creator?.fullName || project.creator?.username || 'Unknown' }}</p>
              <p class="text-xs text-gray-500 truncate">@{{ project.creator?.username || 'unknown' }}</p>
            </div>
          </div>

          <!-- Project Stats Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- Volunteers -->
            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                <UsersIcon size="16" class="text-blue-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Volunteers</p>
                <p class="font-semibold text-gray-900">{{ project.volunteerCount || 0 }}/{{ project.volunteersNeeded || 0 }}</p>
              </div>
            </div>

            <!-- Level -->
            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                <TrendingUpIcon size="16" class="text-purple-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Level</p>
                <p class="font-semibold text-gray-900 capitalize">{{ project.level || 'N/A' }}</p>
              </div>
            </div>

            <!-- Mentors -->
            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-2">
                <AwardIcon size="16" class="text-green-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Mentors</p>
                <p class="font-semibold text-gray-900">{{ project.mentors?.length || 0 }}</p>
              </div>
            </div>

            <!-- Duration -->
            <div class="flex items-center text-sm">
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mr-2">
                <CalendarIcon size="16" class="text-orange-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Duration</p>
                <p class="font-semibold text-gray-900 text-xs">{{ formatDuration(project.startDate, project.endDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="project.categories && project.categories.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="category in project.categories.slice(0, 2)"
                :key="category.id"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                <span class="mr-1">{{ category.icon }}</span>
                {{ category.name }}
              </span>
              <span
                v-if="project.categories.length > 2"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
              >
                +{{ project.categories.length - 2 }}
              </span>
            </div>
          </div>

          <!-- Skills/Technologies -->
          <div v-if="project.skills && project.skills.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in project.skills.slice(0, 4)"
                :key="skill.id"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                :class="skill.isMandatory ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-700'"
              >
                <span v-if="skill.icon" class="mr-1">{{ skill.icon }}</span>
                {{ skill.name }}
                <span v-if="skill.isMandatory" class="ml-1 text-red-500">*</span>
              </span>
              <span
                v-if="project.skills.length > 4"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
              >
                +{{ project.skills.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && projectsStore.projects.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <SearchIcon size="40" class="text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any projects matching your criteria. Try adjusting your filters or search terms.
      </p>
      <button @click="clearAllFilters" class="btn btn-primary btn-md">
        <XIcon size="18" class="mr-2" />
        Clear All Filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && projectsStore.projects.length > 0 && pagination.totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
      <!-- Previous Button -->
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="btn btn-secondary btn-md"
        :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
      >
        <ChevronLeftIcon size="18" />
        Previous
      </button>

      <!-- Page Numbers -->
      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="w-10 h-10 rounded-lg font-medium transition-colors"
          :class="page === pagination.page 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="btn btn-secondary btn-md"
        :class="{ 'opacity-50 cursor-not-allowed': pagination.page === pagination.totalPages }"
      >
        Next
        <ChevronRightIcon size="18" />
      </button>
    </div>
  </div>

  <!-- Project Detail Modal -->
  <ProjectDetailModal
    v-if="selectedProject"
    :project="selectedProject"
    @close="selectedProject = null"
    @join="handleJoinProject"
  />
</template>

<script setup lang="ts">
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  X as XIcon,
  Loader2 as LoaderIcon,
  CheckCircle as CheckCircleIcon,
  Plus as PlusIcon,
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Bookmark as BookmarkIcon
} from 'lucide-vue-next'

definePageMeta({
  middleware: []
})

const projectsStore = useProjectsStore()
const authStore = useAuthStore()

// Search and filters
const searchQuery = ref('')
const showFilters = ref(false)
const sortBy = ref('createdAt-DESC')
const isLoading = ref(false)
const selectedProject = ref(null)

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  status: '',
  level: '',
  isVerified: true as boolean | null
})

// Filter options
const statusOptions = [
  { value: 'active', label: 'Active - Open for volunteers' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' }
]

const levelOptions = [
  { value: 'beginner', label: 'Beginner Friendly' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

// Computed properties
const shouldShowRecommendations = computed(() => {
  return authStore.isAuthenticated && (authStore.isVolunteer || authStore.isMentor)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.status) count++
  if (filters.level) count++
  if (filters.isVerified !== null) count++
  return count
})

const visiblePages = computed(() => {
  const pages = []
  const totalPages = pagination.totalPages
  const currentPage = pagination.page
  
  // Always show first page
  pages.push(1)
  
  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }
  
  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages)
  }
  
  return pages
})

// Methods
const getSimilarityColor = (percentage: number) => {
  if (percentage >= 80) return '#10b981' // green-500
  if (percentage >= 60) return '#3b82f6' // blue-500
  if (percentage >= 40) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
}
const progress = (project: any) => {
  if (!project.volunteersNeeded || project.volunteersNeeded === 0) return 0
  return Math.round((project.volunteerCount / project.volunteersNeeded) * 100)
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Active',
    in_progress: 'In Progress',
    completed: 'Completed',
    paused: 'Paused'
  }
  return labels[status] || status
}

const levelLabel = (level: string) => {
  const labels: Record<string, string> = {
    beginner: 'Beginner Friendly',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
  return labels[level] || level
}

const formatDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 'N/A'
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) return `${diffDays}d`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`
  return `${Math.floor(diffDays / 365)}y`
}

const clearAllFilters = () => {
  filters.status = ''
  filters.level = ''
  filters.isVerified = null
  searchQuery.value = ''
}

const openProjectModal = (project: any) => {
  selectedProject.value = project
}

const joinProject = async (project: any) => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }
  
  // TODO: Implement join project API call
  console.log('Joining project:', project.id)
}

const handleJoinProject = async (projectId: string) => {
  console.log('Joining project from modal:', projectId)
  selectedProject.value = null
}

const toggleBookmark = (projectId: string) => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }
  
  authStore.toggleBookmark(projectId)
}

const goToPage = async (page: number) => {
  if (page < 1 || page > pagination.totalPages || page === pagination.page) return
  
  pagination.page = page
  await fetchProjects()
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const refreshRecommendations = async () => {
  await fetchRecommendations()
}

const fetchRecommendations = async () => {
  if (!authStore.isAuthenticated || (!authStore.isVolunteer && !authStore.isMentor)) {
    return
  }
  
  try {
    await projectsStore.fetchRecommendations({
      limit: 6,
      minSimilarity: 1 // 10% minimum similarity
    })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
  }
}

const fetchProjects = async () => {
  isLoading.value = true
  
  try {
    // Parse sort
    const [sortByField, sortOrder] = sortBy.value.split('-')
    
    // Build query params
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sortByField,
      sortOrder: sortOrder as 'ASC' | 'DESC'
    }
    
    if (searchQuery.value) params.keyword = searchQuery.value
    if (filters.status) params.status = filters.status
    if (filters.level) params.level = filters.level
    if (filters.isVerified !== null) params.isVerified = filters.isVerified
    
    await projectsStore.fetchProjects(params)
    
    // Update pagination from store
    if (projectsStore.pagination) {
      pagination.total = projectsStore.pagination.total || 0
      pagination.totalPages = projectsStore.pagination.totalPages || 0
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    isLoading.value = false
  }
}

// Watchers for filters and search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(() => {
    pagination.page = 1
    fetchProjects()
    // Refresh recommendations when search changes
    if (shouldShowRecommendations.value) {
      fetchRecommendations()
    }
  }, 500)
})

watch(() => [filters.status, filters.level, filters.isVerified], () => {
  pagination.page = 1
  fetchProjects()
  // Refresh recommendations when filters change
  if (shouldShowRecommendations.value) {
    fetchRecommendations()
  }
}, { deep: true })

watch(sortBy, () => {
  pagination.page = 1
  fetchProjects()
  // Refresh recommendations when sort changes
  if (shouldShowRecommendations.value) {
    fetchRecommendations()
  }
})

watch(() => pagination.limit, () => {
  pagination.page = 1
  fetchProjects()
  // Refresh recommendations when limit changes
  if (shouldShowRecommendations.value) {
    fetchRecommendations()
  }
})

// Watch for authentication changes to fetch recommendations
watch(() => shouldShowRecommendations.value, (newValue, oldValue) => {
  // Fetch recommendations when user becomes authenticated or role changes
  if (newValue && !oldValue) {
    fetchRecommendations()
  }
}, { immediate: false })

// Load projects on mount
onMounted(async () => {
  // Fetch recommendations first if user is authenticated
  if (shouldShowRecommendations.value) {
    await fetchRecommendations()
  }
  
  // Then fetch all projects
  await fetchProjects()
})

// SEO
useHead({
  title: 'Explore Projects - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Discover meaningful projects where you can contribute, learn, and build your portfolio with real-world experience.'
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