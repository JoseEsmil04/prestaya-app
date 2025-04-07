import { supabase } from '@/lib/supabaseClient'
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import type { Prestamo } from '../types/prestamo.type'

export const usePrestamoStore = defineStore('prestamo', () => {
  const prestamos = ref<Prestamo[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchPrestamos = async () => {
    loading.value = true
    const { data, error: err } = await supabase.from('prestamos').select('*')
    if (err) {
      error.value = err.message
    } else {
      prestamos.value = data || []
    }
    loading.value = false
  }

  const crearPrestamo = async (nuevo: Omit<Prestamo, 'id' | 'created_at'>) => {
    const { data, error: err } = await supabase.from('prestamos').insert(nuevo).select()
    if (err) throw err
    if (data) prestamos.value.push(...data)
  }

  onMounted(fetchPrestamos)

  return {
    prestamos,
    loading,
    error,
    fetchPrestamos,
    crearPrestamo,
  }
})
