import type { FrecuenciaPago } from '@/modules/prestamos/types/frecuencia-pago.type'

export function getNextPaymentDate(startDate: string, frecuencia: FrecuenciaPago): string {
  if (!startDate) return 'Fecha no disponible'

  const baseDate = new Date(startDate)

  const nextDate = new Date(baseDate)

  if (frecuencia === 'quincenal') {
    nextDate.setDate(nextDate.getDate() + 15)
  } else if (frecuencia === 'mensual') {
    nextDate.setMonth(nextDate.getMonth() + 1)
  }

  return nextDate.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
