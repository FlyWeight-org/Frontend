<template>
  <label :for="id">
    <span>{{ label }}</span>
    <vue-date-picker
      v-bind="$attrs"
      :id="id"
      :name="name"
      v-model="internalDate"
      :format="formatDate"
      :preview-format="formatDatePreview"
      :placeholder="datePlaceholder"
      :enable-time-picker="false"
      :month-change-on-scroll="false"
      :clearable="false"
      :class="{ invalid: hasError }"
      :aria-invalid="hasError"
    >
    </vue-date-picker>
  </label>
</template>

<script setup lang="ts">
import type { Errors } from '@/stores/types'
import { ref, watch } from 'vue'
import { defineErrorRefs, defineIDRefs } from '@/components/field/common'
import { DateTime } from 'luxon'
import { isEqual, isUndefined } from 'lodash-es'
import isTouchDevice from 'is-touch-device'
import { useI18n } from 'vue-i18n'

interface Props {
  object: string
  field: string
  modelValue: DateTime | undefined

  label: string

  errors?: Errors
}

const { t, d } = useI18n()

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: DateTime | undefined): void
}>()

const { id, name } = defineIDRefs(props)
const { hasError } = defineErrorRefs(props)

const internalDate = ref<Date | undefined>(props.modelValue as Date | undefined)

watch(internalDate, (newDate: Date | undefined, oldDate: Date | undefined) => {
  if (isEqual(oldDate, newDate)) return
  emit('update:modelValue', dateOnly(newDate))
})
watch(
  () => props.modelValue,
  (newDate, oldDate) => {
    if (isEqual(oldDate, newDate)) return
    internalDate.value = (newDate as DateTime | undefined)?.toJSDate()
  }
)

const datePlaceholder = isTouchDevice()
  ? t('field.date.placeholder.tap')
  : t('field.date.placeholder.click')

function formatDate(date: Date): string {
  return d(date, 'long')
}

function formatDatePreview(date: Date): string {
  return d(date, 'short')
}

function dateOnly(date?: Date): DateTime | undefined {
  if (isUndefined(date)) return undefined

  const datetime = DateTime.fromJSDate(date)
  return datetime.toLocal().startOf('day')
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
