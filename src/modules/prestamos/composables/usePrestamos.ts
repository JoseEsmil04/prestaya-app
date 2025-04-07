import { useForm } from 'vee-validate'
import { computed } from 'vue'
import * as yup from 'yup'
import { EstadoPrestamo } from '../types/prestamo.type'
import { FrecuenciaPago } from '../types/frecuencia-pago.type'
import { usePrestamoStore } from '../store/prestamos.store'
import type { PrestamoFormValues } from '../types/prestamo-form.type'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

type EmitArg = (e: 'cerrar') => void

export const usePrestamos = (emit: EmitArg) => {
  const router = useRouter()
  const prestamoStore = usePrestamoStore()

  const schema = yup.object({
    monto: yup
      .number()
      .required('Este Campo es Requerido!')
      .positive('El monto debe ser mayor a 0.'),
    tasa_interes: yup
      .number()
      .required('Este Campo es Requerido!')
      .positive('La tasa de Interes debe ser mayor a 0'),
    frecuencia_pago: yup.mixed<FrecuenciaPago>().oneOf(Object.values(FrecuenciaPago)).required(),
    fecha_inicio: yup.string().required(),
    estado: yup.mixed<EstadoPrestamo>().oneOf(Object.values(EstadoPrestamo)).required(),
  })

  const { handleSubmit, values, defineField, errors } = useForm<PrestamoFormValues>({
    validationSchema: schema,
    initialValues: {
      monto: 0,
      tasa_interes: 10,
      frecuencia_pago: FrecuenciaPago.quincenal,
      estado: EstadoPrestamo.activo,
    },
  })

  const [monto, montoAttrs] = defineField('monto')
  const [tasa_interes, tasa_interesAttrs] = defineField('tasa_interes')
  const [frecuencia_pago, frecuencia_pagoAttrs] = defineField('frecuencia_pago')
  const [fecha_inicio, fecha_inicioAttrs] = defineField('fecha_inicio')
  const [estado, estadoAttrs] = defineField('estado')

  const interesFijo = computed(() => Math.round(values.monto * (values.tasa_interes / 100)))

  const onSubmit = handleSubmit(async (values: PrestamoFormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session?.session?.user.id

      if (!userId) {
        router.replace({ name: 'login' })
        // Todo Hacer algo con Auth error
        return
      }

      await prestamoStore.crearPrestamo({
        ...values,
        interes_fijo: interesFijo.value,
        user_id: userId,
        deudor_id: '123e4567-e89b-12d3-a456-426614174011',
      })
      await prestamoStore.fetchPrestamos()
      emit('cerrar')
    } catch (error) {
      console.log(error)
    }
  })

  return {
    errors,
    monto,
    montoAttrs,
    tasa_interes,
    tasa_interesAttrs,
    frecuencia_pago,
    frecuencia_pagoAttrs,
    fecha_inicio,
    fecha_inicioAttrs,
    estado,
    estadoAttrs,
    onSubmit,
  }
}
