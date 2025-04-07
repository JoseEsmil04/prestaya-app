export enum EstadoPrestamo {
  activo = 'activo',
  pagado = 'pagado',
  vencido = 'vencido',
}

export interface Prestamo {
  id: string
  user_id?: string
  deudor_id?: string
  monto: number
  tasa_interes: number
  interes_fijo?: number // opcional, se puede calcular
  frecuencia_pago: string
  fecha_inicio: string
  estado: EstadoPrestamo
  created_at?: string
}
