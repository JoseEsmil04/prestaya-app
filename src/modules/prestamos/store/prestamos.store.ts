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
      return
    }

    prestamos.value = data || []
    loading.value = false
  }

  const getPrestamoById = async (id: string): Promise<Prestamo> => {
    const { data, error } = await supabase.from('prestamos').select('*').eq('id', id).single()

    if (error) throw error
    return data
  }

  const crearPrestamo = async (nuevo: Omit<Prestamo, 'id' | 'created_at'>) => {
    const { data, error: err } = await supabase.from('prestamos').insert(nuevo).select()
    if (err) throw err
    if (data) prestamos.value.push(...data)
  }

  const actualizarPrestamo = async (id: string, data: Partial<Prestamo>) => {
    const { data: updated, error } = await supabase
      .from('prestamos')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) return

    const index = prestamos.value.findIndex((p) => p.id === id)
    if (index !== -1) prestamos.value[index] = updated
  }

  onMounted(async () => {
    await fetchPrestamos()
  })

  return {
    prestamos,
    loading,
    error,
    fetchPrestamos,
    crearPrestamo,
    getPrestamoById,
    actualizarPrestamo,
  }
})
