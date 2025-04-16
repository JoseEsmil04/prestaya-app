import { supabase } from '@/lib/supabaseClient'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useLogin = () => {
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  const rememberMe = ref(false)

  const router = useRouter()

  const handleLogin = async () => {
    loading.value = true
    error.value = ''

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (loginError) {
      error.value = loginError.message
      loading.value = false
      return
    }

    const user = data.user

    if (!data.user) {
      error.value = 'Usuario no encontrado'
      loading.value = false
      return
    }

    if (!user.email_confirmed_at) {
      router.push({ name: 'confirmation' })
      return
    }

    if (rememberMe.value) {
      localStorage.setItem('userEmail', email.value)
    } else {
      localStorage.removeItem('userEmail')
    }

    await supabase.from('usuarios').upsert({
      id: user.id,
      email: user.email,
      nombre_negocio: user.user_metadata?.nombre_negocio || 'Negocio sin nombre',
      plan: 'free',
    })

    router.push({ name: 'prestamos' })
    loading.value = false
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/prestamos',
      },
    })

    if (error) {
      console.error('Error al iniciar sesión con Google:', error.message)
    }
  }

  return { email, error, handleLogin, signInWithGoogle, password, loading, rememberMe }
}
