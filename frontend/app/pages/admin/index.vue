<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600">
        Manage your platform's users, projects, categories, and skills
      </p>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ stats.users }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3">
          <NuxtLink to="/admin/users" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all →
          </NuxtLink>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ stats.projects }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3">
          <NuxtLink to="/admin/projects" class="text-sm font-medium text-green-600 hover:text-green-500">
            View all →
          </NuxtLink>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ stats.categories }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3">
          <NuxtLink to="/admin/categories" class="text-sm font-medium text-yellow-600 hover:text-yellow-500">
            View all →
          </NuxtLink>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Skills</dt>
                <dd class="text-2xl font-semibold text-gray-900">{{ stats.skills }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-3">
          <NuxtLink to="/admin/skills" class="text-sm font-medium text-purple-600 hover:text-purple-500">
            View all →
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          to="/admin/users"
          class="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <svg class="h-8 w-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Manage Users</p>
            <p class="text-xs text-gray-500">View and edit users</p>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/projects"
          class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <svg class="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Manage Projects</p>
            <p class="text-xs text-gray-500">View and edit projects</p>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/categories"
          class="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <svg class="h-8 w-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Manage Categories</p>
            <p class="text-xs text-gray-500">Add or edit categories</p>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/skills"
          class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <svg class="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Manage Skills</p>
            <p class="text-xs text-gray-500">Add or edit skills</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Recent Activity (placeholder) -->
    <div class="mt-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Activity tracking coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const stats = reactive({
  users: 0,
  projects: 0,
  categories: 0,
  skills: 0
})

// Load stats on mount
onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    // Fetch users count
    const usersData = await $fetch(`${baseURL}/users?limit=1`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    if (usersData && usersData.data) {
      stats.users = usersData.data.pagination.total
    }
    
    // Fetch projects count
    try {
      const projectsData = await $fetch(`${baseURL}/projects?limit=1`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (projectsData && projectsData.meta) {
        stats.projects = projectsData.meta.total
      }
    } catch (err) {
      console.error('Error fetching projects count:', err)
    }
    
    // Fetch categories count
    try {
      const categoriesData = await $fetch(`${baseURL}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (categoriesData && categoriesData.data) {
        stats.categories = categoriesData.data.length
      }
    } catch (err) {
      console.error('Error fetching categories count:', err)
    }
    
    // Fetch skills count
    try {
      const skillsData = await $fetch(`${baseURL}/skills`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      if (skillsData && skillsData.data) {
        stats.skills = skillsData.data.length
      }
    } catch (err) {
      console.error('Error fetching skills count:', err)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
})
</script>
