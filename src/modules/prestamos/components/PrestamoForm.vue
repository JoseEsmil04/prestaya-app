<template>
  <form @submit.prevent="onSubmit" class="space-y-2">
    <div class="bg-base-200/50 p-4 rounded-lg">
      <h3 class="font-medium text-base-content/80 mb-4 flex items-center gap-2">
        <i class="i-lucide-info w-4 h-4"></i>
        Información Principal
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-1">
          <CustomInput
            label="Nombre del Deudor"
            v-model="nombre"
            v-bind="nombreAttrs"
            :error="errors.nombre"
            class="input-money"
          >
          </CustomInput>
        </div>
        <div class="md:col-span-1">
          <CustomInput
            label="Telefono del Deudor"
            v-model="contacto"
            v-bind="contactoAttrs"
            :error="errors.contacto"
            class="input-percentage"
          >
            <template #icon>
              <i class="i-lucide-percent w-5 h-5 text-primary/70"></i>
            </template>
            <template #hint>
              <span class="text-xs text-base-content/60">Tasa de interés anual</span>
            </template>
          </CustomInput>
        </div>
      </div>
    </div>

    <div class="bg-base-200/50 p-4 rounded-lg">
      <h3 class="font-medium text-base-content/80 mb-4 flex items-center gap-2">
        <i class="i-lucide-info w-4 h-4"></i>
        Monto y Tasa de Interes
      </h3>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-1">
          <CustomInput
            label="Monto"
            v-model.number="monto"
            v-bind="montoAttrs"
            :error="errors.monto"
            prefix="$"
            class="input-money"
          >
            <template #icon>
              <i class="i-lucide-dollar-sign w-5 h-5 text-primary/70"></i>
            </template>
            <template #hint>
              <span class="text-xs text-base-content/60">Ingrese el monto del préstamo</span>
            </template>
          </CustomInput>
        </div>
        <div class="md:col-span-1">
          <CustomInput
            label="Tasa de Interés"
            v-model.number="tasa_interes"
            v-bind="tasa_interesAttrs"
            :error="errors.tasa_interes"
            suffix="%"
            class="input-percentage"
          >
            <template #icon>
              <i class="i-lucide-percent w-5 h-5 text-primary/70"></i>
            </template>
            <template #hint>
              <span class="text-xs text-base-content/60">Tasa de interés anual</span>
            </template>
          </CustomInput>
        </div>
      </div>
    </div>
    <div class="bg-base-200/50 p-4 rounded-lg">
      <h3 class="font-medium text-base-content/80 mb-4 flex items-center gap-2">
        <i class="i-lucide-calendar w-4 h-4"></i>
        Condiciones y Plazos
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-1">
          <CustomSelect
            label="Frecuencia de Pago"
            v-model="frecuencia_pago"
            v-bind="frecuencia_pagoAttrs"
            :options="FrecuenciaPago"
            :error="errors.frecuencia_pago"
          >
            <template #icon>
              <i class="i-lucide-repeat w-5 h-5 text-primary/70"></i>
            </template>
            <template #hint>
              <span class="text-xs text-base-content/60">Periodicidad de los pagos</span>
            </template>
          </CustomSelect>
        </div>
        <div class="md:col-span-1">
          <CustomInput
            label="Fecha de Inicio"
            v-model="fecha_inicio"
            v-bind="fecha_inicioAttrs"
            :error="errors.fecha_inicio"
            type="date"
          >
            <template #icon>
              <i class="i-lucide-calendar-days w-5 h-5 text-primary/70"></i>
            </template>
            <template #hint>
              <span class="text-xs text-base-content/60">Fecha de desembolso</span>
            </template>
          </CustomInput>
        </div>
      </div>
    </div>
    <div class="bg-base-200/50 p-4 rounded-lg">
      <h3 class="font-medium text-base-content/80 mb-4 flex items-center gap-2">
        <i class="i-lucide-activity w-4 h-4"></i>
        Estado del Préstamo
      </h3>
      <CustomSelect
        label="Estado"
        v-model="estado"
        v-bind="estadoAttrs"
        :options="EstadoPrestamo"
        :error="errors.estado"
      >
        <template #icon>
          <i class="i-lucide-check-circle w-5 h-5 text-primary/70"></i>
        </template>
        <template #option="{ option }">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'w-3 h-3 rounded-full',
                option.value === 'activo'
                  ? 'bg-success'
                  : option.value === 'pendiente'
                    ? 'bg-warning'
                    : option.value === 'vencido'
                      ? 'bg-error'
                      : 'bg-info',
              ]"
            ></span>
            {{ option.label }}
          </div>
        </template>
      </CustomSelect>
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
      <button @click="emit('cerrar')" type="button" class="btn text-white btn-error gap-2">
        <i class="i-lucide-x w-4 h-4"></i>
        Cancelar
      </button>

      <button type="submit" class="btn btn-primary gap-2">
        <i class="i-lucide-save w-4 h-4"></i>
        {{ prestamoId ? 'Guardar Prestamo' : 'Crear Prestamo' }}
      </button>
    </div>
  </form>
</template>
<script setup lang="ts">
import { usePrestamos } from '../composables/usePrestamos'
import { EstadoPrestamo, type Prestamo } from '../types/prestamo.type'
import { FrecuenciaPago } from '../types/frecuencia-pago.type'
import CustomInput from '@/modules/common/components/CustomInput.vue'
import CustomSelect from '@/modules/common/components/CustomSelect.vue'
import { usePrestamoStore } from '../store/prestamos.store'
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  (e: 'cerrar'): void
}>()

interface Props {
  prestamoId?: string
}

const props = defineProps<Props>()

const prestamoStore = usePrestamoStore()
const prestamo = ref<Prestamo | null>(null)

onMounted(async () => {
  if (!props.prestamoId) return

  prestamo.value = await prestamoStore.getPrestamoById(props.prestamoId)
  if (prestamo.value) {
    nombre.value = prestamo.value.nombre
    contacto.value = prestamo.value.contacto
    monto.value = prestamo.value.monto
    tasa_interes.value = prestamo.value.tasa_interes
    estado.value = prestamo.value.estado
    fecha_inicio.value = prestamo.value.fecha_inicio
  }
})

const {
  onSubmit,
  errors,
  nombre,
  nombreAttrs,
  contacto,
  contactoAttrs,
  monto,
  montoAttrs,
  tasa_interes,
  tasa_interesAttrs,
  frecuencia_pago,
  frecuencia_pagoAttrs,
  estado,
  estadoAttrs,
  fecha_inicio,
  fecha_inicioAttrs,
} = usePrestamos(emit, props.prestamoId)
</script>
<style scoped>
.i-lucide-dollar-sign {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='1' x2='12' y2='23'%3E%3C/line%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'%3E%3C/path%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-percent {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='19' y1='5' x2='5' y2='19'%3E%3C/line%3E%3Ccircle cx='6.5' cy='6.5' r='2.5'%3E%3C/circle%3E%3Ccircle cx='17.5' cy='17.5' r='2.5'%3E%3C/circle%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-calendar {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-calendar-days {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3Cline x1='8' y1='14' x2='8' y2='14'%3E%3C/line%3E%3Cline x1='12' y1='14' x2='12' y2='14'%3E%3C/line%3E%3Cline x1='16' y1='14' x2='16' y2='14'%3E%3C/line%3E%3Cline x1='8' y1='18' x2='8' y2='18'%3E%3C/line%3E%3Cline x1='12' y1='18' x2='12' y2='18'%3E%3C/line%3E%3Cline x1='16' y1='18' x2='16' y2='18'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-repeat {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m17 2 4 4-4 4'%3E%3C/path%3E%3Cpath d='M3 11v-1a4 4 0 0 1 4-4h14'%3E%3C/path%3E%3Cpath d='m7 22-4-4 4-4'%3E%3C/path%3E%3Cpath d='M21 13v1a4 4 0 0 1-4 4H3'%3E%3C/path%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-check-circle {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-activity {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='22 12 18 12 15 21 9 3 6 12 2 12'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-file-text {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-save {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'%3E%3C/path%3E%3Cpolyline points='17 21 17 13 7 13 7 21'%3E%3C/polyline%3E%3Cpolyline points='7 3 7 8 15 8'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-x {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-info {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
</style>
