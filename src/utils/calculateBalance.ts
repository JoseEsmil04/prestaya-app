import type { Prestamo } from '@/modules/prestamos/types/prestamo.type'

export const calculateCurrentBalance = (
  prestamo: Prestamo,
  currentDate: Date = new Date(),
): number => {
  const startDate = new Date(prestamo.fecha_inicio)
  const msDifference = currentDate.getTime() - startDate.getTime()
  const daysElapsed = Math.max(0, Math.floor(msDifference / (1000 * 60 * 60 * 24)))

  const intervalLength = prestamo.frecuencia_pago === 'quincenal' ? 15 : 30
  const intervalsPassed = Math.floor(daysElapsed / intervalLength)

  const totalInterest = intervalsPassed * prestamo.interes_fijo!
  const currentBalance = prestamo.monto + totalInterest

  return currentBalance
}
