import { isError, isString, toString } from 'lodash-es'
import * as Sentry from '@sentry/vue'

export function errorToString(error: unknown): string {
  if (isError(error)) return error.message
  if (isString(error)) return error
  return toString(error)
}

/**
 * Logs an error and reports it to Sentry.
 *
 * @param error The caught value. Errors are reported as exceptions, strings as messages, and
 *   anything else is logged but not reported.
 * @param source Dotted `module.function` name of the catch block reporting this, tagged on the
 *   Sentry event. Errors that arrive without a usable stacktrace — third-party code and mobile
 *   in-app browsers both produce them — are otherwise indistinguishable between call sites.
 */

export function notifySentry(error: unknown, source: string): void {
  // eslint-disable-next-line no-console
  console.error(error)
  const context = { tags: { source } }
  if (isError(error)) {
    Sentry.captureException(error, context)
  } else if (isString(error)) {
    Sentry.captureMessage(error, context)
  }
}
