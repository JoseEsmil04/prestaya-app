export function formatFecha(fechaStr: string): string {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const formatMoneda = (value: number) => {
  if (!value) return '0.00'
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
