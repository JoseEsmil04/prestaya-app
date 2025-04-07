<template>
  <div
    class="card bg-base-100 hover:shadow-lg transition-all duration-300 border border-base-300 overflow-hidden"
  >
    <!-- Header con monto y estado -->
    <div class="bg-base-200/50 p-4 flex justify-between items-center border-b border-base-300">
      <h2 class="text-2xl font-bold">${{ prestamo.monto.toLocaleString() }}</h2>
      <span :class="['badge badge-outline px-3 py-2 font-medium text-xs', badgeClass]">
        {{ prestamo.estado.toUpperCase() }}
      </span>
    </div>

    <!-- Cuerpo con detalles -->
    <div class="card-body p-4">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <i class="i-lucide-percent text-primary"></i>
          </div>
          <div>
            <p class="text-sm text-base-content/70">Interés fijo</p>
            <p class="font-semibold">${{ prestamo.interes_fijo }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <i class="i-lucide-calendar text-primary"></i>
          </div>
          <div>
            <p class="text-sm text-base-content/70">Frecuencia</p>
            <p class="font-semibold">{{ prestamo.frecuencia_pago }}</p>
          </div>
        </div>
      </div>

      <!-- Botón de acción -->
      <div class="border-t border-[#2a2a2a] p-3">
        <button
          @click="showModal = true"
          class="btn btn-outline group w-full text-[#5b5ef7] flex items-center justify-center gap-2 py-1"
        >
          Ver Detalle
          <i class="i-lucide-chevron-right transition-transform group-hover:translate-x-1"></i>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <PrestamoModal
      v-if="showModal"
      :show-modal="showModal"
      :prestamo="prestamo"
      @cerrar="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Prestamo } from '../types/prestamo.type'
import { EstadoPrestamo } from '../types/prestamo.type'
import PrestamoModal from './PrestamoModal.vue'

interface Props {
  prestamo: Prestamo
}

const showModal = ref(false)
const props = defineProps<Props>()

const badgeClass = computed(() => {
  switch (props.prestamo.estado) {
    case EstadoPrestamo.activo:
      return 'badge badge-success'
    case EstadoPrestamo.pagado:
      return 'badge badge-secondary'
    case EstadoPrestamo.vencido:
      return 'badge badge-error'
    default:
      return 'badge badge-neutral'
  }
})
</script>
<style scoped>
/* Iconos de Lucide con clases de utilidad */
.i-lucide-percent {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='5' x2='5' y2='19'%3E%3C/line%3E%3Ccircle cx='6.5' cy='6.5' r='2.5'%3E%3C/circle%3E%3Ccircle cx='17.5' cy='17.5' r='2.5'%3E%3C/circle%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  width: 1.25rem;
  height: 1.25rem;
}

.i-lucide-calendar {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  width: 1.25rem;
  height: 1.25rem;
}

.i-lucide-chevron-right {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  width: 1rem;
  height: 1rem;
}
</style>
