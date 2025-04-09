import { FrecuenciaPago } from '@/modules/prestamos/types/frecuencia-pago.type'

export const getNextPaymentDate = (startDate: string, frecuencia: FrecuenciaPago): string => {
  const base = new Date(startDate)
  const now = new Date()

  const nextDate = new Date(base)
  while (nextDate <= now) {
    if (frecuencia === 'quincenal') {
      nextDate.setDate(nextDate.getDate() + 15)
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1)
    }
  }

  return nextDate.toISOString().split('T')[0] // formato YYYY-MM-DD
}
