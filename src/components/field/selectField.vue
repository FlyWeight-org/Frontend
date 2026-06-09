<script setup lang="ts">
import type { Errors } from '@/stores/types'
import { defineErrorRefs, defineIDRefs } from '@/components/field/common'

interface Option {
  value: string
  label: string
}

interface Props {
  object: string
  field: string
  modelValue: string

  label: string

  options?: Option[]

  errors?: Errors
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  errors: undefined,
})
defineEmits<(event: 'update:modelValue', value: string) => void>()

const { id, name } = defineIDRefs(props)
const { hasError } = defineErrorRefs(props)

function targetValue(event: Event): string {
  return (event.target as HTMLSelectElement).value
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label :for="id">
    <span>{{ label }}</span>
    <select
      v-bind="$attrs"
      :id="id"
      :name="name"
      :value="modelValue"
      :class="{ invalid: hasError }"
      :aria-invalid="hasError"
      @change="$emit('update:modelValue', targetValue($event))"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
