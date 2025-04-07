<template>
  <div class="form-control">
    <label class="label text-sm font-bold">{{ label }}</label>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="emit('blur')"
      class="input input-bordered w-full"
      :type="type"
    />
    <span v-if="error" class="text-error text-sm mt-1">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string
  modelValue: string | number
  label?: string
  type?: 'text' | 'date'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits(['update:modelValue', 'blur'])
</script>
