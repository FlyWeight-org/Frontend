import type { Result } from 'ts-results'
import { isObject, isUndefined, toString } from 'lodash-es'
import type { Ref } from 'vue'
import type { Errors } from '@/stores/types'
import { errorToString, notifySentry } from '@/utils/errors'
import { ref } from 'vue'

type SubmitHandler<SuccessType> = () => Promise<Result<SuccessType, Errors>>
type SuccessHandler<SuccessType> = (result: SuccessType) => Promise<void>
type ErrorHandler = (errors: Errors | string) => Promise<void>

interface ReturnType {
  submitHandler: () => Promise<void>
  errors: Ref<Errors>
  error: Ref<string | null>
  isProcessing: Ref<boolean>
}

export default function useFormErrorHandling<SuccessType>(
  onSubmit: SubmitHandler<SuccessType>,
  onSuccess: SuccessHandler<SuccessType>,
  onError?: ErrorHandler
): ReturnType {
  const errors = ref<Errors>({})
  const error = ref<string | null>(null)
  const isProcessing = ref<boolean>(false)

  const submitHandler = async () => {
    isProcessing.value = true
    errors.value = {}
    error.value = null

    try {
      const result = await onSubmit()
      if (result.ok) {
        await onSuccess(result.val)
      } else {
        if (isObject(result.val)) {
          errors.value = result.val
        } else {
          error.value = toString(result.val)
        }
        if (!isUndefined(onError)) await onError(result.val)
      }
    } catch (err) {
      notifySentry(err)
      error.value = errorToString(err)
      if (!isUndefined(onError)) await onError(error.value)
    }

    isProcessing.value = false
  }

  return {
    submitHandler,
    errors,
    error,
    isProcessing
  }
}
