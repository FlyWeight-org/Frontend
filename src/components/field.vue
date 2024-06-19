<template>
  <fieldset v-if="type === 'date'">
    <datepicker-field
      :object="object"
      :field="field"
      :model-value="valueAsDateTime"
      :label="label"
      :errors="errors"
      v-bind="$attrs"
    />

    <ul v-if="hasError" class="error" data-cy="field-errors">
      <li v-for="error in fieldErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </fieldset>

  <fieldset v-else-if="type === 'checkbox'">
    <checkbox-field
      :object="object"
      :field="field"
      :model-value="valueAsBoolean"
      :label="label"
      :errors="errors"
      v-bind="$attrs"
    />

    <ul v-if="hasError" class="error">
      <li v-for="error in fieldErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </fieldset>

  <fieldset v-else-if="type === 'textarea'">
    <textarea-field
      :object="object"
      :field="field"
      :model-value="valueAsString"
      :label="label"
      :errors="errors"
      v-bind="$attrs"
    />
    <ul v-if="hasError" class="error" data-cy="field-errors">
      <li v-for="error in fieldErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </fieldset>

  <fieldset v-else>
    <input-field
      :type="type"
      :object="object"
      :field="field"
      :model-value="valueAsString"
      :label="label"
      :errors="errors"
      v-bind="$attrs"
    />

    <ul v-if="hasError" class="error" data-cy="field-errors">
      <li v-for="error in fieldErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </fieldset>
</template>

<script setup lang="ts">
import type { Errors } from '@/stores/types'
import CheckboxField from '@/components/field/checkboxField.vue'
import DatepickerField from '@/components/field/datepickerField.vue'
import TextareaField from '@/components/field/textareaField.vue'
import InputField from '@/components/field/inputField.vue'
import { defineErrorRefs } from '@/components/field/common'
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { isBoolean, isString } from 'lodash-es'

interface Props {
  type: string

  object: string
  field: string
  modelValue: unknown

  label: string

  errors?: Errors
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  errors: undefined
})

const valueAsDateTime = computed<DateTime | undefined>(() =>
  props.modelValue instanceof DateTime ? props.modelValue : undefined
)
const valueAsBoolean = computed<boolean>(() =>
  isBoolean(props.modelValue) ? props.modelValue : false
)
const valueAsString = computed<string>(() => (isString(props.modelValue) ? props.modelValue : ''))

const { fieldErrors, hasError } = defineErrorRefs(props)
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
