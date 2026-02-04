<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Project Management</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage platform projects, verify submissions, and moderate content
          </p>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search -->
    <div class="mb-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or description..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @change="handleFilter"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label for="verified" class="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
          <select
            id="verified"
            v-model="selectedVerified"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @change="handleFilter"
          >
            <option value="">All Projects</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>
        </div>
        
        <div>
          <label for="limit" class="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
          <select
            id="limit"
            v-model="itemsPerPage"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @change="handleLimitChange"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="bg-white shadow-sm rounded-lg border border-gray-200 p-12">
      <div class="flex justify-center items-center">
        <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-gray-600">Loading projects...</span>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error loading projects</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchProjects"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
    
    <!-- Projects Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creator
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volunteers
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="projects.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>{{ searchQuery || selectedStatus || selectedVerified ? 'No projects match your filters' : 'No projects found' }}</p>
              </td>
            </tr>
            <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-start">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                    <div class="text-sm text-gray-500 mt-1 line-clamp-2">{{ project.description }}</div>
                    <div class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="category in project.categories?.slice(0, 2)"
                        :key="category.id"
                        class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {{ category.icon }} {{ category.name }}
                      </span>
                      <span
                        v-if="project.categories && project.categories.length > 2"
                        class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded"
                      >
                        +{{ project.categories.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      v-if="project.creator?.avatarUrl"
                      :src="project.creator.avatarUrl"
                      :alt="project.creator.fullName"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <span class="text-green-600 font-medium text-xs">
                        {{ project.creator?.fullName?.charAt(0)?.toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ project.creator?.fullName }}</div>
                    <div class="text-xs text-gray-500">@{{ project.creator?.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-gray-100 text-gray-800': project.status === 'draft',
                    'bg-blue-100 text-blue-800': project.status === 'active',
                    'bg-green-100 text-green-800': project.status === 'completed',
                    'bg-red-100 text-red-800': project.status === 'cancelled'
                  }"
                >
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ project.volunteerCount || 0 }} / {{ project.volunteersNeeded || 0 }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleVerification(project)"
                  :disabled="verifyingIds.includes(project.id)"
                  class="relative inline-flex items-center"
                  :class="verifyingIds.includes(project.id) ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <span
                    v-if="project.isVerified"
                    class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Verified
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Unverified
                  </span>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewProject(project)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                  title="View Details"
                >
                  <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(project)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                  title="Delete Project"
                >
                  <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="goToPage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="goToPage(pagination.page + 1)"
                  :disabled="pagination.page === pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Project Detail Modal -->
    <div
      v-if="selectedProject"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="selectedProject = null"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="selectedProject = null"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-2xl font-bold text-gray-900">Project Details</h3>
              <button
                @click="selectedProject = null"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <h4 class="text-xl font-semibold text-gray-900">{{ selectedProject.name }}</h4>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-gray-100 text-gray-800': selectedProject.status === 'draft',
                      'bg-blue-100 text-blue-800': selectedProject.status === 'active',
                      'bg-green-100 text-green-800': selectedProject.status === 'completed',
                      'bg-red-100 text-red-800': selectedProject.status === 'cancelled'
                    }"
                  >
                    {{ selectedProject.status }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="selectedProject.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ selectedProject.isVerified ? 'Verified' : 'Unverified' }}
                  </span>
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {{ selectedProject.level }}
                  </span>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Description</h5>
                <p class="text-gray-900">{{ selectedProject.description }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h5 class="text-sm font-medium text-gray-700 mb-1">Start Date</h5>
                  <p class="text-gray-900">{{ formatDate(selectedProject.startDate) }}</p>
                </div>
                <div>
                  <h5 class="text-sm font-medium text-gray-700 mb-1">End Date</h5>
                  <p class="text-gray-900">{{ formatDate(selectedProject.endDate) }}</p>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Creator</h5>
                <div class="flex items-center mt-2">
                  <img
                    v-if="selectedProject.creator?.avatarUrl"
                    :src="selectedProject.creator.avatarUrl"
                    :alt="selectedProject.creator.fullName"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <span class="text-green-600 font-bold text-sm">
                      {{ selectedProject.creator?.fullName?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ selectedProject.creator?.fullName }}</p>
                    <p class="text-xs text-gray-500">@{{ selectedProject.creator?.username }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="selectedProject.categories && selectedProject.categories.length > 0">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Categories</h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="category in selectedProject.categories"
                    :key="category.id"
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg"
                  >
                    {{ category.icon }} {{ category.name }}
                  </span>
                </div>
              </div>
              
              <div v-if="selectedProject.skills && selectedProject.skills.length > 0">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Skills Required</h5>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in selectedProject.skills"
                    :key="skill.id"
                    class="px-3 py-1 text-sm rounded-lg"
                    :class="skill.isMandatory ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
                  >
                    {{ skill.icon }} {{ skill.name }}
                    <span v-if="skill.isMandatory" class="ml-1 text-xs">*</span>
                  </span>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Volunteers</h5>
                <p class="text-gray-900">{{ selectedProject.volunteerCount || 0 }} / {{ selectedProject.volunteersNeeded || 0 }} volunteers</p>
              </div>
              
              <div v-if="selectedProject.links">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Links</h5>
                <div class="flex space-x-3">
                  <a
                    v-if="selectedProject.links.github"
                    :href="selectedProject.links.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    v-if="selectedProject.links.figma"
                    :href="selectedProject.links.figma"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"/>
                      <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z"/>
                      <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z"/>
                      <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z"/>
                      <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z"/>
                    </svg>
                    Figma
                  </a>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Project ID</h5>
                <p class="text-xs text-gray-500 font-mono">{{ selectedProject.id }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              @click="toggleVerification(selectedProject)"
              :disabled="verifyingIds.includes(selectedProject.id)"
              :class="[
                'w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors',
                selectedProject.isVerified
                  ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500'
                  : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500',
                verifyingIds.includes(selectedProject.id) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              {{ verifyingIds.includes(selectedProject.id) ? 'Processing...' : (selectedProject.isVerified ? 'Unverify Project' : 'Verify Project') }}
            </button>
            <button
              @click="selectedProject = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Project {
  id: string
  name: string
  description: string
  status: string
  level: string
  volunteersNeeded: number
  volunteerCount: number
  startDate: string
  endDate: string
  isVerified: boolean
  createdAt: string
  creator?: {
    id: string
    username: string
    fullName: string
    avatarUrl: string | null
  }
  categories?: Array<{
    id: string
    name: string
    icon: string
  }>
  skills?: Array<{
    id: string
    name: string
    icon: string
    isMandatory: boolean
  }>
  links?: {
    github?: string
    figma?: string
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const allProjects = ref<Project[]>([])
const loading = ref(false)
const error = ref('')
const selectedProject = ref<Project | null>(null)
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedVerified = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const verifyingIds = ref<string[]>([])

// Client-side filtering
const filteredProjects = computed(() => {
  let filtered = allProjects.value
  
  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.status === selectedStatus.value)
  }
  
  // Filter by verified status
  if (selectedVerified.value) {
    const isVerified = selectedVerified.value === 'true'
    filtered = filtered.filter(project => project.isVerified === isVerified)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.creator?.fullName?.toLowerCase().includes(query) ||
      project.creator?.username?.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Paginated projects from filtered results
const projects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProjects.value.slice(start, end)
})

// Pagination computed from filtered results
const pagination = computed<Pagination>(() => {
  const total = filteredProjects.value.length
  const totalPages = Math.ceil(total / itemsPerPage.value)
  
  return {
    total,
    page: currentPage.value,
    limit: itemsPerPage.value,
    totalPages: totalPages || 1
  }
})

// Fetch projects from API
const fetchProjects = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    // Fetch with large limit to get all projects for client-side filtering
    const queryParams = new URLSearchParams({
      page: '1',
      limit: '1000'
    })
    
    const response = await $fetch(`${baseURL}/projects?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (response && response.data) {
      allProjects.value = response.data
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'An error occurred while fetching projects'
    console.error('Error fetching projects:', err)
  } finally {
    loading.value = false
  }
}

// Toggle project verification
const toggleVerification = async (project: Project) => {
  if (verifyingIds.value.includes(project.id)) return
  
  verifyingIds.value.push(project.id)
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    await $fetch(`${baseURL}/projects/${project.id}/verify`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isVerified: !project.isVerified
      })
    })
    
    // Update local state
    project.isVerified = !project.isVerified
    
    // If modal is open, update selected project
    if (selectedProject.value && selectedProject.value.id === project.id) {
      selectedProject.value.isVerified = project.isVerified
    }
    
    // Refresh projects list
    await fetchProjects()
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Failed to update verification status'
    alert(`Error: ${errorMessage}`)
    console.error('Error updating verification:', err)
  } finally {
    verifyingIds.value = verifyingIds.value.filter(id => id !== project.id)
  }
}

// Delete project
const deleteProject = async (projectId: string) => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    await $fetch(`${baseURL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    // Close modal if open
    if (selectedProject.value && selectedProject.value.id === projectId) {
      selectedProject.value = null
    }
    
    // Refresh projects list
    await fetchProjects()
    
    alert('Project deleted successfully')
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Failed to delete project'
    alert(`Error deleting project: ${errorMessage}`)
    console.error('Error deleting project:', err)
  }
}

// Confirm delete
const confirmDelete = (project: Project) => {
  if (confirm(`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`)) {
    deleteProject(project.id)
  }
}

// View project details
const viewProject = (project: Project) => {
  selectedProject.value = project
}

// Handle search (client-side, no API call)
let searchTimeout: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

// Handle filter change (client-side, no API call)
const handleFilter = () => {
  currentPage.value = 1
}

// Handle limit change (client-side, no API call)
const handleLimitChange = () => {
  currentPage.value = 1
}

// Go to page (client-side pagination, no API call)
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    currentPage.value = page
  }
}

// Compute visible pages for pagination
const visiblePages = computed(() => {
  const pages: number[] = []
  const totalPages = pagination.value.totalPages
  const current = pagination.value.page
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push(totalPages)
    } else if (current >= totalPages - 2) {
      pages.push(1)
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(totalPages)
    }
  }
  
  return pages
})

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load projects on mount
onMounted(() => {
  fetchProjects()
})
</script>
