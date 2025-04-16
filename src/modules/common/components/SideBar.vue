<template>
  <div>
    <!-- Botón hamburguesa SOLO EN MOBILE -->
    <button
      class="lg:hidden fixed top-4 left-4 z-50 btn btn-square btn-sm bg-base-200 text-white shadow"
      @click="toggleSidebar"
    >
      <SquareMenu color="#0de8be" class="w-5 h-5" />
    </button>

    <!-- Overlay + blur SOLO EN MOBILE -->
    <div
      v-if="open && isMobile"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 z-40"
      @click="closeSidebar"
    ></div>

    <!-- SIDEBAR siempre visible en desktop, deslizable en mobile -->
    <aside
      class="fixed top-0 left-0 h-full w-64 bg-[#1b1f2a] text-white z-50 shadow-lg transition-transform duration-300 ease-in-out"
      :class="[isMobile && !open ? '-translate-x-full' : 'translate-x-0']"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-8 border-b border-base-300">
        <h1 class="text-2xl font-bold truncate">Prestaya</h1>
        <!-- Botón cerrar SOLO EN MOBILE -->
        <button v-if="isMobile" class="btn btn-sm btn-ghost text-white" @click="closeSidebar">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Menú -->
      <ul class="text-base font-medium px-4 pt-8 space-y-6">
        <li class="w-full">
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/dashboard"
          >
            <LayoutDashboard class="w-5 h-5" />
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/prestamos"
          >
            <Wallet class="w-5 h-5" />
            <span>Préstamos</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/prestamos"
          >
            <Receipt class="w-5 h-5" />
            <span>Pagos</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/prestamos"
          >
            <BarChart2 class="w-5 h-5" />
            <span>Reportes</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/prestamos"
          >
            <Settings class="w-5 h-5" />
            <span>Configuración</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="w-full flex items-center gap-3 py-3 hover:bg-[#2a2f3d] hover:text-[#0de8be] rounded-lg p-2 transition-colors"
            to="/prestamos"
          >
            <LogOut class="w-5 h-5" />
            <span>Cerrar Sesion</span>
          </RouterLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  LayoutDashboard,
  Wallet,
  BarChart2,
  Settings,
  X,
  SquareMenu,
  LogOut,
  Receipt,
} from 'lucide-vue-next'

const emit = defineEmits(['update:open'])
const open = ref(false)
const isMobile = ref(false)

function toggleSidebar() {
  open.value = !open.value
}
function closeSidebar() {
  open.value = false
}

onMounted(() => {
  const checkDevice = () => {
    isMobile.value = window.innerWidth < 1024
    open.value = false // cerrar en móvil por defecto
  }
  window.addEventListener('resize', checkDevice)
  checkDevice()
})

watch(open, (val) => emit('update:open', val))
</script>
