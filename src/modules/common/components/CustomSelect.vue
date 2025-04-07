<template>
  <div class="form-control">
    <label class="label text-sm font-bold">{{ label }}</label>
    <select
      :value="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="$emit('blur')"
      class="select select-bordered w-full"
    >
      <option disabled value="">Seleccione una opción</option>
      <option v-for="(text, key) in options" :key="key" :value="key">
        {{ text }}
      </option>
    </select>
    <span class="text-error text-sm mt-1">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string
  modelValue: string | number
  options: Record<string, string> // ej: { activo: 'Activo', pagado: 'Pagado' }
  label?: string
}
defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'blur'])
</script>
