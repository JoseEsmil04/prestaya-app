<template>
  <div class="min-h-screen flex items-center justify-center bg-[#121212] p-4">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-white mb-6">Registro</h1>
      <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-500 rounded p-3 mb-4">
        {{ error }}
      </div>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Nombre del Negocio</label>
          <input
            type="text"
            v-model="registerData.nombreNegocio"
            placeholder="Mi Negocio"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            v-model="registerData.email"
            placeholder="correo@ejemplo.com"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Contraseña</label>
          <input
            type="password"
            v-model="registerData.password"
            placeholder="********"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="********"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full cursor-pointer bg-[#5b5ef7] hover:bg-[#4b4ef0] text-white py-3 px-4 rounded transition-colors"
          :disabled="loading"
        >
          <span v-if="loading" class="inline-block mr-2">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          Registrarse
        </button>
      </form>
      <p class="text-center mt-6 text-gray-300">
        ¿Ya tienes una cuenta?
        <RouterLink to="/login" class="text-blue-400 hover:underline">Inicia Sesión</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const registerData = reactive({
  nombreNegocio: '',
  email: '',
  password: '',
})

const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    if (registerData.password !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden'
      return
    }

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          nombre_negocio: registerData.nombreNegocio,
        },
      },
    })

    if (signUpError) {
      error.value = signUpError.message
      return
    }

    if (user) {
      router.push({ name: 'confirmation' })
      return
    }
  } catch (e) {
    error.value = 'Ocurrió un error durante el registro'
    throw e
  } finally {
    loading.value = false
  }
}
</script>
