<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How PortfolioHub Works
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Our platform connects three key groups to create meaningful collaboration opportunities
        </p>
      </div>

      <!-- Tabs -->
      <div class="max-w-4xl mx-auto">
        <!-- Tab Buttons -->
        <div class="flex justify-center mb-8 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 text-lg font-medium transition-colors relative"
            :class="[
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <component :is="tab.icon" size="20" class="inline mr-2" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content with Slider -->
        <div class="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[500px]">
          <!-- Volunteers Content -->
          <div v-if="activeTab === 'volunteers'" class="fade-in">
            <TabContent
              :current-slide="currentVolunteerSlide"
              :slides="volunteersSlides"
              :color="'primary'"
              icon="UserIcon"
              @prev="prevSlide('volunteer')"
              @next="nextSlide('volunteer')"
              @goto="currentVolunteerSlide = $event"
            />
          </div>

          <!-- Project Creators Content -->
          <div v-if="activeTab === 'creators'" class="fade-in">
            <TabContent
              :current-slide="currentCreatorSlide"
              :slides="creatorsSlides"
              :color="'green'"
              icon="BriefcaseIcon"
              @prev="prevSlide('creator')"
              @next="nextSlide('creator')"
              @goto="currentCreatorSlide = $event"
            />
          </div>

          <!-- Mentors Content -->
          <div v-if="activeTab === 'mentors'" class="fade-in">
            <TabContent
              :current-slide="currentMentorSlide"
              :slides="mentorsSlides"
              :color="'yellow'"
              icon="StarIcon"
              @prev="prevSlide('mentor')"
              @next="nextSlide('mentor')"
              @goto="currentMentorSlide = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tab and slider state management
const activeTab = ref('volunteers')
const currentVolunteerSlide = ref(0)
const currentCreatorSlide = ref(0)
const currentMentorSlide = ref(0)

// Tab configuration
const tabs = [
  {
    id: 'volunteers',
    label: 'For Volunteers',
    icon: 'UserIcon'
  },
  {
    id: 'creators',
    label: 'For Project Creators',
    icon: 'BriefcaseIcon'
  },
  {
    id: 'mentors',
    label: 'For Mentors',
    icon: 'StarIcon'
  }
]

// Slide content
const volunteersSlides = [
  {
    title: 'Build Your Portfolio',
    description: 'Work on real-world projects that showcase your skills. Build a portfolio that stands out to employers with actual project experience, not just coursework.'
  },
  {
    title: 'Get Expert Mentorship',
    description: 'Learn from experienced professionals who guide you through challenges. Receive personalized feedback and career advice to accelerate your growth.'
  },
  {
    title: 'Network with Professionals',
    description: 'Connect with like-minded developers, project creators, and industry mentors. Build relationships that can open doors to future opportunities.'
  }
]

const creatorsSlides = [
  {
    title: 'Access Motivated Talent',
    description: 'Connect with passionate volunteers eager to contribute to meaningful projects. Find skilled individuals who want to make a real impact.'
  },
  {
    title: 'Flexible Collaboration',
    description: 'Set your own terms for collaboration without the overhead of traditional hiring. Scale your team up or down based on project needs.'
  },
  {
    title: 'Community-Driven Development',
    description: 'Build a community around your project. Engage contributors who are invested in your mission and bring diverse perspectives.'
  }
]

const mentorsSlides = [
  {
    title: 'Give Back to Community',
    description: 'Share your knowledge and experience with the next generation. Make a lasting impact by helping others grow in their careers.'
  },
  {
    title: 'Build Leadership Skills',
    description: 'Develop your mentoring and leadership abilities. Guide teams and individuals while refining your own communication and management skills.'
  },
  {
    title: 'Expand Your Network',
    description: 'Connect with talented developers and innovative project creators. Build meaningful professional relationships across the industry.'
  }
]

// Slider navigation functions
const nextSlide = (type: string) => {
  if (type === 'volunteer') {
    currentVolunteerSlide.value = (currentVolunteerSlide.value + 1) % 3
  } else if (type === 'creator') {
    currentCreatorSlide.value = (currentCreatorSlide.value + 1) % 3
  } else if (type === 'mentor') {
    currentMentorSlide.value = (currentMentorSlide.value + 1) % 3
  }
}

const prevSlide = (type: string) => {
  if (type === 'volunteer') {
    currentVolunteerSlide.value = (currentVolunteerSlide.value - 1 + 3) % 3
  } else if (type === 'creator') {
    currentCreatorSlide.value = (currentCreatorSlide.value - 1 + 3) % 3
  } else if (type === 'mentor') {
    currentMentorSlide.value = (currentMentorSlide.value - 1 + 3) % 3
  }
}
</script>

<style scoped>
/* Fade in animation for tab content */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
