<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Role-based Dashboard Components -->
    <VolunteerDashboard v-if="user?.role === 'volunteer'" />
    <ProjectCreatorDashboard v-else-if="user?.role === 'project_owner'" />
    <MentorDashboard v-else-if="user?.role === 'mentor'" />
    
    <!-- Fallback for unknown roles -->
    <div v-else class="text-center py-20">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Welcome to PortfolioHub</h1>
      <p class="text-gray-600 mb-6">Please complete your profile to access your dashboard.</p>
      <NuxtLink to="/onboarding" class="btn btn-primary btn-lg">
        Complete Setup
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components explicitly
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard.vue'
import ProjectCreatorDashboard from '../components/dashboard/ProjectCreatorDashboard.vue'
import MentorDashboard from '../components/dashboard/MentorDashboard.vue'

definePageMeta({
  middleware: ['auth', 'onboarding']
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// SEO
useHead({
  title: computed(() => {
    const roleLabels = {
      volunteer: 'Volunteer Dashboard',
      project_owner: 'Project Owner Dashboard',
      mentor: 'Mentor Dashboard'
    }
    return user.value?.role ? `${roleLabels[user.value.role]} - PortfolioHub` : 'Dashboard - PortfolioHub'
  }),
  meta: [
    {
      name: 'description',
      content: 'Your PortfolioHub dashboard - manage projects, tasks, and collaborations based on your role.'
    }
  ]
})
</script>