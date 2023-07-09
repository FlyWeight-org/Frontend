<template>
  <label :for="id">
    <span>{{ label }}</span>
    <input
      :type="type"
      v-bind="$attrs"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', targetValue($event))"
      :class="{ invalid: hasError }"
      :aria-invalid="hasError"
    />
  </label>
</template>

<script setup lang="ts">
import type { Errors } from '@/stores/types'
import { defineErrorRefs, defineIDRefs } from '@/components/field/common'

interface Props {
  type: string
  object: string
  field: string
  modelValue: string

  label: string

  errors?: Errors
}

const props = defineProps<Props>()
defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const { id, name } = defineIDRefs(props)
const { hasError } = defineErrorRefs(props)

function targetValue(event: Event): string {
  return (event.target as HTMLInputElement).value
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
