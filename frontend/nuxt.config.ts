// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-feather-icons'],

  css: ['../assets/css/main.css'],

  runtimeConfig: {
    // Private keys (only available server-side)
    // apiSecret: process.env.API_SECRET,
    
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
    }
  },

  app: {
    head: {
      title: 'PortfolioHub - Developer Experience Through Real-World Projects',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Connect fresh graduates and career switchers with real-world projects from startups, open source, and NGOs. Build experience while contributing to meaningful projects.' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/portfoliohub_logo.ico' },
        { 
          rel: 'preconnect', 
          href: 'https://fonts.googleapis.com' 
        },
        { 
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com', 
          crossorigin: '' 
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        }
      ]
    }
  },

  tailwindcss: {
    exposeConfig: true,
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
            secondary: {
              50: '#f5f3ff',
              100: '#ede9fe',
              200: '#ddd6fe',
              300: '#c4b5fd',
              400: '#a78bfa',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
              800: '#5b21b6',
              900: '#4c1d95',
            },
            success: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
            },
            warning: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
            },
            error: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
            },
            info: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
            gray: {
              50: '#f9fafb',
              100: '#f3f4f6',
              200: '#e5e7eb',
              300: '#d1d5db',
              400: '#9ca3af',
              500: '#6b7280',
              600: '#4b5563',
              700: '#374151',
              800: '#1f2937',
              900: '#111827',
            }
          }
        }
      },
      plugins: [
        function({ addComponents }) {
          addComponents({
            '.btn': {
              '@apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed': {},
            },
            '.btn-primary': {
              '@apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': {},
            },
            '.btn-secondary': {
              '@apply bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500': {},
            },
            '.btn-success': {
              '@apply bg-success-600 text-white hover:bg-success-700 focus:ring-success-500': {},
            },
            '.btn-warning': {
              '@apply bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500': {},
            },
            '.btn-error': {
              '@apply bg-error-600 text-white hover:bg-error-700 focus:ring-error-500': {},
            },
            '.btn-info': {
              '@apply bg-info-600 text-white hover:bg-info-700 focus:ring-info-500': {},
            },
            '.btn-ghost': {
              '@apply bg-transparent text-gray-700 hover:bg-gray-100 border-gray-300 focus:ring-gray-500': {},
            },
            '.btn-outline': {
              '@apply bg-transparent border-2 text-primary-600 border-primary-600 hover:bg-primary-50 focus:ring-primary-500': {},
            },
            '.btn-xs': {
              '@apply px-2.5 py-1.5 text-xs': {},
            },
            '.btn-sm': {
              '@apply px-3 py-1.5 text-sm': {},
            },
            '.btn-md': {
              '@apply px-4 py-2 text-sm': {},
            },
            '.btn-lg': {
              '@apply px-6 py-3 text-base': {},
            },
            '.btn-xl': {
              '@apply px-8 py-4 text-lg': {},
            },
            '.badge': {
              '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
            },
            '.badge-primary': {
              '@apply bg-primary-100 text-primary-800': {},
            },
            '.badge-secondary': {
              '@apply bg-secondary-100 text-secondary-800': {},
            },
            '.badge-success': {
              '@apply bg-success-100 text-success-800': {},
            },
            '.badge-warning': {
              '@apply bg-warning-100 text-warning-800': {},
            },
            '.badge-error': {
              '@apply bg-error-100 text-error-800': {},
            },
            '.badge-info': {
              '@apply bg-info-100 text-info-800': {},
            },
            '.badge-lg': {
              '@apply px-3 py-1 text-sm': {},
            },
            '.card': {
              '@apply bg-white rounded-2xl shadow-lg border border-gray-100': {},
            },
          })
        }
      ]
    }
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  build: {
    transpile: ['vue3-apexcharts', 'apexcharts']
  },

  vite: {
    optimizeDeps: {
      include: ['vue3-apexcharts', 'apexcharts']
    }
  }
})