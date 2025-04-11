import { authGuard } from '@/modules/auth/guards/auth.guard'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
import PrestamosList from '@/modules/prestamos/views/PrestamosList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import('@/modules/auth/views/ConfirmationView.vue'),
    },
    {
      path: '/prestamos',
      name: 'prestamos',
      component: PrestamosList,
      beforeEnter: authGuard,
    },
  ],
})

export default router
