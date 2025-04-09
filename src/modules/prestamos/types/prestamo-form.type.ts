import type { FrecuenciaPago } from './frecuencia-pago.type'
import type { EstadoPrestamo } from './prestamo.type'

export interface PrestamoFormValues {
  nombre: string
  contacto: string
  monto: number
  tasa_interes: number
  frecuencia_pago: FrecuenciaPago
  interes_fijo: number
  fecha_inicio: string
  estado: EstadoPrestamo
}
