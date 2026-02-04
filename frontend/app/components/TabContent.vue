<template>
  <div class="flex flex-col md:flex-row items-center gap-8">
    <!-- Illustration -->
    <div class="w-full md:w-1/2 flex justify-center">
      <div class="relative">
        <div 
          class="w-64 h-64 rounded-3xl flex items-center justify-center transform hover:scale-105 transition-transform"
          :class="illustrationClasses"
        >
          <component :is="icon" size="120" :class="iconClasses" />
        </div>
      </div>
    </div>

    <!-- Content Slider -->
    <div class="w-full md:w-1/2">
      <div class="relative h-80">
        <TransitionGroup name="slide">
          <div 
            v-for="(slide, index) in slides" 
            :key="`slide-${index}`" 
            v-show="currentSlide === index"
            class="absolute inset-0"
          >
            <div class="h-full flex flex-col justify-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ slide.title }}</h3>
              <p class="text-gray-600 text-lg leading-relaxed">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Slider Controls -->
      <div class="flex items-center justify-between mt-6">
        <button
          @click="$emit('prev')"
          class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon size="24" class="text-gray-600" />
        </button>
        
        <div class="flex gap-2">
          <button
            v-for="(slide, index) in slides"
            :key="`dot-${index}`"
            @click="$emit('goto', index)"
            class="w-2 h-2 rounded-full transition-all"
            :class="currentSlide === index ? `${activeIndicatorClass} w-8` : 'bg-gray-300'"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>

        <button
          @click="$emit('next')"
          class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRightIcon size="24" class="text-gray-600" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Slide {
  title: string
  description: string
}

interface Props {
  currentSlide: number
  slides: Slide[]
  color: 'primary' | 'green' | 'yellow'
  icon: string
}

const props = defineProps<Props>()

defineEmits<{
  prev: []
  next: []
  goto: [index: number]
}>()

// Computed classes based on color prop
const illustrationClasses = computed(() => {
  const colorMap = {
    primary: 'bg-gradient-to-br from-primary-100 to-primary-200',
    green: 'bg-gradient-to-br from-green-100 to-green-200',
    yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200'
  }
  return colorMap[props.color]
})

const iconClasses = computed(() => {
  const colorMap = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600'
  }
  return colorMap[props.color]
})

const activeIndicatorClass = computed(() => {
  const colorMap = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600'
  }
  return colorMap[props.color]
})
</script>

<style scoped>
/* Slide transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-leave-active {
  position: absolute;
}
</style>
