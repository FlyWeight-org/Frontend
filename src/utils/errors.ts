import { isError, isString, toString } from 'lodash-es'
import * as Sentry from '@sentry/vue'

export function errorToString(error: unknown): string {
  if (isError(error)) return error.message
  if (isString(error)) return error
  return toString(error)
}

export function notifySentry(error: unknown): void {
  console.error(error)
  if (isError(error)) {
    Sentry.captureException(error)
  } else if (isString(error)) {
    Sentry.captureMessage(error)
  }
}
