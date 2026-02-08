<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Loading profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/explore" class="btn btn-primary btn-md">
          ← Back to Explore
        </NuxtLink>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userProfile" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 sm:mb-8 transition-all hover:shadow-3xl">
        <!-- Cover Image with Pattern Overlay -->
        <div class="relative h-32 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br" :class="coverGradient">
          <!-- Animated Background Pattern -->
          <div class="absolute inset-0 opacity-20">
            <div class="absolute inset-0 bg-grid-pattern"></div>
          </div>
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          
          <!-- Floating Decorative Elements -->
          <div class="absolute top-4 right-4 sm:top-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full backdrop-blur-sm animate-float-slow"></div>
          <div class="absolute bottom-8 left-8 w-12 h-12 sm:w-20 sm:h-20 bg-white/5 rounded-full backdrop-blur-sm animate-float-slower"></div>
        </div>

        <!-- Profile Info -->
        <div class="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <!-- Avatar & Quick Actions Row -->
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16 lg:-mt-20">
            <!-- Avatar Section -->
            <div class="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div class="relative group">
                <!-- Avatar with Glow Effect -->
                <div class="absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" :class="roleBadgeColor"></div>
                <img
                  :src="userProfile.avatar"
                  :alt="userProfile.name"
                  class="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-3xl border-4 sm:border-[6px] border-white shadow-2xl object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <!-- Name & Role (Mobile: Below Avatar, Desktop: Beside Avatar) -->
              <div class="sm:mb-4">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {{ userProfile.name }}
                </h1>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm border-2"
                    :class="roleBadgeFullClass"
                  >
                    <component :is="roleIconComponent" size="16" class="mr-1.5" />
                    {{ roleLabel }}
                  </span>
                  <span v-if="userProfile.organization && userProfile.organization.name" class="inline-flex items-center text-gray-600 text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                    <img v-if="userProfile.organization.logoUrl" :src="userProfile.organization.logoUrl" :alt="userProfile.organization.name" class="w-4 h-4 mr-1.5 rounded object-cover" />
                    <BriefcaseIcon v-else size="14" class="mr-1.5" />
                    <span class="font-semibold">{{ userProfile.organization.name }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Social Links & Edit Button - Desktop -->
            <div class="hidden sm:flex items-center gap-2 sm:gap-3 mb-4">
              <!-- Edit Profile Button (Only for own profile) -->
              <button
                v-if="isOwnProfile"
                @click="openEditModal"
                class="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="text-sm font-medium hidden lg:inline">Edit Profile</span>
              </button>
              <a
                v-if="userProfile.github"
                :href="userProfile.github"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <GithubIcon size="18" />
                <span class="text-sm font-medium hidden lg:inline">GitHub</span>
              </a>
              <a
                v-if="userProfile.linkedin"
                :href="userProfile.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <LinkedinIcon size="18" />
                <span class="text-sm font-medium hidden lg:inline">LinkedIn</span>
              </a>
            </div>
          </div>

          <!-- Bio Section -->
          <div class="mt-6 sm:mt-8">
            <p class="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl">
              {{ userProfile.bio }}
            </p>
          </div>

          <!-- Footer Info Row -->
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100">
            <!-- Member Since -->
            <div class="flex items-center gap-6">
              <div class="flex items-center text-sm text-gray-600">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-3">
                  📅
                </div>
                <div>
                  <div class="text-xs text-gray-500 font-medium">Member Since</div>
                  <div class="text-sm font-semibold text-gray-900">{{ formatDate(userProfile.created_at) }}</div>
                </div>
              </div>
            </div>

            <!-- Social Links & Edit Button - Mobile -->
            <div class="sm:hidden space-y-2">
              <!-- Edit Profile Button (Mobile - Only for own profile) -->
              <button
                v-if="isOwnProfile"
                @click="openEditModal"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-colors"
              >
                <span class="text-lg">✏️</span>
                <span class="text-sm font-medium">Edit Profile</span>
              </button>
              
              <div class="flex items-center gap-2">
                <a
                  v-if="userProfile.github"
                  :href="userProfile.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg transition-colors"
                >
                  <span class="text-lg">📁</span>
                  <span class="text-sm font-medium">GitHub</span>
                </a>
                <a
                  v-if="userProfile.linkedin"
                  :href="userProfile.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-colors"
                >
                  <span class="text-lg">💼</span>
                  <span class="text-sm font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Role-Specific Content -->
      <div v-if="isVolunteer">
        <ProfileVolunteerProfile 
          :user="userProfile" 
          :stats="volunteerStats" 
          :projects="volunteerProjects" 
          :active-projects="activeVolunteerProjects"
          :pending-projects="pendingVolunteerProjects"
          :rejected-projects="rejectedVolunteerProjects"
          :is-own-profile="isOwnProfile"
        />
      </div>

      <div v-else-if="isMentor">
        <ProfileMentorProfile 
          :user="userProfile" 
          :stats="mentorStats" 
          :projects="mentoredProjects" 
          :pending-projects="pendingMentorProjects"
          :rejected-projects="rejectedMentorProjects"
          :reviews="userProfile.reviews || []" 
          :achievements="userProfile.achievements || []"
          :is-own-profile="isOwnProfile"
        />
      </div>

      <div v-else-if="isProjectCreator">
        <ProfileProjectCreatorProfile :user="userProfile" :stats="creatorStats" :projects="createdProjects" />
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      :is-open="showEditModal"
      :user-data="userProfile"
      @close="closeEditModal"
      @update="handleProfileUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../../../composables/useApi'
import type { User } from '../../../stores/auth'
import EditProfileModal from '../../components/EditProfileModal.vue'

// Get username from route params
const route = useRoute()
const username = computed(() => route.params.id as string)

const api = useApi()

const isLoading = ref(true)
const error = ref('')
const userProfile = ref<any>(null)
const showEditModal = ref(false)
const isOwnProfile = ref(false)

// Stats
const volunteerStats = ref<any>(null)
const mentorStats = ref<any>(null)
const creatorStats = ref<any>(null)

// Projects
const volunteerProjects = ref<any[]>([])
const activeVolunteerProjects = ref<any[]>([])
const pendingVolunteerProjects = ref<any[]>([])
const rejectedVolunteerProjects = ref<any[]>([])
const mentoredProjects = ref<any[]>([])
const pendingMentorProjects = ref<any[]>([])
const rejectedMentorProjects = ref<any[]>([])
const createdProjects = ref<any[]>([])

// Computed
const isVolunteer = computed(() => userProfile.value?.role === 'volunteer')
const isMentor = computed(() => userProfile.value?.role === 'mentor')
const isProjectCreator = computed(() => userProfile.value?.role === 'project_owner')

const roleLabel = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'Volunteer'
    case 'mentor': return 'Mentor'
    case 'project_owner': return 'Project Owner'
    default: return 'User'
  }
})

const roleIcon = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'user'
    case 'mentor': return 'award'
    case 'project_owner': return 'briefcase'
    default: return 'user'
  }
})

const roleBadgeColor = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'bg-blue-500'
    case 'mentor': return 'bg-emerald-500'
    case 'project_owner': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
})

const roleBadgeClass = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'bg-blue-100 text-blue-700'
    case 'mentor': return 'bg-emerald-100 text-emerald-700'
    case 'project_owner': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
})

const roleBadgeFullClass = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    case 'mentor': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    case 'project_owner': return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
  }
})

const coverGradient = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'from-blue-500 via-indigo-500 to-purple-600'
    case 'mentor': return 'from-emerald-500 via-teal-500 to-cyan-600'
    case 'project_owner': return 'from-purple-500 via-pink-500 to-rose-600'
    default: return 'from-primary-500 via-purple-500 to-pink-500'
  }
})

const roleIconComponent = computed(() => {
  switch (userProfile.value?.role) {
    case 'volunteer': return 'UserIcon'
    case 'mentor': return 'AwardIcon'
    case 'project_owner': return 'BriefcaseIcon'
    default: return 'UserIcon'
  }
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const checkOwnProfile = () => {
  if (typeof localStorage === 'undefined') return false
  const authUser = localStorage.getItem('auth_user')
  if (!authUser || !userProfile.value) return false
  const currentUser = JSON.parse(authUser)
  isOwnProfile.value = currentUser.username === userProfile.value.username
}

const openEditModal = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleProfileUpdate = () => {
  // Reload profile data
  loadUserProfile()
}

const loadUserProfile = async () => {
  if (!username.value) {
    error.value = 'Username not found in URL'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Step 1 & 2: Get user data by username to check role
    const userResponse = await api.getUserByUsername(username.value)
    
    if (!userResponse.data) {
      error.value = 'User not found'
      return
    }

    const user = userResponse.data

    // Step 3: Load role-specific data based on role
    if (user.role === 'volunteer') {
      // Hit volunteer-specific endpoint
      const volunteerResponse = await api.getUserVolunteerProfile(username.value)
      
      if (!volunteerResponse.data) {
        error.value = 'Volunteer profile not found'
        return
      }

      const volunteerData = volunteerResponse.data

      // Map API response to local user object
      userProfile.value = {
        id: volunteerData.id,
        name: volunteerData.fullName,
        username: volunteerData.username,
        role: volunteerData.role,
        avatar: volunteerData.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(volunteerData.fullName),
        bio: volunteerData.bio,
        organization: volunteerData.organization || null,
        github: volunteerData.socialLinks?.github || '',
        linkedin: volunteerData.socialLinks?.linkedin || '',
        twitter: volunteerData.socialLinks?.twitter || '',
        created_at: volunteerData.createdAt,
        skills: volunteerData.skills || [],
        interests: volunteerData.interests || [],
        achievements: volunteerData.achievements || []
      }

      // Map volunteer stats
      if (volunteerData.stats) {
        volunteerStats.value = {
          totalProjects: volunteerData.stats.totalProjects || 0,
          totalContributions: volunteerData.stats.totalContributions || 0,
          totalTasksCompleted: volunteerData.stats.totalTasksCompleted || 0,
          averageScore: volunteerData.stats.averageScore || 0,
          rank: volunteerData.stats.rank || 'New Contributor',
          activeSince: volunteerData.stats.activeSince || volunteerData.createdAt
        }
      }

      // Map project contributions
      if (volunteerData.projectContributions) {
        volunteerProjects.value = volunteerData.projectContributions.map((contrib: any) => ({
          id: contrib.projectId,
          name: contrib.projectName,
          description: contrib.projectDescription,
          status: contrib.projectStatus,
          tags: contrib.projectTags || [],
          contribution_score: contrib.contributionScore || 0,
          joined_at: contrib.joinedAt,
          tasks_completed: contrib.tasksCompleted || 0,
          tasks_total: contrib.tasksTotal || 0
        }))
      }

      // Map active projects
      if (volunteerData.activeProjects) {
        activeVolunteerProjects.value = volunteerData.activeProjects
      }

      // Map pending projects
      if (volunteerData.pendingProjects) {
        pendingVolunteerProjects.value = volunteerData.pendingProjects
      }

      // Map rejected projects
      if (volunteerData.rejectedProjects) {
        rejectedVolunteerProjects.value = volunteerData.rejectedProjects
      }
    } 
    else if (user.role === 'project_owner') {
      // Map API response to local user object
      userProfile.value = {
        id: user.id,
        name: user.fullName,
        username: user.username,
        role: user.role,
        avatar: user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.fullName),
        bio: user.bio,
        organization: user.organization || null,
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        twitter: user.socialLinks?.twitter || '',
        created_at: user.createdAt,
        skills: []
      }

      // Get projects by creator
      const projectsResponse = await api.getProjectsByCreator(user.id)
      if (projectsResponse.data) {
        createdProjects.value = projectsResponse.data
      }

      // Get user statistics
      const statsResponse = await api.getUserStatistics(user.id)
      if (statsResponse.data?.creator) {
        const stats = statsResponse.data.creator
        creatorStats.value = {
          totalProjects: stats.projects?.total || 0,
          totalVolunteers: stats.team?.totalVolunteers || 0,
          completedProjects: stats.projects?.completed || 0,
          activeProjects: stats.projects?.active || 0,
          draftProjects: stats.projects?.draft || 0,
          verifiedProjects: stats.projects?.verified || 0,
          completionRate: stats.projects?.completionRate || 0,
          totalMentors: stats.team?.totalMentors || 0,
          totalTeamMembers: stats.team?.totalTeamMembers || 0,
          tasksTotal: stats.tasks?.total || 0,
          tasksCompleted: stats.tasks?.completed || 0,
          tasksInProgress: stats.tasks?.inProgress || 0,
          tasksTodo: stats.tasks?.todo || 0,
          tasksCompletionRate: stats.tasks?.completionRate || 0,
          milestonesTotal: stats.milestones?.total || 0,
          milestonesCompleted: stats.milestones?.completed || 0,
          milestonesCompletionRate: stats.milestones?.completionRate || 0,
          mostActiveProject: stats.mostActiveProject || null
        }
      }
    } 
    else if (user.role === 'mentor') {
      // Hit mentor-specific endpoint
      const mentorResponse = await api.getUserMentorProfile(username.value)
      
      if (!mentorResponse.data) {
        error.value = 'Mentor profile not found'
        return
      }

      const mentorData = mentorResponse.data

      // Map API response to local user object
      userProfile.value = {
        id: mentorData.id,
        name: mentorData.fullName,
        username: mentorData.username,
        role: mentorData.role,
        avatar: mentorData.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mentorData.fullName),
        bio: mentorData.bio,
        organization: mentorData.organization || null,
        github: mentorData.socialLinks?.github || '',
        linkedin: mentorData.socialLinks?.linkedin || '',
        twitter: mentorData.socialLinks?.twitter || '',
        created_at: mentorData.createdAt,
        skills: mentorData.skills || [],
        interests: mentorData.interests || [],
        achievements: mentorData.achievements || [],
        reviews: mentorData.reviews || [],
        // Mentor specific fields from stats
        rating: mentorData.stats?.rating || 0,
        total_reviews: mentorData.stats?.totalReviews || 0,
        projects_mentored: mentorData.stats?.projectsMentored || 0,
        // These fields are not in API, use defaults or calculate
        availability: 'available', // Default value
        experience_years: 'N/A', // Not in API
        current_mentees: mentorData.mentoredProjects?.filter((p: any) => p.projectStatus === 'in_progress' || p.projectStatus === 'active').reduce((sum: number, p: any) => sum + (p.volunteersGuided || 0), 0) || 0,
        max_mentees: 50 // Default value
      }

      // Fetch mentor statistics from new endpoint
      const statsResponse = await api.getUserStatistics(mentorData.id)
      if (statsResponse.data?.mentor) {
        const stats = statsResponse.data.mentor
        mentorStats.value = {
          totalProjects: stats.projects?.total || 0,
          activeProjects: stats.projects?.active || 0,
          completedProjects: stats.projects?.completed || 0,
          pendingProjects: stats.projects?.pending || 0,
          leftProjects: stats.projects?.left || 0,
          totalMentees: stats.mentoring?.totalMentees || 0,
          currentActiveProjects: stats.mentoring?.activeProjects || [],
          activeSince: formatDate(mentorData.createdAt)
        }
      } else {
        // Fallback to old structure if new endpoint fails
        if (mentorData.stats) {
          mentorStats.value = {
            totalProjects: mentorData.stats.projectsMentored || 0,
            totalVolunteersGuided: mentorData.mentoredProjects?.reduce((sum: number, p: any) => sum + (p.volunteersGuided || 0), 0) || 0,
            totalTasksCreated: mentorData.stats.totalTasksCreated || 0,
            activeSince: formatDate(mentorData.stats.activeSince || mentorData.createdAt),
            currentActiveProjects: []
          }
        }
      }

      // Map mentored projects
      if (mentorData.mentoredProjects) {
        mentoredProjects.value = mentorData.mentoredProjects.map((project: any) => ({
          id: project.projectId,
          name: project.projectName,
          description: project.projectDescription,
          status: project.projectStatus,
          tags: project.projectTags || [],
          volunteersGuided: project.volunteersGuided || 0,
          tasksCreated: project.tasksCreated || 0,
          joined_at: project.joinedAsmentorAt,
          volunteers_needed: project.volunteersNeeded || 0,
          volunteers_joined: Math.floor((project.volunteersNeeded || 0) * 0.6), // Calculate approximate joined
          difficulty: 'Intermediate' // Default value as not in API
        }))
      }

      // Map pending projects
      if (mentorData.pendingProjects) {
        pendingMentorProjects.value = mentorData.pendingProjects.map((project: any) => ({
          id: project.projectId,
          name: project.projectName,
          description: project.projectDescription,
          status: project.projectStatus,
          tags: project.projectTags || [],
          volunteersGuided: project.volunteersGuided || 0,
          tasksCreated: project.tasksCreated || 0,
          joined_at: project.joinedAsmentorAt,
          volunteers_needed: project.volunteersNeeded || 0,
          volunteers_joined: Math.floor((project.volunteersNeeded || 0) * 0.6),
          difficulty: 'Intermediate'
        }))
      }

      // Map rejected projects
      if (mentorData.rejectedProjects) {
        rejectedMentorProjects.value = mentorData.rejectedProjects.map((project: any) => ({
          id: project.projectId,
          name: project.projectName,
          description: project.projectDescription,
          status: project.projectStatus,
          tags: project.projectTags || [],
          volunteersGuided: project.volunteersGuided || 0,
          tasksCreated: project.tasksCreated || 0,
          joined_at: project.joinedAsmentorAt,
          volunteers_needed: project.volunteersNeeded || 0,
          volunteers_joined: Math.floor((project.volunteersNeeded || 0) * 0.6),
          difficulty: 'Intermediate'
        }))
      }
    }
  } catch (err: any) {
    console.error('Error loading profile:', err)
    error.value = err.message || 'Failed to load profile'
  } finally {
    isLoading.value = false
    checkOwnProfile()
  }
}

// Lifecycle
onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
/* Background Grid Pattern */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Floating Animations */
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) translateX(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-30px) translateX(5px) rotate(3deg);
  }
}

@keyframes float-slower {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  33% {
    transform: translateY(-15px) translateX(-8px) scale(1.1);
  }
  66% {
    transform: translateY(-25px) translateX(8px) scale(0.9);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 10s ease-in-out infinite;
}

/* Shadow Utilities */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth Transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>