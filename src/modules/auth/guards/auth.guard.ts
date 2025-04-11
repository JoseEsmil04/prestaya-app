import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session && session.user.email_confirmed_at) {
    next()
  } else {
    next({ name: 'login' }) // o 'confirmar-correo' si aún no ha confirmado
  }
}
