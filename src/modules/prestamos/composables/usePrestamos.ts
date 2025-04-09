import { useForm } from 'vee-validate'
import { computed } from 'vue'
import * as yup from 'yup'
import { EstadoPrestamo, type Prestamo } from '../types/prestamo.type'
import { FrecuenciaPago } from '../types/frecuencia-pago.type'
import { usePrestamoStore } from '../store/prestamos.store'
import type { PrestamoFormValues } from '../types/prestamo-form.type'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'
import { calculateCurrentBalance } from '@/utils/calculateBalance'
import { toTypedSchema } from '@vee-validate/yup'
import { getNextPaymentDate } from '@/utils/next-date'

type EmitArg = (e: 'cerrar') => void

export const usePrestamos = (emit: EmitArg, prestamoId?: string) => {
  const router = useRouter()
  const prestamoStore = usePrestamoStore()

  const schema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio.').min(3),
    contacto: yup
      .string()
      .required()
      .matches(
        /^(809|829|849)[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
        'Formato no válido. Ej: 849-555-1234 o 8495551234',
      ),
    monto: yup.number().required().positive().typeError('Debe ser un número'),
    tasa_interes: yup.number().required().positive().typeError('Debe ser un número'),
    frecuencia_pago: yup.mixed<FrecuenciaPago>().oneOf(Object.values(FrecuenciaPago)).required(),
    fecha_inicio: yup.string().required('La fecha de inicio del prestamo es requerida.'),
    estado: yup.mixed<EstadoPrestamo>().oneOf(Object.values(EstadoPrestamo)).required(),
  })

  const { handleSubmit, values, defineField, errors } = useForm<PrestamoFormValues>({
    validationSchema: toTypedSchema(schema),
    initialValues: {
      monto: 0,
      tasa_interes: 10,
      frecuencia_pago: FrecuenciaPago.quincenal,
      estado: EstadoPrestamo.activo,
    },
  })

  const [nombre, nombreAttrs] = defineField('nombre')
  const [contacto, contactoAttrs] = defineField('contacto')
  const [monto, montoAttrs] = defineField('monto')
  const [tasa_interes, tasa_interesAttrs] = defineField('tasa_interes')
  const [frecuencia_pago, frecuencia_pagoAttrs] = defineField('frecuencia_pago')
  const [fecha_inicio, fecha_inicioAttrs] = defineField('fecha_inicio')
  const [estado, estadoAttrs] = defineField('estado')

  const interesFijo = computed(() => Math.round(values.monto * (values.tasa_interes / 100)))

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session?.session?.user.id

      if (!userId) {
        router.replace({ name: 'login' })
        return
      }

      const payloadBase = {
        nombre: formValues.nombre,
        contacto: formValues.contacto,
        monto: formValues.monto,
        tasa_interes: formValues.tasa_interes,
        interes_fijo: interesFijo.value,
        estado: formValues.estado,
        frecuencia_pago: formValues.frecuencia_pago,
        fecha_inicio: formValues.fecha_inicio,
      }

      const balance = calculateCurrentBalance({
        ...payloadBase,
      } as Prestamo)

      if (prestamoId) {
        await prestamoStore.actualizarPrestamo(prestamoId, {
          ...payloadBase,
          balance,
          proxima_fecha_pago: getNextPaymentDate(
            payloadBase.fecha_inicio,
            payloadBase.frecuencia_pago,
          ),
        })
      } else {
        await prestamoStore.crearPrestamo({
          ...payloadBase,
          user_id: userId,
          balance,
          proxima_fecha_pago: getNextPaymentDate(
            payloadBase.fecha_inicio,
            payloadBase.frecuencia_pago,
          ),
        })
      }

      emit('cerrar')
    } catch (error) {
      console.error('Error en onSubmit:', error)
    }
  })

  return {
    errors,
    nombre,
    nombreAttrs,
    contacto,
    contactoAttrs,
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
