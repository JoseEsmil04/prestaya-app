import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

interface GetUser {
  id: string
  email: string
  nombre_negocio: string
}

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<GetUser | null>(null)
  const nombre_negocio = computed(() => usuario.value?.nombre_negocio)

  const fetchPerfil = async () => {
    const { data } = await supabase.auth.getSession()
    const user = data?.session?.user

    if (user) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre_negocio')
        .eq('id', user.id)
        .single()

      if (!error) usuario.value = data
    }
  }

  onMounted(() => {
    fetchPerfil()
  })

  return { usuario, fetchPerfil, nombre_negocio }
})
