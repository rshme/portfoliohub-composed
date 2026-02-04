<template>
  <div
    v-if="project"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] flex flex-col shadow-2xl"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">
              {{ getUserInitials(project.name) }}
            </span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl font-bold text-gray-900">{{ project.name }}</h2>
              <span 
                v-if="project.isVerified"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white"
                :title="`Verified by ${project.verifier?.fullName || 'Admin'}`"
              >
                <CheckCircleIcon size="14" class="mr-1" />
                Verified
              </span>
            </div>
            <p class="text-gray-600 text-sm">by {{ creatorName }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon size="24" class="text-gray-500" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="overflow-y-auto flex-1 modal-scrollable">
        <div class="p-6">
          <!-- Desktop Layout: 2 Columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Image Gallery / Slider -->
              <div class="relative">
                <div class="relative rounded-xl overflow-hidden shadow-lg">
                  <swiper
                    :modules="modules"
                    :slides-per-view="1"
                    :space-between="10"
                    :navigation="{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }"
                    :pagination="{ clickable: true }"
                    :autoplay="{ delay: 5000, disableOnInteraction: false }"
                    class="aspect-video"
                    @swiper="setMainSwiper"
                  >
                    <swiper-slide
                      v-for="(image, index) in displayImages"
                      :key="index"
                      class="relative"
                    >
                      <div class="aspect-video bg-gray-100 relative">
                        <img
                          :src="image.url"
                          :alt="image.caption"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-if="image.caption"
                          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                        >
                          <p class="text-white text-sm font-medium">
                            {{ image.caption }}
                          </p>
                        </div>
                      </div>
                    </swiper-slide>
                  </swiper>

                  <!-- Custom Navigation Buttons -->
                  <button
                    class="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon size="24" class="text-gray-800" />
                  </button>
                  <button
                    class="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon size="24" class="text-gray-800" />
                  </button>
                </div>
              </div>

              <!-- Project Name (Mobile only) -->
              <div class="lg:hidden">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-2xl font-bold text-gray-900">{{ project.name }}</h3>
                  <span 
                    v-if="project.isVerified"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white"
                  >
                    <CheckCircleIcon size="14" class="mr-1" />
                    Verified
                  </span>
                </div>
                <p class="text-gray-600">by {{ creatorName }}</p>
              </div>

              <!-- Description -->
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileTextIcon size="20" class="mr-2 text-primary-600" />
                  About This Project
                </h3>
                <p class="text-gray-700 leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <!-- Project Links -->
              <div
                v-if="project.links?.github || project.links?.gitlab || project.links?.bitbucket || project.links?.website || project.links?.figma || project.links?.discord || project.links?.slack"
                class="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LinkIcon size="20" class="mr-2 text-primary-600" />
                  Project Resources
                </h3>
                <div class="flex flex-wrap gap-3">
                  <!-- GitHub -->
                  <a
                    v-if="project.links?.github"
                    :href="project.links.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#24292e] text-white rounded-lg hover:bg-[#1a1e22] transition-colors shadow-sm hover:shadow-md"
                    title="View GitHub Repository"
                  >
                    <GithubIcon size="20" class="mr-2" />
                    <span class="hidden sm:inline">GitHub</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- GitLab -->
                  <a
                    v-if="project.links?.gitlab"
                    :href="project.links.gitlab"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#FC6D26] text-white rounded-lg hover:bg-[#E24329] transition-colors shadow-sm hover:shadow-md"
                    title="View GitLab Repository"
                  >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.452 10.93c-.6.605-.6 1.584 0 2.189l10.427 10.426c.603.602 1.582.602 2.188 0l10.48-10.426c.6-.605.6-1.584 0-2.189M12.003 6.545l3.03 9.332H8.972l3.031-9.332z"/>
                    </svg>
                    <span class="hidden sm:inline">GitLab</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- Bitbucket -->
                  <a
                    v-if="project.links?.bitbucket"
                    :href="project.links.bitbucket"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#0052CC] text-white rounded-lg hover:bg-[#0747A6] transition-colors shadow-sm hover:shadow-md"
                    title="View Bitbucket Repository"
                  >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z"/>
                    </svg>
                    <span class="hidden sm:inline">Bitbucket</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- Website -->
                  <a
                    v-if="project.links?.website"
                    :href="project.links.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors shadow-sm hover:shadow-md"
                    title="Visit Website"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    <span class="hidden sm:inline">Website</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- Figma -->
                  <a
                    v-if="project.links?.figma"
                    :href="project.links.figma"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#F24E1E] text-white rounded-lg hover:bg-[#E13B0F] transition-colors shadow-sm hover:shadow-md"
                    title="View Figma Design"
                  >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/>
                      <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" opacity=".7"/>
                      <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" opacity=".5"/>
                      <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" opacity=".3"/>
                      <circle cx="16" cy="12" r="4" opacity=".1"/>
                    </svg>
                    <span class="hidden sm:inline">Figma</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- Discord -->
                  <a
                    v-if="project.links?.discord"
                    :href="project.links.discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors shadow-sm hover:shadow-md"
                    title="Join Discord Server"
                  >
                    <MessageSquareIcon size="20" class="mr-2" />
                    <span class="hidden sm:inline">Discord</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>

                  <!-- Slack -->
                  <a
                    v-if="project.links?.slack"
                    :href="project.links.slack"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center px-4 py-2.5 bg-[#4A154B] text-white rounded-lg hover:bg-[#611f69] transition-colors shadow-sm hover:shadow-md"
                    title="Join Slack Workspace"
                  >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 15a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2h2v2zm1 0a2 2 0 012-2 2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5z"/>
                      <path d="M9 6a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2v2H9zm0 1a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2 2 2 0 012-2h5z" opacity=".7"/>
                      <path d="M18 9a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-2V9zm-1 0a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2 2 2 0 012 2v5z" opacity=".5"/>
                      <path d="M15 18a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2v-2h2zm0-1a2 2 0 01-2-2 2 2 0 012-2h5a2 2 0 012 2 2 2 0 01-2 2h-5z" opacity=".3"/>
                    </svg>
                    <span class="hidden sm:inline">Slack</span>
                    <ExternalLinkIcon size="14" class="ml-2" />
                  </a>
                </div>
              </div>

              <!-- Skills & Categories -->
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TagIcon size="20" class="mr-2 text-primary-600" />
                  Skills & Categories
                </h3>
                
                <!-- Categories -->
                <div v-if="projectCategories.length > 0" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Categories</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="category in projectCategories"
                      :key="category.id"
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      <span class="mr-1.5">{{ category.icon }}</span>
                      {{ category.name }}
                    </span>
                  </div>
                </div>

                <!-- Required Skills -->
                <div v-if="requiredSkills.length > 0" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in requiredSkills"
                      :key="skill.id"
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200"
                    >
                      <span class="mr-1.5">{{ skill.icon }}</span>
                      {{ skill.name }}
                      <span class="ml-1.5 text-xs">⭐</span>
                    </span>
                  </div>
                </div>

                <!-- Optional Skills -->
                <div v-if="optionalSkills.length > 0">
                  <p class="text-sm font-medium text-gray-700 mb-2">Optional Skills</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in optionalSkills"
                      :key="skill.id"
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200"
                    >
                      <span class="mr-1.5">{{ skill.icon }}</span>
                      {{ skill.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Quick Stats Bar -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div class="flex items-center justify-between mb-2">
                    <UsersIcon size="20" class="text-blue-600" />
                    <span class="text-xs font-medium text-blue-600">{{ teamProgress }}%</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ project.volunteerCount || 0 }}/{{ project.volunteersNeeded || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1">Volunteers</p>
                </div>

                <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div class="flex items-center justify-between mb-2">
                    <AwardIcon size="20" class="text-green-600" />
                    <span 
                      class="text-xs font-medium px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-green-600 text-white': projectLevel === 'Beginner',
                        'bg-yellow-600 text-white': projectLevel === 'Intermediate',
                        'bg-red-600 text-white': projectLevel === 'Advanced'
                      }"
                    >
                      {{ projectLevel }}
                    </span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ mentorsCount }}</p>
                  <p class="text-xs text-gray-600 mt-1">Mentors</p>
                </div>

                <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div class="flex items-center justify-between mb-2">
                    <CalendarIcon size="20" class="text-purple-600" />
                    <span 
                      class="text-xs font-medium px-2 py-0.5 rounded-full"
                      :class="statusBadgeClass"
                    >
                      {{ projectStatus }}
                    </span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ projectDuration }}</p>
                  <p class="text-xs text-gray-600 mt-1">Duration</p>
                </div>

                <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div class="flex items-center justify-between mb-2">
                    <TargetIcon size="20" class="text-orange-600" />
                    <span class="text-xs font-medium text-orange-600">Progress</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ teamProgress }}%</p>
                  <div class="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div
                      class="h-2 rounded-full bg-orange-600 transition-all"
                      :style="{ width: `${teamProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Project Creator -->
              <div class="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-200 p-6">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon size="20" class="mr-2 text-primary-600" />
                  Project Creator
                </h3>
                <NuxtLink
                  :to="`/users/${project.creator.username}`"
                  class="block text-center hover:opacity-90 transition-opacity"
                >
                  <div
                    class="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                  >
                    <span class="text-white font-bold text-2xl">
                      {{ getUserInitials(creatorName) }}
                    </span>
                  </div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ creatorName }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    @{{ project.creator.username }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2 line-clamp-2">
                    {{ project.creator.bio }}
                  </p>
                  <div class="mt-3 inline-flex items-center text-sm text-primary-600 font-medium">
                    View Profile 
                    <ChevronRightIcon size="16" class="ml-1" />
                  </div>
                </NuxtLink>
              </div>

              <!-- Verification Badge -->
              <div 
                v-if="project.isVerified && project.verifier"
                class="bg-green-50 rounded-xl border border-green-200 p-4"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <CheckCircleIcon size="24" class="text-green-600" />
                  </div>
                  <div class="ml-3">
                    <h4 class="text-sm font-semibold text-green-900">Verified Project</h4>
                    <p class="text-xs text-green-700 mt-1">
                      Verified by {{ project.verifier.fullName }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Project Timeline -->
              <div class="bg-white rounded-xl border border-gray-200 p-6">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon size="20" class="mr-2 text-primary-600" />
                  Timeline
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Start Date</span>
                    <span class="font-medium text-gray-900">{{ formatDate(project.startDate) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">End Date</span>
                    <span class="font-medium text-gray-900">{{ formatDate(project.endDate) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Created</span>
                    <span class="font-medium text-gray-900">{{ formatDate(project.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button
                  v-if="canJoinProject"
                  @click="openApplicationForm"
                  class="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl transition-all"
                >
                  <PlusIcon size="20" class="mr-2" />
                  {{ joinButtonText }}
                </button>
                <button 
                  v-else-if="!canJoinProject && projectStatusValue !== 'active'" 
                  class="btn btn-secondary btn-lg w-full" 
                  disabled
                >
                  <InfoIcon size="20" class="mr-2" />
                  {{ projectStatusValue === 'completed' ? 'Project Completed' : 'Not Accepting Applications' }}
                </button>

                <button
                  v-if="authStore.isVolunteer || authStore.isMentor"
                  @click="toggleBookmark"
                  class="btn btn-ghost btn-md w-full border border-gray-300"
                  :class="isBookmarked ? 'text-yellow-600 border-yellow-300 bg-yellow-50' : ''"
                >
                  <BookmarkIcon
                    size="20"
                    class="mr-2"
                    :fill="isBookmarked ? 'currentColor' : 'none'"
                  />
                  {{ isBookmarked ? "Saved" : "Save for Later" }}
                </button>

                <button class="btn btn-ghost btn-md w-full border border-gray-300">
                  <ShareIcon size="20" class="mr-2" />
                  Share Project
                </button>
              </div>

              <!-- Team Members -->
              <div
                v-if="projectVolunteers.length > 0"
                class="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UsersIcon size="20" class="mr-2 text-primary-600" />
                  Team Members ({{ projectVolunteers.length }})
                </h3>
                <div class="space-y-3">
                  <NuxtLink
                    v-for="volunteer in projectVolunteers.slice(0, 4)"
                    :key="volunteer.id"
                    :to="`/users/${volunteer.user.username}`"
                    class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-white font-semibold text-xs">
                        {{ getUserInitials(volunteer.user.fullName) }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 text-sm truncate group-hover:text-primary-600">
                        {{ volunteer.user.fullName }}
                      </h4>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-xs text-gray-500">
                          🏆 {{ volunteer.contributionScore || 0 }}
                        </span>
                        <span class="text-xs text-gray-500">
                          ✅ {{ volunteer.tasksCompleted || 0 }}
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon size="16" class="text-gray-400 group-hover:text-primary-600" />
                  </NuxtLink>
                </div>
                <div v-if="projectVolunteers.length > 4" class="mt-3 text-center">
                  <p class="text-xs text-gray-600">
                    +{{ projectVolunteers.length - 4 }} more member{{ projectVolunteers.length - 4 !== 1 ? 's' : '' }}
                  </p>
                </div>
              </div>

              <!-- Project Mentors -->
              <div
                v-if="projectMentors.length > 0"
                class="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <StarIcon size="20" class="mr-2 text-yellow-500" />
                  Project Mentors ({{ projectMentors.length }})
                </h3>
                <div class="space-y-3">
                  <NuxtLink
                    v-for="mentor in projectMentors"
                    :key="mentor.id"
                    :to="`/users/${mentor.user.username}`"
                    class="flex items-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group border border-amber-200"
                  >
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    >
                      <span class="text-white font-semibold text-xs">
                        {{ getUserInitials(mentor.user.fullName) }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 text-sm truncate group-hover:text-yellow-600">
                        {{ mentor.user.fullName }}
                      </h4>
                      <p class="text-xs text-gray-500 truncate">
                        {{ mentor.expertiseAreas?.slice(0, 2).join(', ') }}
                      </p>
                    </div>
                    <ChevronRightIcon size="16" class="text-gray-400 group-hover:text-yellow-600" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Form Modal -->
    <div
      v-if="showApplicationForm"
      class="fixed inset-0 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
      @click="closeApplicationForm"
    >
      <div
        class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-black ring-opacity-5"
        @click.stop
      >
        <!-- Application Form Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ authStore.isMentor ? 'Apply as Mentor' : 'Apply as Volunteer' }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">{{ project.name }}</p>
          </div>
          <button
            @click="closeApplicationForm"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size="20" class="text-gray-500" />
          </button>
        </div>

        <!-- Application Form Content -->
        <form @submit.prevent="submitApplication" class="p-6 space-y-6">
          <!-- Application Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Application Message <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="applicationForm.applicationMessage"
              rows="5"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              :placeholder="authStore.isMentor 
                ? 'Tell us about your experience and how you can help mentor this project...' 
                : 'Tell us why you want to join this project and what you can contribute...'"
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Minimum 50 characters ({{ applicationForm.applicationMessage.length }}/50)
            </p>
          </div>

          <!-- Expertise Areas (Mentor Only) -->
          <div v-if="authStore.isMentor">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expertise Areas <span class="text-red-500">*</span>
            </label>
            <div class="space-y-3">
              <div class="flex gap-2">
                <input
                  v-model="newExpertise"
                  type="text"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Backend Development, Node.js"
                  @keypress.enter.prevent="addExpertise"
                />
                <button
                  type="button"
                  @click="addExpertise"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon size="20" />
                </button>
              </div>
              <div v-if="applicationForm.expertiseAreas.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(expertise, index) in applicationForm.expertiseAreas"
                  :key="index"
                  class="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                >
                  {{ expertise }}
                  <button
                    type="button"
                    @click="removeExpertise(index)"
                    class="ml-2 hover:text-primary-900"
                  >
                    <XIcon size="14" />
                  </button>
                </span>
              </div>
              <p class="text-xs text-gray-500">
                Add at least 2 areas of expertise ({{ applicationForm.expertiseAreas.length }}/2)
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="applicationError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start">
              <InfoIcon size="20" class="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-red-700">{{ applicationError }}</p>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="applicationSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-start">
              <CheckCircleIcon size="20" class="text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-green-700">{{ applicationSuccess }}</p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeApplicationForm"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              :disabled="isSubmittingApplication"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              :disabled="!canSubmitApplication || isSubmittingApplication"
            >
              <LoaderIcon
                v-if="isSubmittingApplication"
                size="20"
                class="animate-spin mr-2"
              />
              {{ isSubmittingApplication ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  project: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  join: [projectId: string];
}>();

const authStore = useAuthStore();
const config = useRuntimeConfig();
const isJoining = ref(false);

// Application form state
const showApplicationForm = ref(false);
const isSubmittingApplication = ref(false);
const applicationError = ref('');
const applicationSuccess = ref('');
const newExpertise = ref('');

interface ApplicationForm {
  applicationMessage: string;
  expertiseAreas: string[];
}

const applicationForm = reactive<ApplicationForm>({
  applicationMessage: '',
  expertiseAreas: [],
});

// Swiper instances
const mainSwiper = ref<SwiperType | null>(null);
const modules = [Navigation, Pagination, Autoplay];

const setMainSwiper = (swiper: SwiperType) => {
  mainSwiper.value = swiper;
};

// Generate dummy images from picsum.photos
const generateDummyImages = () => {
  const dummyCount = 5;
  return Array.from({ length: dummyCount }, (_, index) => ({
    url: `https://picsum.photos/seed/${props.project?.id || 'default'}-${index}/800/450`,
    caption: `Project Image ${index + 1}`,
    type: 'screenshot' as const
  }));
};

// Display images (use actual images or generate dummy ones)
const displayImages = computed(() => {
  if (props.project?.images && props.project.images.length > 0) {
    return props.project.images;
  }
  return generateDummyImages();
});

// Computed properties for better data handling
const creatorName = computed(() => {
  return props.project?.creator?.fullName || props.project?.creator?.username || 'Unknown User';
});

const projectStatusValue = computed(() => {
  return props.project?.status || 'active';
});

const projectStatus = computed(() => {
  const labels: Record<string, string> = {
    active: 'Active',
    in_progress: 'In Progress',
    completed: 'Completed',
    paused: 'Paused',
  };
  return labels[projectStatusValue.value] || 'Active';
});

const statusBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    active: 'bg-green-600 text-white',
    in_progress: 'bg-blue-600 text-white',
    completed: 'bg-gray-600 text-white',
    paused: 'bg-yellow-600 text-white',
  };
  return classes[projectStatusValue.value] || 'bg-green-600 text-white';
});

const projectLevel = computed(() => {
  const level = props.project?.level || 'intermediate';
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return labels[level] || 'Intermediate';
});

const projectDuration = computed(() => {
  if (!props.project?.startDate || !props.project?.endDate) return 'N/A';
  
  const start = new Date(props.project.startDate);
  const end = new Date(props.project.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  if (diffMonths < 2) return '1 month';
  if (diffMonths < 4) return '2-3 months';
  if (diffMonths < 7) return '3-6 months';
  return '6+ months';
});

const teamProgress = computed(() => {
  if (!props.project) return 0;
  const needed = props.project.volunteersNeeded || 0;
  const current = props.project.volunteerCount || 0;
  if (needed === 0) return 0;
  return Math.round((current / needed) * 100);
});

const projectCategories = computed(() => {
  return props.project?.categories || [];
});

const requiredSkills = computed(() => {
  return props.project?.skills?.filter((skill: any) => skill.isMandatory) || [];
});

const optionalSkills = computed(() => {
  return props.project?.skills?.filter((skill: any) => !skill.isMandatory) || [];
});

const projectVolunteers = computed(() => {
  return props.project?.volunteers || [];
});

const projectMentors = computed(() => {
  return props.project?.mentors || [];
});

const mentorsCount = computed(() => {
  return projectMentors.value.length;
});

const canJoinProject = computed(() => {
  // Project owner cannot join their own project
  if (authStore.isProjectCreator) return false;
  // Only allow joining when project status is 'active'
  return projectStatusValue.value === 'active';
});

const canSubmitApplication = computed(() => {
  const hasMessage = applicationForm.applicationMessage.length >= 50;
  if (authStore.isMentor) {
    return hasMessage && applicationForm.expertiseAreas.length >= 2;
  }
  return hasMessage;
});

const joinButtonText = computed(() => {
  if (authStore.isMentor) return 'Join as Mentor';
  if (authStore.isVolunteer) return 'Join as Volunteer';
  return 'Join Project';
});

const isBookmarked = computed(() => {
  return authStore.isBookmarked(props.project?.id);
});

// Helper methods
const getUserInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const toggleBookmark = () => {
  if (!authStore.isAuthenticated) {
    emit('close');
    navigateTo('/login');
    return;
  }

  authStore.toggleBookmark(props.project.id);
};

// Application form methods
const openApplicationForm = () => {
  if (!authStore.isAuthenticated) {
    emit('close');
    navigateTo('/login');
    return;
  }
  showApplicationForm.value = true;
  applicationError.value = '';
  applicationSuccess.value = '';
};

const closeApplicationForm = () => {
  showApplicationForm.value = false;
  applicationForm.applicationMessage = '';
  applicationForm.expertiseAreas = [];
  newExpertise.value = '';
  applicationError.value = '';
  applicationSuccess.value = '';
};

const addExpertise = () => {
  const expertise = newExpertise.value.trim();
  if (expertise && !applicationForm.expertiseAreas.includes(expertise)) {
    applicationForm.expertiseAreas.push(expertise);
    newExpertise.value = '';
  }
};

const removeExpertise = (index: number) => {
  applicationForm.expertiseAreas.splice(index, 1);
};

const submitApplication = async () => {
  if (!canSubmitApplication.value || isSubmittingApplication.value) return;

  isSubmittingApplication.value = true;
  applicationError.value = '';
  applicationSuccess.value = '';

  try {
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1';
    const endpoint = authStore.isMentor
      ? `/projects/${props.project.id}/mentors/apply`
      : `/projects/${props.project.id}/volunteers/apply`;

    const body = authStore.isMentor
      ? {
          applicationMessage: applicationForm.applicationMessage,
          expertiseAreas: applicationForm.expertiseAreas,
        }
      : {
          applicationMessage: applicationForm.applicationMessage,
        };

    // Get token from localStorage
    let token: string | null = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('auth_token');
    }

    const response = await $fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body,
    });

    applicationSuccess.value = `Application submitted successfully! You'll be notified once the project creator reviews your application.`;
    
    // Close form after 2 seconds
    setTimeout(() => {
      closeApplicationForm();
      // Optionally refresh project data
      emit('close');
    }, 2000);
  } catch (error: any) {
    console.error('Application submission error:', error);
    
    // Handle different error formats
    if (error.data?.message) {
      applicationError.value = error.data.message;
    } else if (error.message) {
      applicationError.value = error.message;
    } else {
      applicationError.value = 'An error occurred while submitting your application. Please try again.';
    }
  } finally {
    isSubmittingApplication.value = false;
  }
};

// Close modal on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close');
    }
  };
  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
/* Custom scrollbar for modal content */
.modal-scrollable {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.modal-scrollable::-webkit-scrollbar {
  width: 8px;
}

.modal-scrollable::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-scrollable::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-scrollable::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Badge animations */
@keyframes badge-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-badge-pulse {
  animation: badge-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Swiper pagination styling */
:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
  opacity: 1;
}

/* Swiper navigation buttons hover */
.swiper-button-prev-custom:hover,
.swiper-button-next-custom:hover {
  transform: translateY(-50%) scale(1.1);
}
</style>
