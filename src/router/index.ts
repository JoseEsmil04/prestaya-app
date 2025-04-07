import ListaPrestamos from '@/modules/prestamos/views/ListaPrestamos.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'prestamos',
      component: ListaPrestamos,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue'),
    },
  ],
})

export default router
