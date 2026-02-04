<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, Project Creator!
      </h1>
      <p class="text-gray-600 mt-2">
        Manage your projects, review volunteers, and track progress.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <FolderIcon size="24" class="text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">My Projects</p>
            <p class="text-2xl font-bold text-gray-900">5</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <UsersIcon size="24" class="text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Volunteers</p>
            <p class="text-2xl font-bold text-gray-900">23</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon size="24" class="text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending Reviews</p>
            <p class="text-2xl font-bold text-gray-900">7</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <CheckCircleIcon size="24" class="text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed Projects</p>
            <p class="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center space-x-4 mb-6">
      <button class="btn btn-primary btn-lg">
        <PlusIcon size="20" class="mr-2" />
        Create New Project
      </button>
      <NuxtLink to="/explore-mentors" class="btn btn-secondary btn-lg">
        <UserIcon size="20" class="mr-2" />
        Find Mentors
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Project Management -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">My Projects</h2>
          <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Create Project
          </button>
        </div>
        <div class="space-y-4">
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">Learning Platform</h3>
              <span class="badge badge-warning">in_progress</span>
            </div>
            
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center text-sm text-gray-500">
                <UsersIcon size="16" class="mr-1" />
                8/10 volunteers
              </div>
              <span class="text-sm text-gray-500">65% complete</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div class="bg-primary-500 h-2 rounded-full" style="width: 65%"></div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="btn btn-primary btn-sm">
                  Review Applications (3)
                </button>
                <NuxtLink to="/explore-mentors" class="btn btn-secondary btn-sm">
                  Assign Mentor
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">Environmental Tracker</h3>
              <span class="badge badge-success">open</span>
            </div>
            
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center text-sm text-gray-500">
                <UsersIcon size="16" class="mr-1" />
                4/8 volunteers
              </div>
              <span class="text-sm text-gray-500">25% complete</span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div class="bg-primary-500 h-2 rounded-full" style="width: 25%"></div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex space-x-2">
                <button class="btn btn-primary btn-sm">
                  Review Applications (5)
                </button>
                <NuxtLink to="/explore-mentors" class="btn btn-secondary btn-sm">
                  Assign Mentor
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Volunteer Applications -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Volunteer Applications</h2>
          <span class="text-sm text-gray-500">8 pending</span>
        </div>
        <div class="space-y-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-600 font-medium text-sm">JS</span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">John Smith</h3>
                  <p class="text-sm text-gray-600">Learning Platform</p>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-sm text-gray-600 mb-2">Skills:</p>
              <div class="flex flex-wrap gap-1">
                <span class="badge badge-secondary text-xs">JavaScript</span>
                <span class="badge badge-secondary text-xs">React</span>
                <span class="badge badge-secondary text-xs">Node.js</span>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-sm text-gray-600">I have 3 years of experience in web development and would love to contribute to this educational project.</p>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Applied Feb 1</span>
              <div class="flex space-x-2">
                <button class="btn btn-secondary btn-sm">Decline</button>
                <button class="btn btn-primary btn-sm">Accept</button>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-600 font-medium text-sm">ED</span>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Emily Davis</h3>
                  <p class="text-sm text-gray-600">Environmental Tracker</p>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-sm text-gray-600 mb-2">Skills:</p>
              <div class="flex flex-wrap gap-1">
                <span class="badge badge-secondary text-xs">Python</span>
                <span class="badge badge-secondary text-xs">Data Science</span>
                <span class="badge badge-secondary text-xs">Machine Learning</span>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-sm text-gray-600">Passionate about environmental causes and have experience with data analysis.</p>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Applied Feb 2</span>
              <div class="flex space-x-2">
                <button class="btn btn-secondary btn-sm">Decline</button>
                <button class="btn btn-primary btn-sm">Accept</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Mentors -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Mentors</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-3">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <span class="text-yellow-600 font-medium">SW</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Dr. Sarah Wilson</h3>
              <p class="text-sm text-gray-600">Senior Software Architect</p>
            </div>
          </div>

          <div class="mb-3">
            <p class="text-sm text-gray-600 mb-2">Expertise:</p>
            <div class="flex flex-wrap gap-1">
              <span class="badge badge-secondary text-xs">JavaScript</span>
              <span class="badge badge-secondary text-xs">React</span>
              <span class="badge badge-secondary text-xs">Architecture</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">12 projects</span>
            <NuxtLink to="/explore-mentors" class="btn btn-primary btn-sm">
              Request Mentor
            </NuxtLink>
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-3">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <span class="text-yellow-600 font-medium">MC</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">Michael Chen</h3>
              <p class="text-sm text-gray-600">Data Science Lead</p>
            </div>
          </div>

          <div class="mb-3">
            <p class="text-sm text-gray-600 mb-2">Expertise:</p>
            <div class="flex flex-wrap gap-1">
              <span class="badge badge-secondary text-xs">Python</span>
              <span class="badge badge-secondary text-xs">ML</span>
              <span class="badge badge-secondary text-xs">Data Viz</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">8 projects</span>
            <NuxtLink to="/explore-mentors" class="btn btn-primary btn-sm">
              Request Mentor
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>