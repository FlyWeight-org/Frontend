import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { isEmpty, isUndefined } from 'lodash-es'
import type { Errors } from '@/stores/types'

interface ErrorProps {
  field: string
  errors?: Errors
}

interface IDProps {
  object: string
  field: string
}

interface ErrorRefs {
  fieldErrors: ComputedRef<string[]>
  hasError: ComputedRef<boolean>
}

interface IDRefs {
  id: ComputedRef<string>
  name: ComputedRef<string>
}

export function defineErrorRefs(props: ErrorProps): ErrorRefs {
  const fieldErrors = computed(() => (isUndefined(props.errors) ? [] : props.errors[props.field] || []))
  const hasError = computed(() => !isEmpty(fieldErrors.value))

  return {
    fieldErrors,
    hasError
  }
}

export function defineIDRefs(props: IDProps): IDRefs {
  const id = computed(() => `${props.object}-${props.field}`)
  const name = computed(() => `${props.object}[${props.field}]`)

  return {
    id,
    name
  }
}
