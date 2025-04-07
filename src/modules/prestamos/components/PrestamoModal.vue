<template>
  <div
    v-show="showModal"
    class="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center"
    @click.self="$emit('cerrar')"
  >
    <!-- Modal -->
    <div
      class="w-full sm:max-w-md bg-base-100 rounded-t-2xl sm:rounded-xl p-5 shadow-lg animate-slide-up max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Detalle del Préstamo</h2>
        <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('cerrar')">✕</button>
      </div>

      <!-- Contenido -->
      <ul class="text-sm space-y-2">
        <li><strong>Monto:</strong> ${{ prestamo.monto }}</li>
        <li><strong>Interés Fijo:</strong> ${{ prestamo.interes_fijo }}</li>
        <li><strong>Frecuencia:</strong> {{ prestamo.frecuencia_pago }}</li>
        <li><strong>Estado:</strong> {{ prestamo.estado }}</li>
        <li><strong>Inicio:</strong> {{ formatFecha(prestamo.fecha_inicio) }}</li>
      </ul>

      <!-- Footer opcional -->
      <div class="pt-6">
        <button class="btn btn-outline btn-block btn-primary" @click="$emit('cerrar')">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prestamo } from '@/modules/prestamos/types/prestamo.type'
import { formatFecha } from '@/utils/formatters'

defineProps<{
  showModal: boolean
  prestamo: Prestamo
}>()

defineEmits(['cerrar'])
</script>

<style scoped>
@keyframes slide-up {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
