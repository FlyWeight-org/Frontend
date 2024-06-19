<template>
  <label :for="id">
    <span>{{ label }}</span>
    <input
      v-bind="$attrs"
      :id="id"
      :type="type"
      :name="name"
      :value="modelValue"
      :class="{ invalid: hasError }"
      :aria-invalid="hasError"
      @input="$emit('update:modelValue', targetValue($event))"
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
