<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage platform users, view details, and moderate accounts
          </p>
        </div>
      </div>
    </div>
    
    <!-- Filters and Search -->
    <div class="mb-6 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by username or name..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
          <select
            id="role"
            v-model="selectedRole"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @change="handleFilter"
          >
            <option value="">All Roles</option>
            <option value="volunteer">Volunteer</option>
            <option value="mentor">Mentor</option>
            <option value="project_creator">Project Creator</option>
            <option value="admin">Admin</option>
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
            <option :value="100">100</option>
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
        <span class="ml-3 text-gray-600">Loading users...</span>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error loading users</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchUsers"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
    
    <!-- Users Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Social Links
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>{{ searchQuery || selectedRole ? 'No users match your filters' : 'No users found' }}</p>
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="user.avatarUrl"
                      :src="user.avatarUrl"
                      :alt="user.fullName"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                    >
                      <span class="text-indigo-600 font-medium text-sm">
                        {{ user.fullName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': user.role === 'volunteer',
                    'bg-purple-100 text-purple-800': user.role === 'mentor',
                    'bg-green-100 text-green-800': user.role === 'project_creator',
                    'bg-red-100 text-red-800': user.role === 'admin'
                  }"
                >
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <a
                    v-if="user.socialLinks?.github"
                    :href="user.socialLinks.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    title="GitHub"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a
                    v-if="user.socialLinks?.linkedin"
                    :href="user.socialLinks.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    title="LinkedIn"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <span v-if="!user.socialLinks?.github && !user.socialLinks?.linkedin" class="text-xs text-gray-400">
                    No links
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                  title="View Details"
                >
                  <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(user)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                  title="Delete User"
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
    
    <!-- User Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="selectedUser = null"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="selectedUser = null"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-2xl font-bold text-gray-900">User Details</h3>
              <button
                @click="selectedUser = null"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <img
                  v-if="selectedUser.avatarUrl"
                  :src="selectedUser.avatarUrl"
                  :alt="selectedUser.fullName"
                  class="h-20 w-20 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center"
                >
                  <span class="text-indigo-600 font-bold text-2xl">
                    {{ selectedUser.fullName.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedUser.fullName }}</h4>
                  <p class="text-gray-500">@{{ selectedUser.username }}</p>
                  <span
                    class="mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': selectedUser.role === 'volunteer',
                      'bg-purple-100 text-purple-800': selectedUser.role === 'mentor',
                      'bg-green-100 text-green-800': selectedUser.role === 'project_creator',
                      'bg-red-100 text-red-800': selectedUser.role === 'admin'
                    }"
                  >
                    {{ selectedUser.role.replace('_', ' ') }}
                  </span>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Bio</h5>
                <p class="text-gray-900">{{ selectedUser.bio || 'No bio provided' }}</p>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-2">Social Links</h5>
                <div class="flex space-x-3">
                  <a
                    v-if="selectedUser.socialLinks?.github"
                    :href="selectedUser.socialLinks.github"
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
                    v-if="selectedUser.socialLinks?.linkedin"
                    :href="selectedUser.socialLinks.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <span v-if="!selectedUser.socialLinks?.github && !selectedUser.socialLinks?.linkedin" class="text-sm text-gray-500">
                    No social links provided
                  </span>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">User ID</h5>
                <p class="text-xs text-gray-500 font-mono">{{ selectedUser.id }}</p>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-1">Member Since</h5>
                <p class="text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="selectedUser = null"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
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

interface User {
  id: string
  username: string
  fullName: string
  role: string
  avatarUrl: string | null
  bio: string
  socialLinks: {
    github?: string
    linkedin?: string
  }
  createdAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const allUsers = ref<User[]>([]) // Store all users from API
const loading = ref(false)
const error = ref('')
const selectedUser = ref<User | null>(null)
const searchQuery = ref('')
const selectedRole = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Client-side filtering
const filteredUsers = computed(() => {
  let filtered = allUsers.value
  
  // Filter by role
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.fullName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Paginated users from filtered results
const users = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Pagination computed from filtered results
const pagination = computed<Pagination>(() => {
  const total = filteredUsers.value.length
  const totalPages = Math.ceil(total / itemsPerPage.value)
  
  return {
    total,
    page: currentPage.value,
    limit: itemsPerPage.value,
    totalPages: totalPages || 1
  }
})

// Fetch users from API (fetch all at once for client-side filtering)
const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    // Fetch with large limit to get all users for client-side filtering
    const queryParams = new URLSearchParams({
      page: '1',
      limit: '1000' // Fetch up to 1000 users at once
    })
    
    const response = await $fetch(`${baseURL}/users?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (response && response.data) {
      allUsers.value = response.data.users
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'An error occurred while fetching users'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

// Delete user
const deleteUser = async (userId: string) => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000/api/v1'
    
    await $fetch(`${baseURL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    // Refresh users list
    await fetchUsers()
    
    alert('User deleted successfully')
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Failed to delete user'
    alert(`Error deleting user: ${errorMessage}`)
    console.error('Error deleting user:', err)
  }
}

// Confirm delete
const confirmDelete = (user: User) => {
  if (confirm(`Are you sure you want to delete user "${user.fullName}" (@${user.username})? This action cannot be undone.`)) {
    deleteUser(user.id)
  }
}

// View user details
const viewUser = (user: User) => {
  selectedUser.value = user
}

// Handle search (client-side, no API call)
let searchTimeout: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when searching
  }, 300)
}

// Handle filter change (client-side, no API call)
const handleFilter = () => {
  currentPage.value = 1 // Reset to first page when filtering
}

// Handle limit change (client-side, no API call)
const handleLimitChange = () => {
  currentPage.value = 1 // Reset to first page when changing limit
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

// Load users on mount
onMounted(() => {
  fetchUsers()
})
</script>
