<template>
  <div
    v-show="showModal"
    class="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center"
    @click.self="$emit('cerrar')"
  >
    <div
      class="w-full sm:max-w-md bg-base-100 rounded-t-2xl sm:rounded-xl p-5 shadow-lg animate-slide-up max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl text-[#0de8be] font-bold">Detalle del Préstamo</h2>
        <button class="btn btn-sm btn-circle btn-ghost" @click="$emit('cerrar')">✕</button>
      </div>
      <ul v-if="prestamo" class="text-md space-y-2">
        <li><strong>Monto:</strong> ${{ prestamo.monto }}</li>
        <li><strong>Interés Fijo:</strong> ${{ prestamo.interes_fijo }}</li>
        <li><strong>Frecuencia:</strong> {{ prestamo.frecuencia_pago }}</li>
        <li><strong>Estado:</strong> {{ prestamo.estado }}</li>
        <li><strong>Inicio:</strong> {{ formatFecha(prestamo.fecha_inicio) }}</li>
        <li><strong>Proximo Cobro:</strong> {{ nextPaymentDate }}</li>
      </ul>
      <div class="pt-6 flex space-x-4 justify-center w-auto">
        <button class="flex-1 btn btn-outline btn-accent" @click="mostrarForm = true">
          Modificar Prestamo
        </button>
        <button class="flex-1 btn btn-outline btn-error" @click="$emit('cerrar')">
          Eliminar Prestamo
        </button>
      </div>
    </div>
  </div>
  <div class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': mostrarForm }">
    <div class="modal-box bg-[#1e2130] text-white">
      <button @click="mostrarForm = false" class="btn btn-sm btn-circle absolute right-2 top-2">
        ✕
      </button>
      <h3 class="font-bold text-lg mb-4">Modificar Prestamo</h3>
      <PrestamoForm :prestamo-id="prestamo.id" @cerrar="mostrarForm = false" />
    </div>
    <div class="modal-backdrop" @click="mostrarForm = false"></div>
  </div>
</template>

<script setup lang="ts">
import { formatFecha } from '@/utils/formatters'
import { getNextPaymentDate } from '@/utils/next-date'
import { computed, ref } from 'vue'
import type { FrecuenciaPago } from '../types/frecuencia-pago.type'
import type { Prestamo } from '../types/prestamo.type'
import PrestamoForm from './PrestamoForm.vue'

interface Props {
  showModal: boolean
  prestamo: Prestamo
}

const props = defineProps<Props>()
defineEmits(['cerrar'])

const mostrarForm = ref(false)
const nextPaymentDate = computed(() =>
  getNextPaymentDate(
    props.prestamo?.fecha_inicio as string,
    props.prestamo?.frecuencia_pago as FrecuenciaPago,
  ),
)
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
