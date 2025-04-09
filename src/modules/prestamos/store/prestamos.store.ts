import { supabase } from '@/lib/supabaseClient'
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import type { Prestamo } from '../types/prestamo.type'
import { calculateCurrentBalance } from '@/utils/calculateBalance'

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
    const { error } = await supabase.from('prestamos').update(data).eq('id', id)

    if (error) throw error
  }

  const actualizarBalancePrestamos = async () => {
    if (!prestamos.value) return
    for (const prestamo of prestamos.value) {
      const nuevoBalance = calculateCurrentBalance(prestamo)
      await supabase.from('prestamos').update({ balance: nuevoBalance }).eq('id', prestamo.id)
    }
  }

  onMounted(async () => {
    await fetchPrestamos()
    await actualizarBalancePrestamos()
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
