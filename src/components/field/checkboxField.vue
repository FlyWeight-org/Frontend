<template>
  <label :for="id" class="checkbox-label">
    <input
      type="checkbox"
      v-bind="$attrs"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', targetValue($event))"
      :class="{ invalid: hasError }"
      :aria-invalid="hasError"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import type { Errors } from "@/stores/types";
import { defineErrorRefs, defineIDRefs } from "@/components/field/common";

interface Props {
  object: string;
  field: string;
  modelValue: boolean;

  label: string;

  errors?: Errors;
}

const props = defineProps<Props>();
defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const { id, name } = defineIDRefs(props);
const { hasError } = defineErrorRefs(props);

function targetValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
