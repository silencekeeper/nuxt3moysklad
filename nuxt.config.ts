// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: [
    'usebootstrap'
    ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://127.0.0.1:5001'  // URL вашего бэкенда
    }
  },
  vite: {
    plugins: [
      Components({
        dts: true,
        dirs: ['./components'],
      }),
    ],
  },
  //css: ['~/assets/css/main.css'],
  pages: true,
  serverMiddleware: [
    { path: '/api', handler: '~/server/middleware/auth' }
  ],
})

