<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Kelola Project</h1>
            <p class="mt-1 text-sm text-gray-600">Buat, edit, dan kelola semua project Anda</p>
          </div>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Buat Project Baru
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="text-gray-600">Memuat data project...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && projects.length === 0" class="text-center py-20">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-6">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Belum ada project</h3>
        <p class="text-gray-600 mb-6">Mulai dengan membuat project pertama Anda</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Buat Project Pertama
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300"
        >
          <!-- Project Banner -->
          <div class="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
            <img
              v-if="project.bannerUrl"
              :src="project.bannerUrl"
              :alt="project.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full">
              <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                :class="getStatusClass(project.status)"
              >
                {{ getStatusLabel(project.status) }}
              </span>
            </div>
          </div>

          <!-- Project Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
              {{ project.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
              {{ project.description }}
            </p>

            <!-- Project Stats -->
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ project.volunteerCount || 0 }}/{{ project.volunteersNeeded }}</span>
                </div>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" :class="getLevelClass(project.level)">
                    {{ getLevelLabel(project.level) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button
                @click="openEditModal(project)"
                class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                @click="confirmDelete(project)"
                class="inline-flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[9999] overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="flex items-start justify-center min-h-screen px-4 py-6 sm:py-12">
          <!-- Backdrop -->
          <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" @click="closeModal"></div>

          <!-- Modal Content -->
          <div class="relative w-full max-w-4xl mx-auto my-auto overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
            <!-- Modal Header - Fixed -->
            <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ isEditMode ? 'Edit Project' : 'Buat Project Baru' }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form - Scrollable -->
            <div class="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-4">
              <form @submit.prevent="submitForm" class="space-y-5">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Project <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    minlength="3"
                    maxlength="255"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Minimal 3 karakter"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Deskripsi <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    required
                    minlength="10"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Minimal 10 karakter"
                  ></textarea>
                </div>

                <!-- Status & Level -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      v-model="formData.status"
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Level
                    </label>
                    <select
                      v-model="formData.level"
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <!-- Volunteers Needed, Start Date & End Date -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Volunteers Needed
                    </label>
                    <input
                      v-model.number="formData.volunteersNeeded"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Tanggal Mulai
                    </label>
                    <input
                      v-model="formData.startDate"
                      type="date"
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                      Tanggal Selesai
                    </label>
                    <input
                      v-model="formData.endDate"
                      type="date"
                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <!-- Categories -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <label
                      v-for="category in categories"
                      :key="category.id"
                      class="relative flex items-center p-3 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md"
                      :class="formData.categoryIds.includes(category.id) 
                        ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-indigo-300'"
                    >
                      <input
                        type="checkbox"
                        :value="category.id"
                        v-model="formData.categoryIds"
                        class="sr-only"
                      />
                      <div class="flex items-center space-x-2 flex-1 min-w-0">
                        <span class="text-xl flex-shrink-0">{{ category.icon }}</span>
                        <span class="text-sm font-medium text-gray-700 truncate">{{ category.name }}</span>
                      </div>
                      <svg
                        v-if="formData.categoryIds.includes(category.id)"
                        class="w-5 h-5 text-indigo-600 flex-shrink-0 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mt-1.5">Pilih minimal 1 kategori ({{ formData.categoryIds.length }} dipilih)</p>
                </div>

                <!-- Skills -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Skills <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div
                      v-for="skill in skills"
                      :key="skill.id"
                      class="relative flex flex-col p-3 rounded-lg border-2 transition-all duration-200"
                      :class="isSkillSelected(skill.id)
                        ? (isSkillMandatory(skill.id) ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-green-50 border-green-500 shadow-sm')
                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'"
                    >
                      <!-- Skill Selection Row -->
                      <label class="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          :checked="isSkillSelected(skill.id)"
                          @change="toggleSkill(skill.id)"
                          class="sr-only"
                        />
                        <div class="flex items-center space-x-2 flex-1 min-w-0">
                          <span class="text-xl flex-shrink-0">{{ skill.icon }}</span>
                          <span class="text-sm font-medium text-gray-700 truncate">{{ skill.name }}</span>
                        </div>
                        <svg
                          v-if="isSkillSelected(skill.id)"
                          class="w-5 h-5 flex-shrink-0 ml-1"
                          :class="isSkillMandatory(skill.id) ? 'text-red-600' : 'text-green-600'"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </label>
                      
                      <!-- Mandatory/Optional Toggle (Only show when selected) -->
                      <div v-if="isSkillSelected(skill.id)" class="mt-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          @click="toggleSkillMandatory(skill.id)"
                          class="flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors"
                          :class="isSkillMandatory(skill.id)
                            ? 'bg-red-100 hover:bg-red-200'
                            : 'bg-green-100 hover:bg-green-200'"
                        >
                          <span class="text-xs font-medium"
                            :class="isSkillMandatory(skill.id) ? 'text-red-700' : 'text-green-700'"
                          >
                            {{ isSkillMandatory(skill.id) ? 'Required' : 'Optional' }}
                          </span>
                          <div class="relative inline-block w-10 h-5">
                            <div
                              class="absolute inset-0 rounded-full transition-colors"
                              :class="isSkillMandatory(skill.id) ? 'bg-red-500' : 'bg-green-500'"
                            ></div>
                            <div
                              class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow"
                              :class="isSkillMandatory(skill.id) ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-1.5">
                    <p class="text-xs text-gray-500">
                      Total: {{ formData.skills.length }} dipilih
                    </p>
                    <div class="flex items-center gap-3 text-xs">
                      <span class="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                        <span class="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                        Required: {{ getMandatorySkillsCount }}
                      </span>
                      <span class="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                        Optional: {{ getOptionalSkillsCount }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Links -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Links (Optional)
                  </label>
                  <div class="space-y-2">
                    <!-- Existing Links -->
                    <div v-for="(link, key) in formData.links" :key="key" class="flex gap-2 items-center">
                      <div class="w-1/3 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                        <span class="font-medium text-gray-700">{{ getLinkLabel(key) }}</span>
                      </div>
                      <input
                        :value="link"
                        disabled
                        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                      <button
                        type="button"
                        @click="removeLink(key)"
                        class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus link"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Add New Link -->
                    <div class="flex gap-2 items-start">
                      <div class="w-1/3">
                        <select
                          v-model="linkKey"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="" disabled>Pilih tipe link</option>
                          <option v-for="type in linkTypes" :key="type.value" :value="type.value">
                            {{ type.label }}
                          </option>
                        </select>
                      </div>
                      <input
                        v-model="linkValue"
                        type="url"
                        placeholder="https://..."
                        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        @click="addLink"
                        :disabled="!linkKey || !linkValue"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Tambah link"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ Object.keys(formData.links || {}).length }} link ditambahkan</p>
                  </div>
                </div>

                <!-- Banner Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Banner Image
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                    <div v-if="bannerPreview" class="text-center">
                      <img :src="bannerPreview" alt="Banner preview" class="mx-auto h-32 w-auto rounded-lg shadow-md mb-2" />
                      <button
                        type="button"
                        @click="removeBanner"
                        class="text-sm text-red-600 hover:text-red-800"
                      >
                        Hapus Banner
                      </button>
                    </div>
                    <div v-else class="text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <label class="mt-2 inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          class="sr-only"
                          @change="handleBannerUpload"
                        />
                      </label>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <!-- Images Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    Gambar Project (Multiple)
                  </label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                    <div v-if="imagesPreview.length > 0" class="mb-3">
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div v-for="(preview, index) in imagesPreview" :key="index" class="relative group">
                          <img :src="preview" alt="Image preview" class="h-20 w-full object-cover rounded-lg shadow-md" />
                          <button
                            type="button"
                            @click="removeImage(index)"
                            class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <svg v-if="imagesPreview.length === 0" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <label class="mt-2 inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          class="sr-only"
                          @change="handleImagesUpload"
                        />
                      </label>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB (Multiple)</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Form Actions - Fixed Bottom -->
            <div class="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                @click="submitForm"
                :disabled="submitting || !isFormValid"
                class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Buat Project') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeDeleteModal"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <!-- Backdrop -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeDeleteModal"></div>

          <!-- Modal Content -->
          <div class="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">
              Hapus Project
            </h3>
            <p class="text-sm text-gray-600 text-center mb-6">
              Apakah Anda yakin ingin menghapus project "<strong>{{ projectToDelete?.name }}</strong>"? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="closeDeleteModal"
                class="flex-1 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                @click="deleteProject"
                :disabled="deleting"
                class="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

// Types
interface Category {
  id: string
  name: string
  description: string
  icon: string
  createdAt: string
}

interface Skill {
  id: string
  name: string
  icon: string
  createdAt: string
}

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
  bannerUrl?: string
  images?: string[]
  [key: string]: any
}

interface SkillSelection {
  skillId: string
  isMandatory: boolean
}

interface FormData {
  name: string
  description: string
  status?: string
  level?: string
  volunteersNeeded?: number
  startDate?: string
  endDate?: string
  links?: Record<string, string>
  categoryIds: string[]
  skills: SkillSelection[]
  banner?: File | null
  images?: File[]
}

// Composables
const config = useRuntimeConfig()

// Get auth user from localStorage
const getAuthUser = () => {
  if (process.client) {
    const authUser = localStorage.getItem('auth_user')
    if (!authUser) return null
    try {
      return JSON.parse(authUser)
    } catch {
      return null
    }
  }
  return null
}

// Get auth headers
const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    return {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }
  return {}
}

// Reactive state
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)
const projects = ref<Project[]>([])
const categories = ref<Category[]>([])
const skills = ref<Skill[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const currentProject = ref<Project | null>(null)
const projectToDelete = ref<Project | null>(null)

const formData = ref<FormData>({
  name: '',
  description: '',
  status: 'draft',
  level: 'beginner',
  volunteersNeeded: 0,
  startDate: '',
  endDate: '',
  links: {},
  categoryIds: [],
  skills: [],
  banner: null,
  images: []
})

const bannerPreview = ref<string | null>(null)
const imagesPreview = ref<string[]>([])

// Link inputs
const linkKey = ref('')
const linkValue = ref('')

// Available link types for dropdown
const linkTypes = [
  { value: 'github', label: 'GitHub' },
  { value: 'gitlab', label: 'GitLab' },
  { value: 'bitbucket', label: 'Bitbucket' },
  { value: 'website', label: 'Website' },
  { value: 'demo', label: 'Demo/Live Preview' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'figma', label: 'Figma' },
  { value: 'discord', label: 'Discord' },
  { value: 'slack', label: 'Slack' },
  { value: 'other', label: 'Other' }
]

// Form validation
const isFormValid = computed(() => {
  return formData.value.name.length >= 3 &&
         formData.value.description.length >= 10 &&
         formData.value.categoryIds.length > 0 &&
         formData.value.skills.length > 0
})

// Helper functions for skills
const isSkillSelected = (skillId: string) => {
  return formData.value.skills.some(s => s.skillId === skillId)
}

const isSkillMandatory = (skillId: string) => {
  const skill = formData.value.skills.find(s => s.skillId === skillId)
  return skill?.isMandatory || false
}

const toggleSkill = (skillId: string) => {
  const index = formData.value.skills.findIndex(s => s.skillId === skillId)
  if (index >= 0) {
    // Remove skill
    formData.value.skills.splice(index, 1)
  } else {
    // Add skill as optional by default
    formData.value.skills.push({ skillId, isMandatory: false })
  }
}

const toggleSkillMandatory = (skillId: string) => {
  const skill = formData.value.skills.find(s => s.skillId === skillId)
  if (skill) {
    skill.isMandatory = !skill.isMandatory
  }
}

const getMandatorySkillsCount = computed(() => {
  return formData.value.skills.filter(s => s.isMandatory).length
})

const getOptionalSkillsCount = computed(() => {
  return formData.value.skills.filter(s => !s.isMandatory).length
})

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/categories`, {
      headers: getAuthHeaders()
    })
    categories.value = response?.data || []
  } catch (error: any) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch skills
const fetchSkills = async () => {
  try {
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/skills`, {
      headers: getAuthHeaders()
    })
    skills.value = response?.data || []
  } catch (error: any) {
    console.error('Error fetching skills:', error)
  }
}

// Fetch projects
const fetchProjects = async () => {
  const user = getAuthUser()
  if (!user || !user.id) {
    navigateTo('/')
    return
  }

  try {
    loading.value = true
    const response = await $fetch<any>(`${config.public.apiBaseUrl}/projects/creator/${user.id}`, {
      headers: getAuthHeaders()
    })
    
    // Handle different response structures
    if (response?.data) {
      projects.value = response.data || []
    } else if (Array.isArray(response)) {
      projects.value = response || []
    } else {
      projects.value = []
    }
    
    console.log('Fetched projects:', projects.value)
  } catch (error: any) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

// Modal functions
const openCreateModal = () => {
  isEditMode.value = false
  currentProject.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (project: Project) => {
  isEditMode.value = true
  currentProject.value = project
  
  // Extract category IDs from project data
  let categoryIds: string[] = []
  if (project.categoryIds && Array.isArray(project.categoryIds)) {
    categoryIds = project.categoryIds
  } else if (project.categories && Array.isArray(project.categories)) {
    categoryIds = project.categories.map((cat: any) => cat.id || cat)
  }
  
  // Extract skills with isMandatory from project data
  let skills: SkillSelection[] = []
  if (project.skills && Array.isArray(project.skills)) {
    skills = project.skills.map((skill: any) => {
      if (typeof skill === 'object' && skill.id) {
        return {
          skillId: skill.id,
          isMandatory: skill.ProjectSkill?.isMandatory || skill.isMandatory || false
        }
      }
      return { skillId: skill, isMandatory: false }
    })
  } else if (project.skillIds && Array.isArray(project.skillIds)) {
    skills = project.skillIds.map((id: string) => ({ skillId: id, isMandatory: false }))
  }
  
  // Parse links if it's a JSON string, otherwise use as object
  let links = {}
  if (project.links) {
    if (typeof project.links === 'string') {
      try {
        links = JSON.parse(project.links)
      } catch {
        links = {}
      }
    } else if (typeof project.links === 'object') {
      links = project.links
    }
  }
  
  formData.value = {
    name: project.name,
    description: project.description,
    status: project.status,
    level: project.level || 'beginner',
    volunteersNeeded: project.volunteersNeeded || 0,
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    links: links,
    categoryIds: categoryIds,
    skills: skills,
    banner: null,
    images: []
  }
  bannerPreview.value = project.bannerUrl || null
  imagesPreview.value = project.images || []
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    status: 'draft',
    level: 'beginner',
    volunteersNeeded: 0,
    startDate: '',
    endDate: '',
    links: {},
    categoryIds: [],
    skills: [],
    banner: null,
    images: []
  }
  bannerPreview.value = null
  imagesPreview.value = []
  linkKey.value = ''
  linkValue.value = ''
}

// Link handlers
const addLink = () => {
  if (linkKey.value.trim() && linkValue.value.trim()) {
    if (!formData.value.links) {
      formData.value.links = {}
    }
    // Check if link type already exists
    if (formData.value.links[linkKey.value.trim()]) {
      alert(`Link tipe "${getLinkLabel(linkKey.value)}" sudah ditambahkan. Silakan pilih tipe lain atau hapus yang lama terlebih dahulu.`)
      return
    }
    formData.value.links[linkKey.value.trim()] = linkValue.value.trim()
    linkKey.value = ''
    linkValue.value = ''
  }
}

const removeLink = (key: string) => {
  if (formData.value.links) {
    delete formData.value.links[key]
  }
}

// Get link label from value
const getLinkLabel = (value: string) => {
  const linkType = linkTypes.find(type => type.value === value)
  return linkType ? linkType.label : value
}

// File upload handlers
const handleBannerUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    formData.value.banner = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      bannerPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeBanner = () => {
  formData.value.banner = null
  bannerPreview.value = null
}

const handleImagesUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    formData.value.images = [...(formData.value.images || []), ...files]
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagesPreview.value.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index: number) => {
  if (formData.value.images) {
    formData.value.images.splice(index, 1)
  }
  imagesPreview.value.splice(index, 1)
}

// Submit form
const submitForm = async () => {
  const user = getAuthUser()
  if (!user || user.role !== 'project_owner') {
    navigateTo('/')
    return
  }

  // Validate required fields
  if (!isFormValid.value) {
    alert('Mohon lengkapi semua field yang wajib diisi (nama min 3 karakter, deskripsi min 10 karakter, minimal 1 kategori dan 1 skill)')
    return
  }

  try {
    submitting.value = true
    
    // Create JSON body
    const body: any = {
      name: formData.value.name,
      description: formData.value.description,
      categoryIds: formData.value.categoryIds,
      skills: formData.value.skills
    }
    
    if (formData.value.status) {
      body.status = formData.value.status
    }
    
    if (formData.value.level) {
      body.level = formData.value.level
    }
    
    if (formData.value.volunteersNeeded !== undefined) {
      body.volunteersNeeded = formData.value.volunteersNeeded
    }
    
    if (formData.value.startDate) {
      body.startDate = formData.value.startDate
    }
    
    if (formData.value.endDate) {
      body.endDate = formData.value.endDate
    }
    
    if (formData.value.links && typeof formData.value.links === 'object' && Object.keys(formData.value.links).length > 0) {
      body.links = formData.value.links
    }
    
    // Make request
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    }
    
    if (isEditMode.value && currentProject.value) {
      await $fetch(`${config.public.apiBaseUrl}/projects/${currentProject.value.id}`, {
        method: 'PATCH',
        body: body,
        headers: headers
      })
      
      closeModal()
      await fetchProjects()
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Project berhasil diupdate',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      await $fetch(`${config.public.apiBaseUrl}/projects`, {
        method: 'POST',
        body: body,
        headers: headers
      })
      
      closeModal()
      await fetchProjects()
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Project berhasil dibuat',
        timer: 1500,
        showConfirmButton: false
      })
    }
  } catch (error: any) {
    console.error('Error submitting form:', error)
    
    closeModal()
    
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: error.data?.message || error.message || 'Terjadi kesalahan saat menyimpan project',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submitting.value = false
  }
}

// Delete functions
const confirmDelete = (project: Project) => {
  projectToDelete.value = project
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  projectToDelete.value = null
}

const deleteProject = async () => {
  if (!projectToDelete.value) return
  
  const user = getAuthUser()
  if (!user || user.role !== 'project_owner') {
    navigateTo('/')
    return
  }
  
  try {
    deleting.value = true
    await $fetch(`${config.public.apiBaseUrl}/projects/${projectToDelete.value.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    closeDeleteModal()
    await fetchProjects()
    
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Project berhasil dihapus',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    
    closeDeleteModal()
    
    await Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus',
      text: error.data?.message || error.message || 'Gagal menghapus project',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    deleting.value = false
  }
}

// Helper functions
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 border border-gray-300',
    active: 'bg-green-100 text-green-800 border border-green-300',
    in_progress: 'bg-blue-100 text-blue-800 border border-blue-300',
    completed: 'bg-purple-100 text-purple-800 border border-purple-300',
    cancelled: 'bg-red-100 text-red-800 border border-red-300',
    on_hold: 'bg-yellow-100 text-yellow-800 border border-yellow-300'
  }
  return classes[status] || classes.draft
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    active: 'Active',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    on_hold: 'On Hold'
  }
  return labels[status] || status
}

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }
  return classes[level] || classes.beginner
}

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
  return labels[level] || level
}

// Lifecycle
onMounted(() => {
  // Check role first
  const authUser = getAuthUser()
  if (!authUser || authUser.role !== 'project_owner') {
    navigateTo('/')
    return
  }
  
  // Fetch all data
  fetchCategories()
  fetchSkills()
  fetchProjects()
})

// SEO
useHead({
  title: 'Kelola Project Saya - PortfolioHub',
  meta: [
    {
      name: 'description',
      content: 'Kelola semua project Anda di PortfolioHub'
    }
  ]
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
