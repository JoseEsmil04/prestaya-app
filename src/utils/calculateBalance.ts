import type { FrecuenciaPago } from '@/modules/prestamos/types/frecuencia-pago.type'

interface CurrentBalanceParams {
  fechaInicio: string
  frecuenciaPago: FrecuenciaPago
  interesFijo: number
  monto: number
}
export const calculateCurrentBalance = (options: CurrentBalanceParams): number => {
  const { fechaInicio, frecuenciaPago, interesFijo, monto } = options

  const startDate = new Date(fechaInicio)
  const msDifference = new Date().getTime() - startDate.getTime()
  const daysElapsed = Math.max(0, Math.floor(msDifference / (1000 * 60 * 60 * 24)))

  const intervalLength = frecuenciaPago === 'quincenal' ? 15 : 30
  const intervalsPassed = Math.floor(daysElapsed / intervalLength)

  const totalInterest = intervalsPassed * interesFijo!
  const currentBalance = monto + totalInterest

  return currentBalance
}
