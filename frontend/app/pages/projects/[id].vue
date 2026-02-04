<template>
  <div v-if="project" class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
    <!-- Project Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex items-center mb-3 sm:mb-4">
        <button @click="$router.back()" class="btn btn-ghost btn-sm sm:btn-md mr-2 sm:mr-4">
          <ArrowLeftIcon size="18" class="sm:mr-2" />
          <span class="hidden sm:inline">Back</span>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div class="flex items-start space-x-3 sm:space-x-4">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <span class="text-gray-600 font-medium text-base sm:text-lg">
              {{ project.creator.name.charAt(0) }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">{{ project.name }}</h1>
              <svg 
                v-if="project.isVerified" 
                class="w-7 h-7 text-blue-500 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
              <span class="truncate">by {{ project.creator.organization || project.creator.name }}</span>
              <span class="hidden sm:inline">•</span>
              <span class="flex items-center">
                <UsersIcon size="14" class="sm:size-4 mr-1" />
                <span class="truncate">{{ project.volunteerCount || project.volunteers_joined }}/{{ project.volunteersNeeded || project.volunteers_needed }} volunteers</span>
              </span>
              <span class="hidden sm:inline">•</span>
              <span class="flex items-center">
                <CalendarIcon size="14" class="sm:size-4 mr-1" />
                <span class="hidden sm:inline">{{ formatProjectDate(project.startDate || project.created_at) }}</span>
                <span class="sm:hidden">{{ new Date(project.startDate || project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Leave Project Button for Mentors/Volunteers -->
        <div v-if="canLeaveProject" class="flex items-center space-x-2">
          <button
            @click="handleLeaveProject"
            class="btn btn-error btn-sm sm:btn-md shadow-lg hover:shadow-xl transition-all"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Leave Project</span>
            <span class="sm:hidden">Leave</span>
          </button>
        </div>
      </div>

      <!-- Status & Progress Bar -->
      <div class="mt-4 sm:mt-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center flex-wrap gap-2 sm:gap-4">
            <span 
              class="badge badge-lg"
              :class="{
                'badge-success': project.status === 'open',
                'badge-warning': project.status === 'in_progress',
                'badge-secondary': project.status === 'completed'
              }"
            >
              {{ statusLabel(project.status) }}
            </span>
            <span 
              class="badge badge-lg"
              :class="{
                'badge-success': (project.difficulty === 'Beginner' || project.level === 'beginner'),
                'badge-warning': (project.difficulty === 'Intermediate' || project.level === 'intermediate'),
                'badge-danger': (project.difficulty === 'Advanced' || project.level === 'advanced')
              }"
            >
              {{ project.difficulty || (project.level && project.level.charAt(0).toUpperCase() + project.level.slice(1)) }}
            </span>
          </div>
          <span class="text-xs sm:text-sm text-gray-600 font-medium">{{ progress }}% complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-300"
            :class="{
              'bg-green-500': progress >= 80,
              'bg-yellow-500': progress >= 50 && progress < 80,
              'bg-red-500': progress < 50
            }"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="mb-6 sm:mb-8 -mx-3 sm:mx-0">
      <div class="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <nav class="flex space-x-4 sm:space-x-8 px-3 sm:px-0 min-w-max sm:min-w-0" aria-label="Tabs">
          <button
            @click="activeTab = 'overview'"
            :class="[
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="inline">Overview</span>
            </div>
          </button>
          
          <button
            @click="isProjectMember ? activeTab = 'milestones' : showMembershipRequiredAlert()"
            :class="[
              activeTab === 'milestones'
                ? 'border-primary-500 text-primary-600'
                : !isProjectMember
                ? 'border-transparent text-gray-400 cursor-not-allowed'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
            :disabled="!isProjectMember"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Milestones</span>
              <svg v-if="!isProjectMember" class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span v-if="isProjectMember && project.milestones.length" class="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {{ project.milestones.length }}
              </span>
            </div>
          </button>
          
          <button
            @click="isProjectMember ? activeTab = 'tasks' : showMembershipRequiredAlert()"
            :class="[
              activeTab === 'tasks'
                ? 'border-primary-500 text-primary-600'
                : !isProjectMember
                ? 'border-transparent text-gray-400 cursor-not-allowed'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors'
            ]"
            :disabled="!isProjectMember"
          >
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span class="hidden xs:inline">Tasks</span>
              <span class="xs:hidden">Task</span>
              <svg v-if="!isProjectMember" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span v-if="isProjectMember && project.tasks.length" class="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {{ project.tasks.length }}
              </span>
            </div>
          </button>
          
          <button
            @click="activeTab = 'members'"
            :class="[
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors'
            ]"
          >
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="hidden xs:inline">Members</span>
              <span class="xs:hidden">Team</span>
              <span v-if="project.volunteers.length || project.mentors.length" class="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {{ project.volunteers.length + project.mentors.length }}
              </span>
            </div>
          </button>
          
          <button
            @click="activeTab = 'stats'"
            :class="[
              activeTab === 'stats'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors'
            ]"
          >
            <div class="flex items-center space-x-1.5 sm:space-x-2">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Stats</span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Overview Tab -->
      <div v-show="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <!-- Image Gallery Slider -->
          <div v-if="projectImages.length > 0" class="card p-0 overflow-hidden">
            <!-- Main Swiper -->
            <div class="relative">
              <swiper
                :modules="swiperModules"
                :slides-per-view="1"
                :space-between="0"
                :pagination="{ clickable: true, dynamicBullets: true }"
                :navigation="{
                  nextEl: '.swiper-button-next-gallery',
                  prevEl: '.swiper-button-prev-gallery',
                }"
                :thumbs="{ swiper: thumbsSwiper }"
                class="overflow-hidden"
                @swiper="setMainSwiper"
              >
                <swiper-slide
                  v-for="image in projectImages"
                  :key="image.id"
                  class="relative"
                >
                  <div class="aspect-video bg-gray-100 relative group">
                    <img
                      :src="image.url"
                      :alt="image.caption"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <p class="text-white text-sm sm:text-base font-medium mb-1">{{ image.caption }}</p>
                        <span class="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
                          {{ image.type }}
                        </span>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>

              <!-- Custom Navigation Buttons -->
              <button
                class="swiper-button-prev-gallery hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous image"
              >
                <ChevronLeftIcon size="20" class="sm:size-6 text-gray-800" />
              </button>
              <button
                class="swiper-button-next-gallery hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next image"
              >
                <ChevronRightIcon size="20" class="sm:size-6 text-gray-800" />
              </button>
            </div>

            <!-- Thumbnail Swiper -->
            <div v-if="projectImages.length > 1" class="p-3 sm:p-4 bg-gray-50">
              <swiper
                :modules="swiperModules"
                :slides-per-view="2"
                :space-between="8"
                :watch-slides-progress="true"
                :breakpoints="{
                  640: { slidesPerView: 3, spaceBetween: 10 },
                  768: { slidesPerView: 4, spaceBetween: 12 },
                  1024: { slidesPerView: 5, spaceBetween: 12 },
                }"
                class="thumbnails-swiper"
                @swiper="setThumbsSwiper"
              >
                <swiper-slide
                  v-for="image in projectImages"
                  :key="'thumb-' + image.id"
                  class="cursor-pointer"
                >
                  <div
                    class="aspect-video rounded-md sm:rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all"
                  >
                    <img
                      :src="image.url"
                      :alt="image.caption"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>

          <!-- Project Description -->
          <div class="card p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">About This Project</h2>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">{{ project.description }}</p>
          </div>

          <!-- Skills & Technologies -->
          <div class="card p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Skills & Technologies</h2>
            <div class="space-y-3 sm:space-y-4">
              <!-- Skills from API with mandatory/optional indicator -->
              <div v-if="project.skills && project.skills.length > 0">
                <h3 class="font-semibold text-gray-900 mb-2">Skills</h3>
                <div class="space-y-2">
                  <div v-if="mandatorySkills.length > 0">
                    <p class="text-sm text-gray-600 mb-2">Required *</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="skill in mandatorySkills"
                        :key="skill.id"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 border border-red-200"
                      >
                        <span class="mr-1">{{ skill.icon }}</span>
                        {{ skill.name }}
                        <span class="ml-1 text-red-500">*</span>
                      </span>
                    </div>
                  </div>
                  <div v-if="optionalSkills.length > 0">
                    <p class="text-sm text-gray-600 mb-2 mt-3">Optional</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="skill in optionalSkills"
                        :key="skill.id"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        <span class="mr-1">{{ skill.icon }}</span>
                        {{ skill.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Fallback to skills_required if skills not available -->
              <div v-else-if="project.skills_required && project.skills_required.length > 0">
                <h3 class="font-semibold text-gray-900 mb-2">Required Skills</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in project.skills_required"
                    :key="skill"
                    class="badge badge-primary"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <!-- Categories from API -->
              <div v-if="project.categories && project.categories.length > 0">
                <h3 class="font-semibold text-gray-900 mb-2">Categories</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="category in project.categories"
                    :key="category.id"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-200"
                  >
                    <span class="mr-1">{{ category.icon }}</span>
                    {{ category.name }}
                  </span>
                </div>
              </div>
              
              <!-- Fallback to tags -->
              <div v-else-if="project.tags && project.tags.length > 0">
                <h3 class="font-semibold text-gray-900 mb-2">Technologies</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="badge badge-secondary"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-4 sm:space-y-6">
          <!-- Project Creator -->
          <div class="card p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Project Creator</h3>
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-gray-600 font-medium text-lg">
                  {{ project.creator.organization?.charAt(0) || project.creator.name.charAt(0) }}
                </span>
              </div>
              <h4 class="font-medium text-gray-900">{{ project.creator.organization || project.creator.name }}</h4>
              <p class="text-sm text-gray-600">{{ project.creator.name }}</p>
            </div>
          </div>

          <!-- External Links -->
          <div v-if="project.links?.github || project.github_url || project.links?.gitlab || project.links?.bitbucket || project.links?.website || project.links?.figma || project.links?.discord || project.discord_url || project.links?.slack" class="card p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Project Resources</h3>
            <div class="space-y-3">
              <!-- GitHub -->
              <a
                v-if="project.links?.github || project.github_url"
                :href="project.links?.github || project.github_url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#24292e] text-white rounded-lg hover:bg-[#1a1e22] transition-colors shadow-sm hover:shadow-md"
              >
                <GithubIcon size="20" class="mr-2" />
                GitHub
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- GitLab -->
              <a
                v-if="project.links?.gitlab"
                :href="project.links.gitlab"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#FC6D26] text-white rounded-lg hover:bg-[#E24329] transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.452 10.93c-.6.605-.6 1.584 0 2.189l10.427 10.426c.603.602 1.582.602 2.188 0l10.48-10.426c.6-.605.6-1.584 0-2.189M12.003 6.545l3.03 9.332H8.972l3.031-9.332z"/>
                </svg>
                GitLab
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- Bitbucket -->
              <a
                v-if="project.links?.bitbucket"
                :href="project.links.bitbucket"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#0052CC] text-white rounded-lg hover:bg-[#0747A6] transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"/>
                </svg>
                Bitbucket
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- Website -->
              <a
                v-if="project.links?.website"
                :href="project.links.website"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                Website
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- Figma -->
              <a
                v-if="project.links?.figma"
                :href="project.links.figma"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#F24E1E] text-white rounded-lg hover:bg-[#E13B0F] transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/>
                  <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" opacity=".7"/>
                  <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" opacity=".5"/>
                  <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" opacity=".3"/>
                  <circle cx="16" cy="12" r="4" opacity=".1"/>
                </svg>
                Figma
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- Discord -->
              <a
                v-if="project.links?.discord || project.discord_url"
                :href="project.links?.discord || project.discord_url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors shadow-sm hover:shadow-md"
              >
                <MessageSquareIcon size="20" class="mr-2" />
                Discord
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>

              <!-- Slack -->
              <a
                v-if="project.links?.slack"
                :href="project.links.slack"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center px-4 py-3 bg-[#4A154B] text-white rounded-lg hover:bg-[#611f69] transition-colors shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 15a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2zm1 0a2 2 0 012-2 2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5z"/>
                  <path d="M9 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H9zm0 1a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2 2 2 0 012-2h5z" opacity=".7"/>
                  <path d="M18 9a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-2V9zm-1 0a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2 2 2 0 012 2v5z" opacity=".5"/>
                  <path d="M15 18a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2v-2h2zm0-1a2 2 0 01-2-2 2 2 0 012-2h5a2 2 0 012 2 2 2 0 01-2 2h-5z" opacity=".3"/>
                </svg>
                Slack
                <ExternalLinkIcon size="14" class="ml-auto" />
              </a>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card p-6 bg-gradient-to-br from-primary-50 to-purple-50">
            <h3 class="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <UsersIcon size="20" class="text-primary-600" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Team Size</p>
                    <p class="font-bold text-gray-900">{{ project.volunteers.length }}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Milestones</p>
                    <p class="font-bold text-gray-900">{{ project.milestones.length }}</p>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Mentors</p>
                    <p class="font-bold text-gray-900">{{ project.mentors.length }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Milestones Tab -->
      <div v-show="activeTab === 'milestones'">
        <div v-if="project.milestones && project.milestones.length > 0" class="space-y-6">
          <!-- Milestones Timeline -->
          <div class="card p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Project Milestones</h2>
                <div class="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <span class="font-medium">
                    {{ project.milestones.filter(m => m.status === 'completed').length }}/{{ project.milestones.length }}
                  </span>
                  <span>completed</span>
                </div>
              </div>
              <button
                v-if="canManageMilestones && project.status !== 'completed' && project.status !== 'cancelled'"
                @click="openCreateMilestoneModal"
                class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
              >
                <PlusIcon size="20" class="mr-2" />
                Add Milestone
              </button>
            </div>

            <div class="space-y-4 sm:space-y-6">
              <div
                v-for="(milestone, index) in project.milestones"
                :key="milestone.id"
                class="relative"
              >
                <!-- Timeline connector -->
                <div
                  v-if="index < project.milestones.length - 1"
                  class="absolute left-6 top-16 w-0.5 h-full -ml-px hidden sm:block"
                  :class="{
                    'bg-green-500': milestone.status === 'completed',
                    'bg-blue-500': milestone.status === 'in_progress',
                    'bg-gray-300': milestone.status === 'not_started',
                    'bg-red-500': milestone.status === 'cancelled'
                  }"
                ></div>

                <!-- Milestone Card -->
                <div
                  class="relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg"
                  :class="{
                    'bg-green-50 border-green-200 hover:border-green-300': milestone.status === 'completed',
                    'bg-blue-50 border-blue-200 hover:border-blue-300 ring-2 sm:ring-4 ring-blue-100': milestone.status === 'in_progress',
                    'bg-white border-gray-200 hover:border-gray-300': milestone.status === 'not_started',
                    'bg-red-50 border-red-200 hover:border-red-300': milestone.status === 'cancelled'
                  }"
                >
                  <!-- Status Icon -->
                  <div class="flex-shrink-0 self-center">
                    <div
                      class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md relative z-10"
                      :class="{
                        'bg-gradient-to-br from-green-400 to-green-600': milestone.status === 'completed',
                        'bg-gradient-to-br from-blue-400 to-blue-600': milestone.status === 'in_progress',
                        'bg-gradient-to-br from-gray-300 to-gray-500': milestone.status === 'not_started',
                        'bg-gradient-to-br from-red-400 to-red-600': milestone.status === 'cancelled'
                      }"
                    >
                      <CheckIcon v-if="milestone.status === 'completed'" size="20" class="sm:size-6 text-white" />
                      <LoaderIcon v-else-if="milestone.status === 'in_progress'" size="20" class="sm:size-6 text-white animate-spin" />
                      <span v-else-if="milestone.status === 'cancelled'" class="text-white text-base sm:text-lg">✕</span>
                      <span v-else class="text-white font-bold text-base sm:text-lg">{{ index + 1 }}</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3 mb-3">
                      <div class="flex-1">
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-1">{{ milestone.name }}</h3>
                        <p class="text-sm sm:text-base text-gray-600">{{ milestone.description }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex-shrink-0"
                          :class="{
                            'bg-green-600 text-white': milestone.status === 'completed',
                            'bg-blue-600 text-white': milestone.status === 'in_progress',
                            'bg-gray-400 text-white': milestone.status === 'not_started',
                            'bg-red-600 text-white': milestone.status === 'cancelled'
                          }"
                        >
                          {{ milestone.status.replace('_', ' ') }}
                        </span>
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mb-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
                        <span class="text-xs sm:text-sm font-bold"
                          :class="{
                            'text-green-600': milestone.completionPercentage === 100,
                            'text-blue-600': milestone.completionPercentage > 0 && milestone.completionPercentage < 100,
                            'text-gray-500': milestone.completionPercentage === 0
                          }"
                        >
                          {{ milestone.completionPercentage || 0 }}%
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                        <div
                          class="h-2 sm:h-2.5 rounded-full transition-all duration-500"
                          :class="{
                            'bg-gradient-to-r from-green-400 to-green-600': milestone.completionPercentage === 100,
                            'bg-gradient-to-r from-blue-400 to-blue-600': milestone.completionPercentage > 0 && milestone.completionPercentage < 100,
                            'bg-gray-400': milestone.completionPercentage === 0
                          }"
                          :style="{ width: `${milestone.completionPercentage || 0}%` }"
                        ></div>
                      </div>
                    </div>

                    <!-- Meta Info -->
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div class="flex items-center space-x-1">
                        <CalendarIcon size="14" class="sm:size-4" />
                        <span>{{ formatDate(milestone.startDate) }} - {{ formatDate(milestone.endDate) }}</span>
                      </div>
                      <div v-if="milestone.taskCount" class="flex items-center space-x-1">
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <span>{{ milestone.completedTaskCount || 0 }}/{{ milestone.taskCount }} tasks</span>
                      </div>
                    </div>

                    <!-- Tags and Actions -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div v-if="milestone.tags && milestone.tags.length > 0" class="flex flex-wrap gap-1.5 sm:gap-2">
                        <span
                          v-for="tag in milestone.tags"
                          :key="tag"
                          class="px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-700': milestone.status === 'completed',
                            'bg-blue-100 text-blue-700': milestone.status === 'in_progress',
                            'bg-gray-100 text-gray-700': milestone.status === 'not_started',
                            'bg-red-100 text-red-700': milestone.status === 'cancelled'
                          }"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                      
                      <!-- Action Buttons -->
                      <div v-if="canManageMilestones" class="flex gap-2 w-full sm:w-auto">
                        <button
                          @click="openEditMilestoneModal(milestone)"
                          class="flex-1 sm:flex-initial btn btn-ghost btn-xs sm:btn-sm text-primary-600 hover:bg-primary-50"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          @click="handleDeleteMilestone(milestone.id)"
                          class="flex-1 sm:flex-initial btn btn-ghost btn-xs sm:btn-sm text-red-600 hover:bg-red-50"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="card p-8 sm:p-12 text-center">
          <div class="max-w-md mx-auto">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Milestones Yet</h3>
            <p class="text-sm sm:text-base text-gray-600 mb-6">Start organizing your project by creating milestones to track progress and goals.</p>
            <button
              v-if="canManageMilestones && project.status !== 'completed' && project.status !== 'cancelled'"
              @click="openCreateMilestoneModal"
              class="btn btn-primary btn-md w-full sm:w-auto"
            >
              <PlusIcon size="20" class="mr-2" />
              Create First Milestone
            </button>
            <div v-else class="text-sm text-gray-500 mt-4">
              Only project creators and mentors can create milestones.
            </div>
          </div>
        </div>
      </div>

      <!-- Milestone Modal -->
      <MilestoneModal
        :is-open="isMilestoneModalOpen"
        :milestone="editingMilestone"
        :project-id="project?.id || ''"
        @close="closeMilestoneModal"
        @submit="handleMilestoneSubmit"
      />

      <!-- Task Modal -->
      <TaskModal
        :is-open="isTaskModalOpen"
        :task="editingTask"
        :project-id="project?.id || ''"
        @close="closeTaskModal"
        @submit="handleTaskSubmit"
      />

      <!-- Tasks Tab -->
      <div v-show="activeTab === 'tasks'">
        <div class="space-y-6">
          <div class="card p-4 sm:p-6 lg:p-8">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <svg class="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Project Tasks
                </h2>
                <p class="text-sm text-gray-600 mt-1">Manage and track all project tasks</p>
              </div>
              <button
                v-if="canManageTasks && project.status !== 'completed' && project.status !== 'cancelled'"
                @click="openCreateTaskModal"
                class="btn btn-primary btn-md w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                <PlusIcon size="20" class="mr-2" />
                Add Task
              </button>
            </div>

            <!-- Enhanced Filters Section -->
            <div class="mb-6 bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-3 shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  Filter Tasks
                </h3>
                <button 
                  @click="toggleFiltersExpanded" 
                  class="lg:hidden px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium text-sm flex items-center transition-colors"
                >
                  {{ filtersExpanded ? 'Hide Filters' : 'Show Filters' }}
                  <svg 
                    class="w-4 h-4 ml-2 transition-transform duration-200" 
                    :class="{ 'rotate-180': filtersExpanded }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div :class="{ 'hidden lg:grid': !filtersExpanded }" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <!-- Status Filter -->
                <div class="space-y-2">
                  <label class="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Status
                  </label>
                  <div class="relative">
                    <select 
                      v-model="taskFilters.status" 
                      @change="applyTaskFilters"
                      class="w-full h-12 px-4 pr-10 text-sm font-medium bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="todo">📋 To Do</option>
                      <option value="in_progress">⚡ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Priority Filter -->
                <div class="space-y-2">
                  <label class="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                    Priority
                  </label>
                  <div class="relative">
                    <select 
                      v-model="taskFilters.priority" 
                      @change="applyTaskFilters"
                      class="w-full h-12 px-4 pr-10 text-sm font-medium bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">All Priorities</option>
                      <option value="high">🔴 High</option>
                      <option value="medium">🟠 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Assigned To Filter -->
                <div class="space-y-2">
                  <label class="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <div class="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center mr-2">
                      <UserIcon size="16" class="text-purple-600" />
                    </div>
                    Assigned To
                  </label>
                  <div class="relative">
                    <select 
                      v-model="taskFilters.assignedToId" 
                      @change="applyTaskFilters"
                      class="w-full h-12 px-4 pr-10 text-sm font-medium bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">All Members</option>
                      <option 
                        v-for="member in allProjectMembers" 
                        :key="member.id" 
                        :value="member.id"
                      >
                        {{ member.fullName }}
                      </option>
                    </select>
                    <svg class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Search Filter -->
                <div class="space-y-2">
                  <label class="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <div class="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center mr-2">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    Search
                  </label>
                  <div class="relative">
                    <input
                      v-model="taskFilters.keyword"
                      @input="debouncedApplyFilters"
                      type="text"
                      placeholder="Search tasks..."
                      class="w-full h-12 pl-11 pr-11 text-sm font-medium bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all placeholder:text-gray-400"
                    />
                    <svg 
                      class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button
                      v-if="taskFilters.keyword"
                      @click="taskFilters.keyword = ''; applyTaskFilters()"
                      class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Filter Actions -->
              <div :class="{ 'hidden lg:flex': !filtersExpanded }" class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t-2 border-gray-100">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm text-gray-600 font-semibold flex items-center">
                    <svg class="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Active Filters:
                  </span>
                  <div v-if="!hasActiveFilters" class="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                    No active filters
                  </div>
                  <span 
                    v-if="taskFilters.status" 
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Status: {{ taskFilters.status }}
                    <button @click="taskFilters.status = ''; applyTaskFilters()" class="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                  <span 
                    v-if="taskFilters.priority" 
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Priority: {{ taskFilters.priority }}
                    <button @click="taskFilters.priority = ''; applyTaskFilters()" class="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                  <span 
                    v-if="taskFilters.assignedToId" 
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Assigned
                    <button @click="taskFilters.assignedToId = ''; applyTaskFilters()" class="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                  <span 
                    v-if="taskFilters.keyword" 
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-shadow max-w-[200px]"
                  >
                    <span class="truncate">"{{ taskFilters.keyword }}"</span>
                    <button @click="taskFilters.keyword = ''; applyTaskFilters()" class="hover:bg-white/20 rounded-full p-0.5 transition-colors flex-shrink-0">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                <button 
                  v-if="hasActiveFilters"
                  @click="clearTaskFilters" 
                  class="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm flex items-center transition-colors shadow-sm hover:shadow group"
                >
                  <svg class="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            </div>
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm font-semibold text-gray-600 mb-1 flex items-center">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      To Do
                    </p>
                    <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                      {{ project.tasks.filter(t => t.status === 'todo').length }}
                    </p>
                  </div>
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-md">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm font-semibold text-blue-700 mb-1 flex items-center">
                      <LoaderIcon size="16" class="mr-1.5" />
                      In Progress
                    </p>
                    <p class="text-2xl sm:text-3xl font-bold text-blue-900">
                      {{ project.tasks.filter(t => t.status === 'in_progress').length }}
                    </p>
                  </div>
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                    <LoaderIcon size="28" class="text-blue-700" />
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm font-semibold text-green-700 mb-1 flex items-center">
                      <CheckIcon size="16" class="mr-1.5" />
                      Completed
                    </p>
                    <p class="text-2xl sm:text-3xl font-bold text-green-900">
                      {{ project.tasks.filter(t => t.status === 'completed').length }}
                    </p>
                  </div>
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-green-200 rounded-xl flex items-center justify-center shadow-sm">
                    <CheckIcon size="28" class="text-green-700" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Task List -->
            <div v-if="isLoadingTasks" class="flex flex-col items-center justify-center py-16">
              <LoaderIcon size="48" class="text-primary-600 animate-spin mb-4" />
              <p class="text-gray-600 font-medium">Loading tasks...</p>
            </div>
            <div v-else-if="project.tasks && project.tasks.length > 0" class="space-y-4">
              <div
                v-for="task in project.tasks"
                :key="task.id"
                class="border-2 rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group"
                :class="{
                  'border-gray-200 bg-white hover:border-gray-300': task.status === 'todo',
                  'border-blue-300 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400': task.status === 'in_progress',
                  'border-green-300 bg-gradient-to-br from-green-50 to-white hover:border-green-400': task.status === 'completed'
                }"
              >
                <!-- Task Header -->
                <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <h3 class="font-bold text-gray-900 text-lg sm:text-xl break-words">{{ task.title }}</h3>
                      <span
                        class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap shadow-sm"
                        :class="{
                          'bg-gray-200 text-gray-700': task.status === 'todo',
                          'bg-blue-600 text-white': task.status === 'in_progress',
                          'bg-green-600 text-white': task.status === 'completed'
                        }"
                      >
                        {{ task.status.replace('_', ' ') }}
                      </span>
                      <span v-if="task.milestone" class="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1.5 shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                        </svg>
                        {{ task.milestone.name }}
                      </span>
                    </div>

                    <p class="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">{{ task.description }}</p>

                    <!-- Task Meta Information -->
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span
                        class="inline-flex items-center px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm"
                        :class="{
                          'bg-red-100 text-red-700 border border-red-200': task.priority === 'high',
                          'bg-orange-100 text-orange-700 border border-orange-200': task.priority === 'medium',
                          'bg-emerald-100 text-emerald-700 border border-emerald-200': task.priority === 'low'
                        }"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                        </svg>
                        {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }} Priority
                      </span>

                      <span v-if="task.assignedTo" class="inline-flex items-center text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-sm border border-gray-200 shadow-sm">
                        <UserIcon size="16" class="mr-1.5 flex-shrink-0" />
                        {{ task.assignedTo.fullName }}
                      </span>

                      <span v-if="task.dueDate" class="inline-flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-lg font-medium text-sm border border-gray-200 shadow-sm">
                        <CalendarIcon size="16" class="mr-1.5 flex-shrink-0" />
                        Due {{ formatDate(task.dueDate) }}
                      </span>

                      <span v-if="task.completedAt" class="inline-flex items-center text-green-700 bg-green-100 px-3 py-1.5 rounded-lg font-semibold text-sm border border-green-200 shadow-sm">
                        <CheckIcon size="16" class="mr-1.5 flex-shrink-0" />
                        Completed {{ formatDate(task.completedAt) }}
                      </span>
                    </div>

                    <!-- Tags -->
                    <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-2 mt-3">
                      <span
                        v-for="tag in task.tags"
                        :key="tag"
                        class="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap lg:flex-col gap-2 lg:ml-4">
                    <!-- Quick Status Update for Assigned User -->
                    <div v-if="isTaskAssignedToMe(task) && !canManageTasks" class="relative w-full lg:w-auto status-dropdown-container">
                      <button
                        @click.stop="toggleStatusDropdown(task.id)"
                        :disabled="updatingTaskStatus[task.id]"
                        class="btn btn-sm w-full lg:w-auto justify-center font-semibold shadow-md hover:shadow-lg transition-all"
                        :class="{
                          'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700': task.status === 'todo',
                          'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700': task.status === 'in_progress',
                          'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700': task.status === 'completed',
                          'opacity-50 cursor-not-allowed': updatingTaskStatus[task.id]
                        }"
                      >
                        <svg v-if="updatingTaskStatus[task.id]" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ getStatusIcon(task.status) }}</span>
                        <span class="ml-1.5">{{ task.status.replace('_', ' ') }}</span>
                        <svg class="w-4 h-4 ml-1.5 transition-transform" :class="{ 'rotate-180': showStatusDropdown[task.id] }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <!-- Status Dropdown -->
                      <div
                        v-show="showStatusDropdown[task.id]"
                        class="absolute top-full right-0 lg:left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-50 overflow-hidden"
                      >
                        <div class="p-2 bg-gradient-to-r from-primary-500 to-purple-500">
                          <p class="text-xs font-bold text-white text-center">Update Status</p>
                        </div>
                        <div class="p-1">
                          <button
                            v-if="task.status !== 'todo'"
                            @click.stop="updateTaskStatus(task.id, 'todo')"
                            :disabled="updatingTaskStatus[task.id]"
                            class="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3 mb-1"
                          >
                            <span class="text-xl">📋</span>
                            <div>
                              <div>To Do</div>
                              <div class="text-xs text-gray-500 font-normal">Mark as not started</div>
                            </div>
                          </button>
                          <button
                            v-if="task.status !== 'in_progress'"
                            @click.stop="updateTaskStatus(task.id, 'in_progress')"
                            :disabled="updatingTaskStatus[task.id]"
                            class="w-full px-4 py-3 text-left text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3 mb-1"
                          >
                            <span class="text-xl">⚡</span>
                            <div>
                              <div>In Progress</div>
                              <div class="text-xs text-blue-600 font-normal">Currently working on it</div>
                            </div>
                          </button>
                          <button
                            v-if="task.status !== 'completed'"
                            @click.stop="updateTaskStatus(task.id, 'completed')"
                            :disabled="updatingTaskStatus[task.id]"
                            class="w-full px-4 py-3 text-left text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
                          >
                            <span class="text-xl">✅</span>
                            <div>
                              <div>Completed</div>
                              <div class="text-xs text-green-600 font-normal">Mark as done</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Edit Button - Only for Project Owner and Mentors -->
                    <button
                      v-if="canManageTasks"
                      @click="openEditTaskModal(task)"
                      class="btn btn-sm btn-ghost text-primary-600 hover:bg-primary-50 border border-primary-200 hover:border-primary-300 transition-all"
                    >
                      <svg class="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                    
                    <!-- Delete Button - Only for Project Owner and Mentors -->
                    <button
                      v-if="canManageTasks"
                      @click="handleDeleteTask(task.id)"
                      class="btn btn-sm btn-ghost text-error hover:bg-error/10 border border-error/30 hover:border-error/50 transition-all"
                    >
                      <svg class="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                <!-- Comments Section -->
                <div class="mt-6 pt-6 border-t-2" :class="{
                  'border-gray-200': task.status === 'todo',
                  'border-blue-200': task.status === 'in_progress',
                  'border-green-200': task.status === 'completed'
                }">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="font-bold text-gray-900 flex items-center text-base sm:text-lg">
                      <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Comments
                      <span class="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                        {{ task.comments?.length || 0 }}
                      </span>
                    </h4>
                    <div class="flex items-center gap-2">
                      <button
                        @click="toggleCommentForm(task.id)"
                        class="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm hover:shadow"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Comment
                      </button>
                      <button
                        v-if="task.comments && task.comments.length > 0"
                        @click="toggleTaskComments(task.id)"
                        class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        {{ expandedComments[task.id] ? 'Hide' : 'Show' }}
                        <svg 
                          class="w-4 h-4 ml-1 transition-transform" 
                          :class="{ 'rotate-180': expandedComments[task.id] }"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Add Comment Form -->
                  <div v-show="showCommentForm[task.id]" class="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div class="flex items-start gap-3">
                      <div class="w-9 h-9 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span class="text-white font-bold text-sm">
                          {{ user?.fullName?.split(' ').map(n => n[0]).join('') || '?' }}
                        </span>
                      </div>
                      <div class="flex-1">
                        <textarea
                          v-model="(commentForms[task.id] = commentForms[task.id] || { content: '' }).content"
                          placeholder="Write your comment here..."
                          rows="3"
                          class="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none transition-all"
                          :disabled="submittingComment"
                        ></textarea>
                        <div class="flex items-center justify-end gap-2 mt-2">
                          <button
                            @click="showCommentForm[task.id] = false"
                            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            :disabled="submittingComment"
                          >
                            Cancel
                          </button>
                          <button
                            @click="addComment(task.id)"
                            :disabled="submittingComment || !commentForms[task.id]?.content.trim()"
                            class="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <svg v-if="submittingComment" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ submittingComment ? 'Posting...' : 'Post Comment' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Comments List -->
                  <div v-show="expandedComments[task.id] && task.comments && task.comments.length > 0" class="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <div
                      v-for="comment in task.comments"
                      :key="comment.id"
                      class="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                    >
                      <!-- Comment Content -->
                      <div class="flex items-start gap-3">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span class="text-white font-bold text-sm">
                            {{ comment.user.fullName.split(' ').map(n => n[0]).join('') }}
                          </span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div class="flex flex-wrap items-center gap-2">
                              <h5 class="font-bold text-gray-900 text-sm sm:text-base">{{ comment.user.fullName }}</h5>
                              <span class="text-xs text-gray-500">@{{ comment.user.username }}</span>
                              <span class="text-xs text-gray-400">•</span>
                              <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                              <span v-if="comment.updatedAt !== comment.createdAt" class="text-xs text-gray-400 italic">(edited)</span>
                            </div>
                            
                            <!-- Action Buttons (only for comment owner) -->
                            <div v-if="isCommentOwner(comment)" class="flex items-center gap-1">
                              <button
                                v-if="editingCommentId !== comment.id"
                                @click="startEditComment(comment)"
                                class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit comment"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                @click="deleteComment(task.id, comment.id)"
                                class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete comment"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <!-- Edit Form -->
                          <div v-if="editingCommentId === comment.id" class="mb-3">
                            <textarea
                              v-model="editCommentForm.content"
                              rows="3"
                              class="w-full px-4 py-3 text-sm border-2 border-blue-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none transition-all"
                              :disabled="submittingComment"
                            ></textarea>
                            <div class="flex items-center justify-end gap-2 mt-2">
                              <button
                                @click="cancelEditComment"
                                class="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                :disabled="submittingComment"
                              >
                                Cancel
                              </button>
                              <button
                                @click="updateComment(task.id, comment.id)"
                                :disabled="submittingComment || !editCommentForm.content.trim()"
                                class="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {{ submittingComment ? 'Saving...' : 'Save Changes' }}
                              </button>
                            </div>
                          </div>

                          <!-- Comment Text -->
                          <p v-else class="text-sm sm:text-base text-gray-700 leading-relaxed break-words mb-2">{{ comment.content }}</p>
                          
                          <!-- Comment User Bio -->
                          <div v-if="comment.user.bio && editingCommentId !== comment.id" class="text-xs text-gray-500 italic mb-3">
                            {{ comment.user.bio }}
                          </div>

                          <!-- Reply Button -->
                          <button
                            v-if="editingCommentId !== comment.id"
                            @click="toggleReplyForm(comment.id)"
                            class="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reply
                          </button>

                          <!-- Reply Form -->
                          <div v-show="showReplyForm[comment.id]" class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <textarea
                              v-model="(replyForms[comment.id] = replyForms[comment.id] || { content: '', parentCommentId: comment.id }).content"
                              placeholder="Write your reply..."
                              rows="2"
                              class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none transition-all"
                              :disabled="submittingComment"
                            ></textarea>
                            <div class="flex items-center justify-end gap-2 mt-2">
                              <button
                                @click="showReplyForm[comment.id] = false"
                                class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                :disabled="submittingComment"
                              >
                                Cancel
                              </button>
                              <button
                                @click="replyComment(task.id, comment.id)"
                                :disabled="submittingComment || !replyForms[comment.id]?.content.trim()"
                                class="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {{ submittingComment ? 'Posting...' : 'Post Reply' }}
                              </button>
                            </div>
                          </div>

                          <!-- Replies Section -->
                          <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-3 pl-4 sm:pl-6 border-l-2 border-gray-200">
                            <div
                              v-for="reply in comment.replies"
                              :key="reply.id"
                              class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all shadow-sm"
                            >
                              <div class="flex items-start gap-2">
                                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow">
                                  <span class="text-white font-bold text-xs">
                                    {{ reply.user.fullName.split(' ').map(n => n[0]).join('') }}
                                  </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                  <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                                    <h6 class="font-bold text-gray-900 text-xs sm:text-sm">{{ reply.user.fullName }}</h6>
                                    <span class="text-xs text-gray-500">@{{ reply.user.username }}</span>
                                    <span class="text-xs text-gray-400">•</span>
                                    <span class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</span>
                                    <span v-if="reply.updatedAt !== reply.createdAt" class="text-xs text-gray-400 italic">(edited)</span>
                                  </div>
                                  <p class="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">{{ reply.content }}</p>
                                  
                                  <!-- Reply Actions (if owner) -->
                                  <div v-if="user && reply.user.id === user.id" class="flex items-center gap-2 mt-2">
                                    <button
                                      @click="startEditComment(reply, true)"
                                      class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit
                                    </button>
                                    <button
                                      @click="deleteComment(task.id, reply.id)"
                                      class="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State when no comments and not expanded -->
                  <div v-if="(!task.comments || task.comments.length === 0) && !showCommentForm[task.id]" class="text-center py-8 bg-gray-50 rounded-xl">
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p class="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="projectsStore.taskPagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div class="text-sm text-gray-600 font-medium">
                  Showing <span class="font-bold text-gray-900">{{ ((projectsStore.taskPagination.page - 1) * projectsStore.taskPagination.limit) + 1 }}</span> 
                  to <span class="font-bold text-gray-900">{{ Math.min(projectsStore.taskPagination.page * projectsStore.taskPagination.limit, projectsStore.taskPagination.total) }}</span> 
                  of <span class="font-bold text-gray-900">{{ projectsStore.taskPagination.total }}</span> tasks
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="loadTasks(projectsStore.taskPagination.page - 1)"
                    :disabled="projectsStore.taskPagination.page === 1"
                    class="btn btn-sm btn-ghost disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span class="hidden sm:inline ml-1">Previous</span>
                  </button>
                  
                  <div class="flex items-center gap-1">
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="loadTasks(page)"
                      :class="{
                        'btn-primary': page === projectsStore.taskPagination.page,
                        'btn-ghost hover:bg-primary-50': page !== projectsStore.taskPagination.page
                      }"
                      class="btn btn-sm min-w-[2.5rem]"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button
                    @click="loadTasks(projectsStore.taskPagination.page + 1)"
                    :disabled="projectsStore.taskPagination.page === projectsStore.taskPagination.totalPages"
                    class="btn btn-sm btn-ghost disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50"
                  >
                    <span class="hidden sm:inline mr-1">Next</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="!isLoadingTasks && (!project.tasks || project.tasks.length === 0)" class="text-center py-16">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p class="text-gray-600 mb-4">No tasks match your current filters. Try adjusting them.</p>
              <button @click="clearTaskFilters" class="btn btn-primary btn-sm">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State - No Tasks Created Yet -->
        <div v-if="!project.tasks || project.tasks.length === 0" class="card p-8 sm:p-12 text-center">
          <div class="max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Tasks Yet</h3>
            <p class="text-gray-600 mb-6">No tasks have been created for this project yet. Start by creating your first task!</p>
            <button v-if="canManageTasks && project.status !== 'completed' && project.status !== 'cancelled'" @click="openCreateTaskModal" class="btn btn-primary btn-md shadow-lg hover:shadow-xl transition-shadow">
              <PlusIcon size="20" class="mr-2" />
              Create First Task
            </button>
          </div>
        </div>
      </div>

      <!-- Members Tab -->
      <div v-show="activeTab === 'members'" class="space-y-4 sm:space-y-6 lg:space-y-8">
        <!-- Pending Volunteer Requests (Only visible to project_owner and mentor roles) -->
        <div v-if="canApprovePendingVolunteers && pendingVolunteers.length > 0 && project.status !== 'completed' && project.status !== 'cancelled'" class="card p-4 sm:p-6 border-2 border-yellow-200 bg-yellow-50">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">⏳</span>
                Pending Volunteer Requests
              </h2>
              <p class="text-gray-700 mt-1">{{ pendingVolunteers.length }} volunteers waiting for approval</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="application in pendingVolunteers"
              :key="application.userId"
              class="border-2 border-yellow-300 bg-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
              @click="navigateToUserProfile(application.user.username)"
            >
              <div class="flex items-start space-x-3 sm:space-x-4">
                <div class="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-yellow-700 font-bold text-sm sm:text-base lg:text-lg">
                    {{ application.user.fullName.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 text-lg mb-1">{{ application.user.fullName }}</h3>
                  <p class="text-sm text-gray-600 mb-3">Applied {{ formatDate(application.joinedAt) }}</p>

                  <!-- Application Message -->
                  <div v-if="application.applicationMessage" class="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-700 italic">"{{ application.applicationMessage }}"</p>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                    <div class="bg-blue-50 rounded-lg p-2">
                      <p class="text-xs text-blue-600 mb-0.5">Contribution Score</p>
                      <p class="text-lg font-bold text-blue-900">{{ application.contributionScore }}</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-2">
                      <p class="text-xs text-green-600 mb-0.5">Tasks Completed</p>
                      <p class="text-lg font-bold text-green-900">{{ application.tasksCompleted }}</p>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex space-x-2">
                    <button
                      @click.stop="handleVolunteerAction(application.userId, 'approve')"
                      class="flex-1 btn btn-success btn-sm"
                    >
                      <CheckIcon size="16" class="mr-1" />
                      Approve
                    </button>
                    <button
                      @click.stop="handleVolunteerAction(application.userId, 'reject')"
                      class="flex-1 btn btn-error btn-sm"
                    >
                      <XIcon size="16" class="mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Mentor Requests (Only visible to project_owner role) -->
        <div v-if="canApprovePendingMentors && pendingMentors.length > 0 && project.status !== 'completed' && project.status !== 'cancelled'" class="card p-6 border-2 border-purple-200 bg-purple-50">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">⏳</span>
                Pending Mentor Requests
              </h2>
              <p class="text-gray-700 mt-1">{{ pendingMentors.length }} mentors waiting for approval</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="application in pendingMentors"
              :key="application.userId"
              class="border-2 border-purple-300 bg-white rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
              @click="navigateToUserProfile(application.user.username)"
            >
              <div class="flex items-start space-x-4">
                <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-purple-700 font-bold text-lg">
                    {{ application.user.fullName.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 text-lg mb-1">{{ application.user.fullName }}</h3>
                  <p class="text-sm text-gray-600 mb-3">Applied {{ formatDate(application.joinedAt) }}</p>

                  <!-- Application Message -->
                  <div v-if="application.applicationMessage" class="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-700 italic">"{{ application.applicationMessage }}"</p>
                  </div>

                  <!-- Expertise Areas -->
                  <div v-if="application.expertiseAreas && application.expertiseAreas.length" class="mb-4">
                    <p class="text-xs font-semibold text-gray-600 mb-2">Expertise Areas:</p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="expertise in application.expertiseAreas"
                        :key="expertise"
                        class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                      >
                        {{ expertise }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex space-x-2">
                    <button
                      @click.stop="handleMentorAction(application.userId, 'approve')"
                      class="flex-1 btn btn-success btn-sm"
                    >
                      <CheckIcon size="16" class="mr-1" />
                      Approve
                    </button>
                    <button
                      @click.stop="handleMentorAction(application.userId, 'reject')"
                      class="flex-1 btn btn-error btn-sm"
                    >
                      <XIcon size="16" class="mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Volunteers Section -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Volunteers</h2>
              <p class="text-gray-600 mt-1">{{ project.volunteers.length }} active members</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">
                {{ project.volunteers.length }}/{{ project.volunteersNeeded || project.volunteers_needed }} spots filled
              </span>
            </div>
          </div>

          <!-- Top Contributors Highlight -->
          <div v-if="topContributors.length > 0" class="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <h3 class="font-bold text-gray-900 mb-3 flex items-center">
              <span class="text-xl mr-2">🏆</span>
              Top Contributors This Month
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(contributor, index) in topContributors.slice(0, 3)"
                :key="contributor.id"
                class="flex items-center space-x-3 p-3 rounded-lg"
                :class="{
                  'bg-gradient-to-r from-yellow-100 to-yellow-50': index === 0,
                  'bg-gradient-to-r from-gray-100 to-gray-50': index === 1,
                  'bg-gradient-to-r from-orange-100 to-orange-50': index === 2
                }"
              >
                <div class="text-2xl">
                  <span v-if="index === 0">🥇</span>
                  <span v-else-if="index === 1">🥈</span>
                  <span v-else>🥉</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 text-sm truncate">{{ contributor.name }}</p>
                  <p class="text-xs text-gray-600">{{ contributor.contribution_score }} points</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Volunteers Grid -->
          <div v-if="project.volunteers && project.volunteers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="volunteer in project.volunteers"
              :key="volunteer.id"
              class="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              @click="navigateToUserProfile(volunteer.user?.username)"
            >
              <div class="flex items-start justify-between space-x-4">
                <div class="flex items-start space-x-4 flex-1">
                  <div class="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-primary-600 font-bold text-lg">
                      {{ volunteer.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-lg mb-1">{{ volunteer.name }}</h3>
                    <div class="flex items-center space-x-2 mb-3">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-700': volunteer.status === 'active',
                          'bg-gray-100 text-gray-700': volunteer.status === 'inactive'
                        }"
                      >
                        {{ volunteer.status }}
                      </span>
                      <span class="text-sm text-gray-600">
                        Joined {{ formatDate(volunteer.joined_at) }}
                      </span>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-2 gap-3 mb-3">
                      <div class="bg-blue-50 rounded-lg p-2">
                        <p class="text-xs text-blue-600 mb-0.5">Contribution Score</p>
                        <p class="text-lg font-bold text-blue-900">{{ volunteer.contribution_score || 0 }}</p>
                      </div>
                      <div class="bg-green-50 rounded-lg p-2">
                        <p class="text-xs text-green-600 mb-0.5">Tasks Done</p>
                        <p class="text-lg font-bold text-green-900">{{ volunteer.tasks_completed || 0 }}</p>
                      </div>
                    </div>

                    <!-- Skills -->
                    <div v-if="volunteer.skills && volunteer.skills.length" class="flex flex-wrap gap-1">
                      <span
                        v-for="skill in volunteer.skills.slice(0, 3)"
                        :key="skill"
                        class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                      >
                        {{ skill }}
                      </span>
                      <span v-if="volunteer.skills.length > 3" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        +{{ volunteer.skills.length - 3 }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Kick Out Button (Only for Project Owner) -->
                <div v-if="isProjectCreator" class="flex-shrink-0">
                  <button
                    @click.stop="handleRemoveVolunteer(volunteer.user_id || volunteer.id)"
                    class="btn btn-error btn-xs sm:btn-sm hover:shadow-md transition-all"
                    title="Remove volunteer from project"
                  >
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="hidden sm:inline ml-1">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon size="32" class="text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Volunteers Yet</h3>
            <p class="text-gray-600">Be the first to join this project!</p>
          </div>
        </div>

        <!-- Mentors Section -->
        <div v-if="project.mentors && project.mentors.length > 0" class="card p-6">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Project Mentors</h2>
            <p class="text-gray-600 mt-1">{{ project.mentors.length }} experienced mentors guiding the team</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="mentor in project.mentors"
              :key="mentor.id"
              class="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 hover:border-yellow-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              @click="navigateToUserProfile(mentor.user?.username)"
            >
              <div class="flex items-start space-x-4">
                <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-white font-bold text-lg">
                    {{ mentor.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 class="font-bold text-gray-900 text-lg">{{ mentor.name }}</h3>
                    <span class="text-yellow-600">⭐</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    Mentoring since {{ formatDate(mentor.assigned_at) }}
                  </p>

                  <!-- Expertise -->
                  <div>
                    <p class="text-xs font-semibold text-gray-700 mb-2">Areas of Expertise:</p>
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="expertise in mentor.expertise"
                        :key="expertise"
                        class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium"
                      >
                        {{ expertise }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats Tab -->
      <div v-show="activeTab === 'stats'">
        <div v-if="statistics" class="space-y-6">
          <!-- Overview Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Members Card -->
            <div class="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-blue-900">Total Members</h3>
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-blue-900">{{ statistics.volunteers.total + statistics.mentors.total }}</p>
              <p class="text-xs text-blue-700 mt-1">{{ statistics.volunteers.total }} volunteers, {{ statistics.mentors.total }} mentors</p>
            </div>

            <!-- Tasks Completion Card -->
            <div class="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-green-900">Tasks Progress</h3>
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-green-900">{{ statistics.tasks.completionPercentage }}%</p>
              <p class="text-xs text-green-700 mt-1">{{ statistics.tasks.completed }} of {{ statistics.tasks.total }} completed</p>
            </div>

            <!-- Milestones Completion Card -->
            <div class="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-purple-900">Milestones</h3>
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-purple-900">{{ statistics.milestones.completionPercentage }}%</p>
              <p class="text-xs text-purple-700 mt-1">{{ statistics.milestones.completed }} of {{ statistics.milestones.total }} completed</p>
            </div>

            <!-- Volunteer Fill Rate Card -->
            <div class="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-orange-900">Volunteer Fill</h3>
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-orange-900">{{ statistics.volunteersFillPercentage }}%</p>
              <p class="text-xs text-orange-700 mt-1">{{ statistics.volunteers.total }} of {{ statistics.volunteersNeeded }} needed</p>
            </div>
          </div>

          <!-- Project Info Summary -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Categories</p>
                  <p class="text-lg font-semibold text-gray-900">{{ statistics.categories }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Skills Required</p>
                  <p class="text-lg font-semibold text-gray-900">{{ statistics.skills }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <p class="text-lg font-semibold text-gray-900 capitalize">{{ statistics.projectStatus.replace('_', ' ') }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Level</p>
                  <p class="text-lg font-semibold text-gray-900 capitalize">{{ statistics.projectLevel }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Duration</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatProjectDate(statistics.startDate) }} - {{ formatProjectDate(statistics.endDate) }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg v-if="statistics.isVerified" class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Verification</p>
                  <p class="text-lg font-semibold" :class="statistics.isVerified ? 'text-indigo-600' : 'text-gray-500'">
                    {{ statistics.isVerified ? 'Verified' : 'Not Verified' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="!statistics && !isLoading" class="card p-12 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Statistics Available</h3>
          <p class="text-gray-600">Statistics for this project are currently unavailable.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <LoaderIcon size="32" class="animate-spin mx-auto text-primary-600 mb-4" />
    <p class="text-gray-600">Loading project details...</p>
  </div>

  <!-- Error State -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
    <p class="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
    <NuxtLink to="/explore" class="btn btn-primary btn-lg">
      Explore Projects
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Thumbs, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/pagination'
import Swal from 'sweetalert2'
import MilestoneModal from '~/components/project/MilestoneModal.vue'
import TaskModal from '~/components/project/TaskModal.vue'

definePageMeta({
  middleware: []
})

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const isJoining = ref(false)
const activeTab = ref<'overview' | 'milestones' | 'tasks' | 'members' | 'stats'>('overview')

// Milestone modal state
const isMilestoneModalOpen = ref(false)
const editingMilestone = ref<any>(null)

// Task modal state
const isTaskModalOpen = ref(false)
const editingTask = ref<any>(null)

// Task filters
const taskFilters = ref({
  status: '',
  priority: '',
  assignedToId: '',
  keyword: ''
})
const isLoadingTasks = ref(false)
const filtersExpanded = ref(false)
const expandedComments = ref<Record<string, boolean>>({})
const showCommentForm = ref<Record<string, boolean>>({})
const showReplyForm = ref<Record<string, boolean>>({})
const editingCommentId = ref<string | null>(null)
const commentForms = ref<Record<string, { content: string }>>({})
const replyForms = ref<Record<string, { content: string, parentCommentId: string }>>({})
const editCommentForm = ref<{ content: string }>({ content: '' })
const submittingComment = ref(false)
const updatingTaskStatus = ref<Record<string, boolean>>({})
const showStatusDropdown = ref<Record<string, boolean>>({})

// Debounce timer for search filter
let filterDebounceTimer: any = null

// Swiper instances for image gallery
const thumbsSwiper = ref<SwiperType | null>(null)
const mainSwiper = ref<SwiperType | null>(null)
const swiperModules = [Navigation, Thumbs, Pagination]

const setThumbsSwiper = (swiper: SwiperType) => {
  thumbsSwiper.value = swiper
}

const setMainSwiper = (swiper: SwiperType) => {
  mainSwiper.value = swiper
}

// Computed properties
const project = computed(() => projectsStore.currentProject)
const user = computed(() => authStore.user)
const isVolunteer = computed(() => authStore.isVolunteer)
const statistics = computed(() => projectsStore.projectStatistics)
const progress = computed(() => {
  // Use statistics completion percentage if available
  if (statistics.value?.tasks?.completionPercentage !== undefined) {
    return Math.round(statistics.value.tasks.completionPercentage)
  }
  // Fallback to volunteer percentage
  if (!project.value) return 0
  const needed = project.value.volunteers_needed || project.value.volunteersNeeded || 1
  const joined = project.value.volunteers_joined || project.value.volunteerCount || 0
  return Math.round((joined / needed) * 100)
})

const isVolunteerInProject = computed(() => {
  if (!project.value || !user.value) return false
  return project.value.volunteers.some(v => v.user_id === user.value!.id)
})

const canManageTasks = computed(() => {
  if (!user.value || !project.value) return false
  // Project creators and mentors can manage tasks
  return user.value.id === project.value.creator.id || project.value.mentors.some(m => m.user_id === user.value!.id)
})

const canManageMilestones = computed(() => {
  if (!user.value || !project.value) return false
  // Project creators and mentors can manage milestones
  return user.value.id === project.value.creator.id || project.value.mentors.some(m => m.user_id === user.value!.id)
})

const canUpdateTask = (task: any) => {
  if (!user.value) return false
  // Assigned user can update their own tasks
  return task.assigned_to === user.value.id || task.assignedTo?.id === user.value.id
}

const isTaskAssignedToMe = (task: any) => {
  if (!user.value) return false
  return task.assigned_to === user.value.id || task.assignedTo?.id === user.value.id
}

const topContributors = computed(() => {
  if (!project.value?.volunteers) return []
  return [...project.value.volunteers]
    .sort((a, b) => (b.contribution_score || 0) - (a.contribution_score || 0))
    .slice(0, 5)
})

const mandatorySkills = computed(() => {
  if (!project.value?.skills) return []
  return project.value.skills.filter(skill => skill.isMandatory)
})

const optionalSkills = computed(() => {
  if (!project.value?.skills) return []
  return project.value.skills.filter(skill => !skill.isMandatory)
})

const allProjectMembers = computed(() => {
  if (!project.value) return []
  
  const members: any[] = []
  
  // Add volunteers only - using user.id from the nested user object
  if (project.value.volunteers) {
    project.value.volunteers.forEach((volunteer: any) => {
      members.push({
        id: volunteer.user?.id || volunteer.user_id,
        fullName: volunteer.user?.fullName || volunteer.name || volunteer.fullName
      })
    })
  }
  
  return members
})

const hasActiveFilters = computed(() => {
  return !!(taskFilters.value.status || taskFilters.value.priority || taskFilters.value.assignedToId || taskFilters.value.keyword)
})

const visiblePages = computed(() => {
  const current = projectsStore.taskPagination.page
  const total = projectsStore.taskPagination.totalPages
  const pages: number[] = []
  
  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 3) {
      pages.push(-1) // Ellipsis
    }
    
    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push(-1) // Ellipsis
    }
    
    // Always show last page
    pages.push(total)
  }
  
  return pages.filter(p => p > 0) // Remove ellipsis for now
})

const pendingVolunteers = computed(() => projectsStore.pendingVolunteers)
const pendingMentors = computed(() => projectsStore.pendingMentors)
const isProjectCreator = computed(() => {
  if (!user.value || !project.value) return false
  return user.value.id === project.value.creator.id
})

// Check if current user is a project member (volunteer or mentor)
const isProjectMember = computed(() => {
  if (!user.value || !project.value) return false
  
  // Check if user is the project creator
  if (user.value.id === project.value.creator.id) return true
  
  // Check if user is in volunteers array
  const isVolunteer = project.value.volunteers.some(
    (v: any) => v.user?.id === user.value!.id || v.user_id === user.value!.id
  )
  if (isVolunteer) return true
  
  // Check if user is in mentors array
  const isMentor = project.value.mentors.some(
    (m: any) => m.user?.id === user.value!.id || m.user_id === user.value!.id
  )
  if (isMentor) return true
  
  return false
})

// Check if user can approve pending volunteers (project_owner or mentor)
const canApprovePendingVolunteers = computed(() => {
  if (!user.value || !project.value) return false
  // Project owner can always approve
  if (user.value.id === project.value.creator.id) return true
  // Check if user is a mentor in this project
  const isMentor = project.value.mentors.some(m => m.user_id === user.value!.id)
  return isMentor
})

// Check if user can approve pending mentors (project_owner only)
const canApprovePendingMentors = computed(() => {
  if (!user.value || !project.value) return false
  return user.value.id === project.value.creator.id
})

// Check user role in project from localStorage auth_user
const userRoleInProject = computed(() => {
  if (!user.value || !project.value) return null
  
  try {
    const authUser = localStorage.getItem('auth_user')
    if (authUser) {
      const userData = JSON.parse(authUser)
      return userData.role || null
    }
  } catch (error) {
    console.error('Error parsing auth_user:', error)
  }
  return null
})

// Check if current user is a mentor in this project
const isUserMentorInProject = computed(() => {
  if (!user.value || !project.value) return false
  return project.value.mentors.some(
    (m: any) => m.user?.id === user.value!.id || m.user_id === user.value!.id
  )
})

// Check if current user is a volunteer in this project
const isUserVolunteerInProject = computed(() => {
  if (!user.value || !project.value) return false
  return project.value.volunteers.some(
    (v: any) => v.user?.id === user.value!.id || v.user_id === user.value!.id
  )
})

// Check if user can leave project (mentor or volunteer, but not project creator)
const canLeaveProject = computed(() => {
  if (!user.value || !project.value) return false
  // Project creator cannot leave their own project
  if (user.value.id === project.value.creator.id) return false
  // User must be either a mentor or volunteer in the project
  return isUserMentorInProject.value || isUserVolunteerInProject.value
})

// Get count of incomplete assigned tasks for current user
const userIncompleteTasksCount = computed(() => {
  if (!user.value || !project.value?.tasks) return 0
  return project.value.tasks.filter(
    (task: any) => task.assigned_to === user.value!.id && task.status !== 'completed'
  ).length
})

const projectImages = computed(() => {
  if (!project.value) return []
  
  const images = []
  
  // Add banner image if exists
  if (project.value.bannerUrl) {
    images.push({
      id: 'banner',
      url: project.value.bannerUrl,
      caption: project.value.name,
      type: 'Banner'
    })
  }
  
  // Add additional images if exists
  if (project.value.images && Array.isArray(project.value.images)) {
    project.value.images.forEach((img: any, index: number) => {
      images.push({
        id: `image-${index}`,
        url: typeof img === 'string' ? img : img.url,
        caption: typeof img === 'object' && img.caption ? img.caption : `Project Image ${index + 1}`,
        type: typeof img === 'object' && img.type ? img.type : 'Gallery'
      })
    })
  }
  
  // Fallback to Picsum photos if no images
  if (images.length === 0) {
    const randomSeed = project.value.id || Math.random().toString(36).substring(7)
    for (let i = 0; i < 3; i++) {
      images.push({
        id: `picsum-${i}`,
        url: `https://picsum.photos/seed/${randomSeed}-${i}/1200/600`,
        caption: `${project.value.name} - Image ${i + 1}`,
        type: 'Gallery'
      })
    }
  }
  
  return images
})

// Methods
const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed',
    paused: 'Paused'
  }
  return labels[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatProjectDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const showMembershipRequiredAlert = async () => {
  await Swal.fire({
    icon: 'warning',
    title: 'Members Only',
    html: `
      <div class="text-left">
        <p class="mb-3">This content is restricted to project members only.</p>
        <p class="mb-3">To access Milestones and Tasks, you need to:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li>Join this project as a volunteer</li>
          <li>Or be invited as a mentor</li>
        </ul>
      </div>
    `,
    confirmButtonText: 'I Understand',
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'swal-wide'
    }
  })
}

const joinProject = async () => {
  if (!project.value) return
  
  isJoining.value = true
  try {
    const result = await projectsStore.joinProject(project.value.id)
    if (result.success) {
      // Refresh project data to show updated volunteer count
      await projectsStore.fetchProject(project.value.id)
    }
  } finally {
    isJoining.value = false
  }
}

const loadTasks = async (page?: number) => {
  if (!project.value) return
  
  if (page !== undefined) {
    projectsStore.taskPagination.page = page
  }
  
  isLoadingTasks.value = true
  try {
    await projectsStore.fetchTasks(project.value.id, {
      ...taskFilters.value,
      page: projectsStore.taskPagination.page,
      limit: projectsStore.taskPagination.limit
    })
  } finally {
    isLoadingTasks.value = false
  }
}

const applyTaskFilters = async () => {
  projectsStore.taskPagination.page = 1
  await loadTasks()
}

const clearTaskFilters = async () => {
  taskFilters.value = {
    status: '',
    priority: '',
    assignedToId: '',
    keyword: ''
  }
  await loadTasks()
}

const debouncedApplyFilters = () => {
  if (filterDebounceTimer) {
    clearTimeout(filterDebounceTimer)
  }
  filterDebounceTimer = setTimeout(() => {
    applyTaskFilters()
  }, 500)
}

const toggleFiltersExpanded = () => {
  filtersExpanded.value = !filtersExpanded.value
}

const toggleTaskComments = (taskId: string) => {
  expandedComments.value[taskId] = !expandedComments.value[taskId]
  // Initialize comment form when expanding
  if (expandedComments.value[taskId] && !commentForms.value[taskId]) {
    commentForms.value[taskId] = { content: '' }
  }
}

const toggleCommentForm = (taskId: string) => {
  showCommentForm.value[taskId] = !showCommentForm.value[taskId]
  if (!commentForms.value[taskId]) {
    commentForms.value[taskId] = { content: '' }
  }
}

const toggleReplyForm = (commentId: string) => {
  showReplyForm.value[commentId] = !showReplyForm.value[commentId]
  if (!replyForms.value[commentId]) {
    replyForms.value[commentId] = { content: '', parentCommentId: commentId }
  }
}

const startEditComment = (comment: any) => {
  editingCommentId.value = comment.id
  editCommentForm.value.content = comment.content
}

const cancelEditComment = () => {
  editingCommentId.value = null
  editCommentForm.value.content = ''
}

const addComment = async (taskId: string) => {
  if (!commentForms.value[taskId]?.content.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Empty Comment',
      text: 'Please enter a comment',
      confirmButtonColor: '#3b82f6'
    })
    return
  }

  submittingComment.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl

    await $fetch(`${baseURL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        content: commentForms.value[taskId].content
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Comment Added!',
      text: 'Your comment has been added successfully',
      timer: 1500,
      showConfirmButton: false
    })

    // Clear form
    commentForms.value[taskId].content = ''
    showCommentForm.value[taskId] = false

    // Reload tasks to get updated comments
    await loadTasks()
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Add Comment',
      text: error?.data?.message || 'An error occurred',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    submittingComment.value = false
  }
}

const replyComment = async (taskId: string, commentId: string) => {
  if (!replyForms.value[commentId]?.content.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Empty Reply',
      text: 'Please enter a reply',
      confirmButtonColor: '#3b82f6'
    })
    return
  }

  submittingComment.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl

    await $fetch(`${baseURL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        content: replyForms.value[commentId].content,
        parentCommentId: commentId
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Reply Added!',
      text: 'Your reply has been added successfully',
      timer: 1500,
      showConfirmButton: false
    })

    // Clear form
    replyForms.value[commentId].content = ''
    showReplyForm.value[commentId] = false

    // Reload tasks to get updated comments
    await loadTasks()
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Add Reply',
      text: error?.data?.message || 'An error occurred',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    submittingComment.value = false
  }
}

const updateComment = async (taskId: string, commentId: string) => {
  if (!editCommentForm.value.content.trim()) {
    await Swal.fire({
      icon: 'warning',
      title: 'Empty Comment',
      text: 'Comment cannot be empty',
      confirmButtonColor: '#3b82f6'
    })
    return
  }

  submittingComment.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl

    await $fetch(`${baseURL}/tasks/${taskId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        content: editCommentForm.value.content
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Comment Updated!',
      text: 'Your comment has been updated successfully',
      timer: 1500,
      showConfirmButton: false
    })

    // Clear editing state
    editingCommentId.value = null
    editCommentForm.value.content = ''

    // Reload tasks to get updated comments
    await loadTasks()
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Update Comment',
      text: error?.data?.message || 'An error occurred',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    submittingComment.value = false
  }
}

const deleteComment = async (taskId: string, commentId: string) => {
  const result = await Swal.fire({
    title: 'Delete Comment?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl

    await $fetch(`${baseURL}/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Comment has been deleted successfully',
      timer: 1500,
      showConfirmButton: false
    })

    // Reload tasks to get updated comments
    await loadTasks()
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Delete Comment',
      text: error?.data?.message || 'An error occurred',
      confirmButtonColor: '#3b82f6'
    })
  }
}

const isCommentOwner = (comment: any) => {
  if (!user.value) return false
  return comment.user.id === user.value.id
}

// Milestone management methods
const openCreateMilestoneModal = () => {
  editingMilestone.value = null
  isMilestoneModalOpen.value = true
}

const openEditMilestoneModal = (milestone: any) => {
  editingMilestone.value = milestone
  isMilestoneModalOpen.value = true
}

const closeMilestoneModal = () => {
  isMilestoneModalOpen.value = false
  editingMilestone.value = null
}

// Task management methods
const openCreateTaskModal = () => {
  editingTask.value = null
  isTaskModalOpen.value = true
}

const openEditTaskModal = (task: any) => {
  editingTask.value = task
  isTaskModalOpen.value = true
}

const closeTaskModal = () => {
  isTaskModalOpen.value = false
  editingTask.value = null
}

const handleMilestoneSubmit = async (formData: any) => {
  if (!project.value) return
  
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to manage milestones',
        confirmButtonColor: '#3b82f6'
      })
      return
    }

    const baseURL = config.public.apiBaseUrl
    
    const payload = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      orderPosition: formData.orderPosition,
      startDate: formData.startDate,
      endDate: formData.endDate,
      tags: formData.tags
    }

    if (formData.milestoneId) {
      // Update existing milestone
      await $fetch(`${baseURL}/milestones/${formData.milestoneId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Milestone Updated!',
        text: 'The milestone has been updated successfully',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      // Create new milestone
      await $fetch(`${baseURL}/milestones/projects/${project.value.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Milestone Created!',
        text: 'The new milestone has been created successfully',
        timer: 2000,
        showConfirmButton: false
      })
    }

    // Refresh milestones
    await projectsStore.fetchMilestones(project.value.id)
    closeMilestoneModal()
    
  } catch (error: any) {
    console.error('Error managing milestone:', error)
    
    await Swal.fire({
      icon: 'error',
      title: 'Operation Failed',
      text: error?.data?.message || error?.message || 'Failed to save milestone. Please try again.',
      confirmButtonColor: '#3b82f6'
    })
  }
}

const handleDeleteMilestone = async (milestoneId: string) => {
  if (!project.value) return
  
  const result = await Swal.fire({
    title: 'Delete Milestone?',
    text: 'This action cannot be undone. All tasks associated with this milestone will be unlinked.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const config = useRuntimeConfig()
      const token = localStorage.getItem('auth_token')
      const baseURL = config.public.apiBaseUrl
      
      await $fetch(`${baseURL}/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The milestone has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      })

      // Refresh milestones
      await projectsStore.fetchMilestones(project.value.id)
      
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error?.data?.message || error?.message || 'Failed to delete milestone. Please try again.',
        confirmButtonColor: '#3b82f6'
      })
    }
  }
}

const handleTaskSubmit = async (formData: any) => {
  if (!project.value) return
  
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to manage tasks',
        confirmButtonColor: '#3b82f6'
      })
      closeTaskModal()
      return
    }

    const baseURL = config.public.apiBaseUrl
    
    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      assignedToId: formData.assignedToId || null,
      milestoneId: formData.milestoneId || null,
      dueDate: formData.dueDate,
      tags: formData.tags
    }

    if (formData.taskId) {
      // Update existing task
      await $fetch(`${baseURL}/projects/${project.value.id}/tasks/${formData.taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Task Updated!',
        text: 'The task has been updated successfully',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      // Create new task
      await $fetch(`${baseURL}/projects/${project.value.id}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Task Created!',
        text: 'The new task has been created successfully',
        timer: 2000,
        showConfirmButton: false
      })
    }

    // Close modal and refresh tasks
    closeTaskModal()
    await loadTasks()
    
  } catch (error: any) {
    console.error('Error managing task:', error)
    
    await Swal.fire({
      icon: 'error',
      title: 'Operation Failed',
      text: error?.data?.message || error?.message || 'Failed to save task. Please try again.',
      confirmButtonColor: '#3b82f6'
    })
    closeTaskModal()
  }
}

const handleDeleteTask = async (taskId: string) => {
  if (!project.value) return
  
  const result = await Swal.fire({
    title: 'Delete Task?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const config = useRuntimeConfig()
      const token = localStorage.getItem('auth_token')
      const baseURL = config.public.apiBaseUrl
      
      await $fetch(`${baseURL}/projects/${project.value.id}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The task has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      })

      // Refresh tasks
      await loadTasks()
      
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error?.data?.message || error?.message || 'Failed to delete task. Please try again.',
        confirmButtonColor: '#3b82f6'
      })
    }
  }
}

// Quick status update for assigned tasks
const toggleStatusDropdown = (taskId: string) => {
  showStatusDropdown.value[taskId] = !showStatusDropdown.value[taskId]
}

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  if (!project.value) return
  
  // Find the task to get all its data
  const task = project.value.tasks.find((t: any) => t.id === taskId)
  if (!task) {
    await Swal.fire({
      icon: 'error',
      title: 'Task Not Found',
      text: 'Could not find the task to update',
      confirmButtonColor: '#3b82f6'
    })
    return
  }
  
  updatingTaskStatus.value[taskId] = true
  
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl
    
    // Send complete task data with updated status
    const payload = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: newStatus,
      assignedToId: task.assignedTo?.id || task.assignedToId || null,
      milestoneId: task.milestone?.id || task.milestoneId || null,
      dueDate: task.dueDate || null,
      tags: task.tags || []
    }
    
    await $fetch(`${baseURL}/projects/${project.value.id}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    await Swal.fire({
      icon: 'success',
      title: 'Status Updated!',
      text: `Task status changed to ${newStatus.replace('_', ' ')}`,
      timer: 1500,
      showConfirmButton: false
    })

    // Close dropdown
    showStatusDropdown.value[taskId] = false
    
    // Refresh tasks
    await loadTasks()
    
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error?.data?.message || error?.message || 'Failed to update task status',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    updatingTaskStatus.value[taskId] = false
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'todo':
      return '📋'
    case 'in_progress':
      return '⚡'
    case 'completed':
      return '✅'
    default:
      return '📋'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'text-gray-700 bg-gray-100 hover:bg-gray-200'
    case 'in_progress':
      return 'text-blue-700 bg-blue-100 hover:bg-blue-200'
    case 'completed':
      return 'text-green-700 bg-green-100 hover:bg-green-200'
    default:
      return 'text-gray-700 bg-gray-100 hover:bg-gray-200'
  }
}

const handleUnassignTask = async (taskId: string) => {
  if (!project.value) return
  
  const result = await Swal.fire({
    title: 'Unassign Task?',
    text: 'This will remove the current assignee from this task.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, unassign',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      const config = useRuntimeConfig()
      const token = localStorage.getItem('auth_token')
      const baseURL = config.public.apiBaseUrl
      
      await $fetch(`${baseURL}/projects/${project.value.id}/tasks/${taskId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          assignedToId: null
        }
      })

      await Swal.fire({
        icon: 'success',
        title: 'Unassigned!',
        text: 'The task has been unassigned successfully',
        timer: 2000,
        showConfirmButton: false
      })

      // Refresh tasks
      await loadTasks()
      
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Unassign Failed',
        text: error?.data?.message || error?.message || 'Failed to unassign task. Please try again.',
        confirmButtonColor: '#3b82f6'
      })
    }
  }
}

const handleVolunteerAction = async (volunteerId: string, action: 'approve' | 'reject') => {
  if (!project.value) return
  
  // Show confirmation dialog
  const actionText = action === 'approve' ? 'approve' : 'reject'
  const result = await Swal.fire({
    title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Volunteer?`,
    text: `Are you sure you want to ${actionText} this volunteer application?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: action === 'approve' ? '#10b981' : '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Yes, ${actionText}!`,
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  try {
    const response = await projectsStore.handleVolunteerApplication(project.value.id, volunteerId, action)
    if (response.success) {
      await Swal.fire({
        icon: 'success',
        title: `Volunteer ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        text: `The volunteer application has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        timer: 2000,
        showConfirmButton: false
      })
      
      // Refresh project data to show updated volunteers
      await projectsStore.fetchProject(project.value.id)
    }
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Action Failed',
      text: error?.message || `Failed to ${actionText} volunteer application`,
      confirmButtonColor: '#3b82f6'
    })
  }
}

const handleMentorAction = async (mentorId: string, action: 'approve' | 'reject') => {
  if (!project.value) return
  
  // Show confirmation dialog
  const actionText = action === 'approve' ? 'approve' : 'reject'
  const result = await Swal.fire({
    title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Mentor?`,
    text: `Are you sure you want to ${actionText} this mentor application?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: action === 'approve' ? '#10b981' : '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Yes, ${actionText}!`,
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  try {
    const response = await projectsStore.handleMentorApplication(project.value.id, mentorId, action)
    if (response.success) {
      await Swal.fire({
        icon: 'success',
        title: `Mentor ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        text: `The mentor application has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        timer: 2000,
        showConfirmButton: false
      })
      
      // Refresh project data to show updated mentors
      await projectsStore.fetchProject(project.value.id)
    }
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Action Failed',
      text: error?.message || `Failed to ${actionText} mentor application`,
      confirmButtonColor: '#3b82f6'
    })
  }
}

const handleLeaveProject = async () => {
  if (!project.value || !user.value) return
  
  const isMentor = isUserMentorInProject.value
  const isVolunteer = isUserVolunteerInProject.value
  const incompleteTasksCount = userIncompleteTasksCount.value
  
  // Build warning message
  let warningHtml = `
    <div class="text-left space-y-3">
      <p class="text-gray-700">Are you sure you want to leave <strong>${project.value.name}</strong>?</p>
  `
  
  if (incompleteTasksCount > 0) {
    warningHtml += `
      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="font-semibold text-red-800">⚠️ Penalty Warning</p>
            <p class="text-sm text-red-700 mt-1">
              You have <strong>${incompleteTasksCount}</strong> incomplete task${incompleteTasksCount > 1 ? 's' : ''} assigned to you. 
              Leaving now will result in a <strong>penalty score</strong> on your profile.
            </p>
          </div>
        </div>
      </div>
    `
  }
  
  warningHtml += `
      <p class="text-sm text-gray-600 mt-3">This action cannot be undone easily. You'll need to reapply to join again.</p>
    </div>
  `
  
  const result = await Swal.fire({
    title: 'Leave Project?',
    html: warningHtml,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: incompleteTasksCount > 0 ? 'Leave Anyway' : 'Yes, Leave',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'swal-wide',
      htmlContainer: 'text-left'
    },
    width: '600px'
  })

  if (!result.isConfirmed) return

  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to leave the project',
        confirmButtonColor: '#3b82f6'
      })
      return
    }

    // Determine endpoint based on role
    let endpoint = ''
    let roleText = ''
    
    if (isMentor) {
      endpoint = `${baseURL}/projects/${project.value.id}/mentors/leave`
      roleText = 'mentor'
    } else if (isVolunteer) {
      endpoint = `${baseURL}/projects/${project.value.id}/volunteers/leave`
      roleText = 'volunteer'
    } else {
      throw new Error('Unable to determine your role in this project')
    }

    // Call API to leave project
    await $fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Left Project Successfully',
      html: `
        <p>You have successfully left <strong>${project.value.name}</strong>.</p>
        ${incompleteTasksCount > 0 ? '<p class="text-sm text-red-600 mt-2">A penalty has been applied to your profile due to incomplete tasks.</p>' : ''}
      `,
      timer: 3000,
      showConfirmButton: false
    })

    // Redirect to explore page or refresh project
    setTimeout(() => {
      router.push('/explore')
    }, 3000)
    
  } catch (error: any) {
    console.error('Error leaving project:', error)
    
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Leave Project',
      text: error?.data?.message || error?.message || 'An error occurred while trying to leave the project',
      confirmButtonColor: '#3b82f6'
    })
  }
}

const navigateToUserProfile = (username: string) => {
  if (username) {
    router.push(`/users/${username}`)
  }
}

const handleRemoveVolunteer = async (volunteerId: string) => {
  if (!project.value || !isProjectCreator.value) return
  
  // Find volunteer info
  const volunteer = project.value.volunteers.find(
    (v: any) => v.user_id === volunteerId || v.id === volunteerId
  )
  
  const volunteerName = volunteer?.name || volunteer?.fullName || 'this volunteer'
  
  const result = await Swal.fire({
    title: 'Remove Volunteer?',
    html: `
      <div class="text-left space-y-3">
        <p class="text-gray-700">Are you sure you want to remove <strong>${volunteerName}</strong> from this project?</p>
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <p class="font-semibold text-yellow-800">Important</p>
              <p class="text-sm text-yellow-700 mt-1">
                This will remove the volunteer from the project immediately. All their task assignments will be unassigned.
              </p>
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-3">This action cannot be undone. The volunteer will need to reapply to join again.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, Remove',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'swal-wide',
      htmlContainer: 'text-left'
    },
    width: '600px'
  })

  if (!result.isConfirmed) return

  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('auth_token')
    const baseURL = config.public.apiBaseUrl
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please login to remove volunteers',
        confirmButtonColor: '#3b82f6'
      })
      return
    }

    await $fetch(`${baseURL}/projects/${project.value.id}/volunteers/${volunteerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await Swal.fire({
      icon: 'success',
      title: 'Volunteer Removed',
      text: `${volunteerName} has been removed from the project successfully`,
      timer: 2000,
      showConfirmButton: false
    })

    // Refresh project data
    await projectsStore.fetchProject(project.value.id)
    
  } catch (error: any) {
    console.error('Error removing volunteer:', error)
    
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Remove Volunteer',
      text: error?.data?.message || error?.message || 'An error occurred while trying to remove the volunteer',
      confirmButtonColor: '#3b82f6'
    })
  }
}

// Load project data
onMounted(async () => {
  const projectId = route.params.id as string
  if (projectId) {
    await projectsStore.fetchProject(projectId)
    // Fetch milestones after project is loaded
    if (projectsStore.currentProject) {
      await Promise.all([
        projectsStore.fetchMilestones(projectId),
        projectsStore.fetchTasks(projectId),
        projectsStore.fetchPendingVolunteers(projectId),
        projectsStore.fetchPendingMentors(projectId),
        projectsStore.fetchStatistics(projectId)
      ])
    }
  }
  isLoading.value = false
})

// Watch tab changes to reload data if needed
watch(activeTab, async (newTab, oldTab) => {
  if (!project.value) return
  
  // Prevent non-members from accessing restricted tabs
  if (!isProjectMember.value && (newTab === 'milestones' || newTab === 'tasks')) {
    activeTab.value = oldTab || 'overview'
    await showMembershipRequiredAlert()
    return
  }
  
  if (newTab === 'tasks' && project.value.tasks.length === 0) {
    await loadTasks()
  } else if (newTab === 'members') {
    // Reload pending members
    await Promise.all([
      projectsStore.fetchPendingVolunteers(project.value.id),
      projectsStore.fetchPendingMentors(project.value.id)
    ])
  } else if (newTab === 'stats') {
    // Reload statistics
    await projectsStore.fetchStatistics(project.value.id)
  }
})

// Handle click outside to close status dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.status-dropdown-container')) {
    showStatusDropdown.value = {}
  }
}

onMounted(async () => {
  isLoading.value = true
  const projectId = route.params.id as string
  
  try {
    await projectsStore.fetchProject(projectId)
    
    // Load milestones
    await projectsStore.fetchMilestones(projectId)
    
    // Add event listener for click outside
    document.addEventListener('click', handleClickOutside)
  } catch (error) {
    console.error('Error loading project:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Remove event listener
  document.removeEventListener('click', handleClickOutside)
})

// SEO
useHead({
  title: computed(() => project.value ? `${project.value.name} - PortfolioHub` : 'Project - PortfolioHub'),
  meta: computed(() => [
    {
      name: 'description',
      content: project.value ? project.value.description.slice(0, 160) : 'View project details on PortfolioHub'
    }
  ])
})
</script>

<style scoped>
/* Hide scrollbar for tabs navigation on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Line clamp for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Extra small breakpoint (below sm:640px) */
@media (max-width: 480px) {
  .xs\:hidden {
    display: none;
  }
  
  .xs\:inline {
    display: inline;
  }
}

@media (min-width: 481px) {
  .xs\:hidden {
    display: inline;
  }
  
  .xs\:inline {
    display: none;
  }
}

/* Swiper active thumbnail styling */
:deep(.thumbnails-swiper .swiper-slide-thumb-active) {
  border-color: #2563eb !important;
  opacity: 1;
}

:deep(.thumbnails-swiper .swiper-slide) {
  opacity: 0.6;
  transition: opacity 0.3s;
}

:deep(.thumbnails-swiper .swiper-slide:hover) {
  opacity: 0.9;
}

:deep(.thumbnails-swiper .swiper-slide-thumb-active) {
  opacity: 1;
}

/* Swiper pagination styling */
:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.7;
  width: 8px;
  height: 8px;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
  opacity: 1;
  width: 24px;
  border-radius: 4px;
}

:deep(.swiper-pagination) {
  bottom: 12px !important;
}

/* Mobile pagination styling */
@media (max-width: 640px) {
  :deep(.swiper-pagination-bullet) {
    width: 6px;
    height: 6px;
  }
  
  :deep(.swiper-pagination-bullet-active) {
    width: 18px;
  }
  
  :deep(.swiper-pagination) {
    bottom: 8px !important;
  }
}

/* Custom Scrollbar for Comments */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* SweetAlert custom width */
:deep(.swal-wide) {
  max-width: 500px !important;
}
</style>