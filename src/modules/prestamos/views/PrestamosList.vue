<template>
  <div class="min-h-screen bg-[#121212]">
    <PrestamosHeader :prestamo-store="prestamoStore" v-model="mostrarForm" />

    <div class="container mx-auto px-4">
      <div class="border-b border-[#2a2a2a] mt-6">
        <div class="flex overflow-x-auto">
          <button
            v-for="filtro in filtros"
            :key="filtro.valor"
            @click="filtroActual = filtro.valor"
            :class="[
              'px-6 py-3 text-sm whitespace-nowrap',
              filtroActual === filtro.valor
                ? 'text-white border-b-2 border-[#5b5ef7]'
                : 'text-gray-400',
            ]"
          >
            {{ filtro.texto }}
          </button>
        </div>
      </div>
      <div class="relative my-6">
        <input
          type="text"
          placeholder="Buscar préstamo..."
          v-model="busqueda"
          class="w-full bg-[#1e2130] text-white border-none rounded-lg py-3 px-4 pr-10"
        />
        <svg
          class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
          <path
            d="M21 21L16.65 16.65"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div v-if="prestamoStore.loading" class="flex flex-col items-center justify-center py-16">
        <span class="loading loading-spinner loading-lg text-[#5b5ef7] mb-4"></span>
        <p class="text-gray-400">Cargando préstamos...</p>
      </div>
      <div
        v-else-if="prestamosFiltrados.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg
          class="w-16 h-16 text-gray-600 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
          <path d="M12 12V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <h3 class="text-xl font-bold text-white mb-2">No hay préstamos</h3>
        <p class="text-gray-400 mb-6 max-w-xs mx-auto">
          {{
            busqueda || filtroActual !== 'todos'
              ? 'No se encontraron préstamos con los filtros actuales.'
              : 'Aún no has registrado ningún préstamo en el sistema.'
          }}
        </p>
        <button
          class="btn bg-[#5b5ef7] hover:bg-[#4b4ef0] text-white border-none"
          @click="mostrarForm = true"
        >
          <svg
            class="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          Crear primer préstamo
        </button>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        <PrestamoCard
          v-for="prestamo in prestamosFiltrados"
          :key="prestamo.id"
          :prestamo="prestamo"
        />
      </div>
    </div>
    <div class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': mostrarForm }">
      <div class="modal-box bg-[#1e2130] text-white">
        <button @click="mostrarForm = false" class="btn btn-sm btn-circle absolute right-2 top-2">
          ✕
        </button>
        <h3 class="font-bold text-lg mb-4">Nuevo Préstamo</h3>
        <PrestamoForm @cerrar="mostrarForm = false" />
      </div>
      <div class="modal-backdrop" @click="mostrarForm = false"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import PrestamoCard from '../components/PrestamoCard.vue'
import { usePrestamoStore } from '../store/prestamos.store'
import PrestamosHeader from '../components/PrestamosHeader.vue'
import PrestamoForm from '../components/PrestamoForm.vue'
import type { Filtro } from '../types/filtro.interface'

const prestamoStore = usePrestamoStore()
const mostrarForm = ref(false)
const busqueda = ref('')
const filtroActual = ref('todos')

const filtros: Filtro[] = [
  { texto: 'Todos', valor: 'todos' },
  { texto: 'Activos', valor: 'activo' },
  { texto: 'Vencidos', valor: 'vencido' },
  { texto: 'Pagados', valor: 'pagado' },
]

const prestamosFiltrados = computed(() => {
  let resultado = prestamoStore.prestamos

  if (filtroActual.value !== 'todos') {
    resultado = resultado.filter((p) => p.estado.toLowerCase() === filtroActual.value)
  }

  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    resultado = resultado.filter(
      (p) =>
        p.nombre.toString().includes(termino) || p.frecuencia_pago.toLowerCase().includes(termino),
    )
  }

  return resultado
})
</script>

<style scoped>
.i-lucide-plus-circle {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='16'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='16' y2='12'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-plus {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-wallet {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12V7H5a2 2 0 0 1 0-4h14v4'%3E%3C/path%3E%3Cpath d='M3 5v14a2 2 0 0 0 2 2h16v-5'%3E%3C/path%3E%3Cpath d='M18 12a2 2 0 0 0 0 4h4v-4Z'%3E%3C/path%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-check-circle {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-alert-circle {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-dollar-sign {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='1' x2='12' y2='23'%3E%3C/line%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'%3E%3C/path%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-search {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.i-lucide-file-question {
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpath d='M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2'%3E%3C/path%3E%3Cpath d='M12 17h.01'%3E%3C/path%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
</style>
