<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-50 to-blue-100 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your Portfolio Through
            <span class="text-primary-600">Real-World Projects</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with meaningful projects from NGOs, startups, and open source communities. 
            Gain practical experience while making a real impact.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/register" class="btn btn-primary btn-lg">
              Get Started Free
            </NuxtLink>
            <NuxtLink to="/explore" class="btn btn-secondary btn-lg">
              <SearchIcon size="20" class="mr-2" />
              Explore Projects
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Background decoration -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full opacity-20 transform -translate-x-32 translate-y-32"></div>
      </div>
    </section>

    <!-- Features Section -->
    <FeaturesTabsSlider />

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to Start Building?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Join thousands of developers, creators, and organizations making real impact through collaboration.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="btn btn-primary btn-lg">
            Join as Volunteer
          </NuxtLink>
          <NuxtLink to="/register" class="btn btn-secondary btn-lg">
            Start a Project
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Mock featured projects data
const featuredProjects = ref([
  {
    id: '1',
    name: 'Open Source Learning Platform',
    description: 'Building an interactive learning platform for programming beginners with gamification features.',
    creator: {
      name: 'TechForGood',
      organization: 'TechForGood NGO'
    },
    tags: ['JavaScript', 'React', 'Node.js', 'Education'],
    volunteers_needed: 8,
    volunteers_joined: 5,
    difficulty: 'intermediate'
  },
  {
    id: '2',
    name: 'Environmental Data Tracker',
    description: 'Python-based application to track and visualize environmental data for climate research.',
    creator: {
      name: 'GreenData Initiative',
      organization: 'Environmental Research Center'
    },
    tags: ['Python', 'Data Science', 'Machine Learning'],
    volunteers_needed: 6,
    volunteers_joined: 2,
    difficulty: 'beginner'
  },
  {
    id: '3',
    name: 'Community Health Mobile App',
    description: 'React Native mobile app to help communities track health metrics and connect with local healthcare providers.',
    creator: {
      name: 'HealthConnect',
      organization: 'Community Health Alliance'
    },
    tags: ['React Native', 'Mobile Development', 'Healthcare'],
    volunteers_needed: 10,
    volunteers_joined: 7,
    difficulty: 'intermediate'
  }
])

// SEO
useHead({
  title: 'PortfolioHub - Developer Experience Through Real-World Projects',
  meta: [
    {
      name: 'description',
      content: 'Connect fresh graduates and career switchers with real-world projects from startups, open source, and NGOs. Build experience while contributing to meaningful projects.'
    },
    {
      property: 'og:title',
      content: 'PortfolioHub - Developer Experience Through Real-World Projects'
    },
    {
      property: 'og:description',
      content: 'Build your portfolio through real-world project collaboration with NGOs, startups, and open source communities.'
    }
  ]
})
</script>