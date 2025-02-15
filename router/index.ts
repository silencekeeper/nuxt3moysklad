import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('~/pages/index.vue')
  },
  {
    path: '/prices',
    component: () => import('~/pages/prices/index.vue')
  },
  {
    path: '/shipments',
    component: () => import('~/pages/shipments/index.vue')
  },
  {
    path: '/transfers',
    component: () => import('~/pages/transfers/index.vue')
  },
  {
    path: '/users',
    component: () => import('~/pages/users/index.vue')
  },
  {
    path: '/supplies',
    component: () => import('~/pages/supplies/index.vue')
  },
  {
    path: '/formulas',
    component: () => import('~/pages/formulas/index.vue')
  },
  {
    path: '/products',
    component: () => import('~/pages/products/index.vue')
  },
  {
    path: '/grades',
    component: () => import('~/pages/grades/index.vue')
  },
  // ... другие маршруты ...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 