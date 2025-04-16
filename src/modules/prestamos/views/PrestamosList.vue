<template>
  <SideBar v-model:open="sidebarOpen" />
  <main class="lg:ml-64 p-4 min-h-screen bg-[#121212] transition-all duration-300">
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
        <Search class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div v-if="prestamoStore.loading" class="flex flex-col items-center justify-center py-16">
        <span class="loading loading-spinner loading-lg text-[#5b5ef7] mb-4"></span>
        <p class="text-gray-400">Cargando préstamos...</p>
      </div>
      <div
        v-else-if="prestamosFiltrados.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <FileIcon />
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
          <Plus />
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
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import PrestamoCard from '../components/PrestamoCard.vue'
import { usePrestamoStore } from '../store/prestamos.store'
import PrestamosHeader from '../components/PrestamosHeader.vue'
import PrestamoForm from '../components/PrestamoForm.vue'
import type { Filtro } from '../types/filtro.interface'
import SideBar from '@/modules/common/components/SideBar.vue'
import { Plus, Search } from 'lucide-vue-next'
import FileIcon from '@/modules/common/icons/FileIcon.vue'

const prestamoStore = usePrestamoStore()
const mostrarForm = ref(false)
const busqueda = ref('')
const filtroActual = ref('todos')
// Suponiendo que el Sidebar exporta un estado global con Pinia (opcional)
const sidebarOpen = ref(true)

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

<style scoped></style>
