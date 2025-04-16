<template>
  <div class="min-h-screen flex items-center justify-center bg-[#121212] p-4">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-white mb-6">Iniciar Sesión</h1>
      <div
        v-if="error"
        class="bg-red-500/10 border text-center border-red-500 text-red-500 rounded p-3 mb-4"
      >
        {{ error }}
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="correo@ejemplo.com"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <div class="mb-2">
          <label class="block text-gray-300 mb-2">Contraseña</label>
          <input
            type="password"
            v-model="password"
            placeholder="********"
            class="w-full p-3 rounded bg-[#1e1e1e] border border-[#333] text-white"
            required
          />
        </div>
        <div class="mb-4">
          <RouterLink to="/reset-password" class="text-sm text-blue-400 hover:underline">
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>
        <div class="mb-6">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-[#1e1e1e]"
            />
            <span class="ml-2 text-gray-300">Recordarme</span>
          </label>
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
          Iniciar Sesión
        </button>
      </form>

      <div class="flex items-center my-6">
        <div class="flex-grow h-px bg-gray-600"></div>
        <div class="px-3 text-gray-300">O</div>
        <div class="flex-grow h-px bg-gray-600"></div>
      </div>

      <button
        @click="signInWithGoogle"
        class="w-full flex items-center justify-center bg-transparent border border-gray-600 cursor-pointer text-white py-3 px-4 rounded hover:bg-[#1e1e1e] transition-colors"
        :disabled="loading"
      >
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            fill="currentColor"
          />
        </svg>
        Iniciar sesión con Google
      </button>

      <p class="text-center mt-6 text-gray-300">
        ¿No tienes una cuenta?
        <RouterLink to="/register" class="text-blue-400 hover:underline">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../composables/useLogin'

const { email, error, handleLogin, loading, password, rememberMe, signInWithGoogle } = useLogin()
</script>
