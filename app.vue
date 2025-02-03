<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { useHead } from 'nuxt/app' // Для Nuxt 3

// Добавляем CDN ссылку на Bootstrap в head
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous'
    }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
      integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
      crossorigin: 'anonymous'
    }
  ]
})
</script>
