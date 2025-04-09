<template>
  <div class="bg-[#121212] border-b border-[#2a2a2a] pb-6">
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white">Hola {{ authStore.nombre_negocio }}</h1>
        <h1 class="text-xl font-bold text-[#0de8be]">Listado de Préstamos</h1>
        <p class="text-gray-400 mt-1">Gestiona y monitorea todos tus préstamos activos</p>
      </div>
      <button
        class="btn bg-[#00c853] hover:bg-[#00a844] text-white border-none mb-6"
        @click="$emit('update:modelValue', true)"
      >
        <svg
          class="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
          <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Nuevo Préstamo
      </button>

      <!-- Tarjetas de estadísticas 2x2 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-[#1e2130] rounded-lg p-4">
          <div class="text-gray-400 text-sm">Total Préstamos</div>
          <div class="text-white text-3xl md:text-4xl font-bold mt-1">
            {{ prestamoStore.prestamos.length }}
          </div>
          <div class="text-gray-400 text-xs mt-1">Préstamos registrados</div>
        </div>

        <div class="bg-[#1e2130] rounded-lg p-4">
          <div class="text-gray-400 text-sm">Activos</div>
          <div class="text-[#0de8be] text-3xl md:text-4xl font-bold mt-1">
            {{ prestamoStore.prestamos.filter((p) => p.estado.toLowerCase() === 'activo').length }}
          </div>
          <div class="text-gray-400 text-xs mt-1">Préstamos en curso</div>
        </div>

        <div class="bg-[#1e2130] rounded-lg p-4">
          <div class="text-gray-400 text-sm">Pendientes</div>
          <div class="text-[#ffc107] text-3xl md:text-4xl font-bold mt-1">
            {{
              prestamoStore.prestamos.filter((p) => p.estado.toLowerCase() === 'pendiente').length
            }}
          </div>
          <div class="text-gray-400 text-xs mt-1">Esperando aprobación</div>
        </div>

        <div class="bg-[#1e2130] rounded-lg p-4">
          <div class="text-gray-400 text-sm">Monto Total</div>
          <div class="text-[#00b0ff] text-3xl md:text-4xl font-bold mt-1">
            ${{ calcularMontoTotal() }}
          </div>
          <div class="text-gray-400 text-xs mt-1">Capital prestado</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { usePrestamoStore } from '../store/prestamos.store'

interface Props {
  modelValue: boolean
}

defineProps<Props>()
defineEmits(['update:modelValue'])

const prestamoStore = usePrestamoStore()
const authStore = useAuthStore()
console.log(authStore.nombre_negocio)

const calcularMontoTotal = () => {
  return prestamoStore.prestamos
    .reduce((total, prestamo) => total + prestamo.monto, 0)
    .toLocaleString()
}
</script>
