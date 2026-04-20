import { isNull, isString } from 'lodash-es'
import { z } from 'zod'
import config from '@/config'
import type { APIResponse } from '@/stores/types'
import { Err, Ok } from 'ts-results'

// Rodauth returns errors as either:
//   { error: "message" }
//   { "field-error": ["field_name", "error message"], error: "message" }
// Custom Rails controllers return:
//   { errors: { field: ["error 1"] } }
const apiErrorBodySchema = z.object({
  errors: z.record(z.string(), z.array(z.string())).optional(),
  error: z.string().optional(),
  'field-error': z.tuple([z.string(), z.string()]).optional(),
})

import { useAuthStore } from '@/stores/modules/auth'
import { useAccountStore } from '@/stores/modules/account'
import { useFlightsStore } from '@/stores/modules/flights'

interface RequestArgs {
  method?: string
  path: string
  body?: Record<string, unknown> | FormData | string
  /** Don't log the user out if the response is 401 (for endpoints where 401
   *  is a business-logic outcome, e.g. login, password reset request). */
  skipResetAuth?: boolean
  /** Don't include the Authorization header (for fully public endpoints). */
  unauthenticated?: boolean
}

export function request({
  method,
  path,
  body,
  skipResetAuth,
  unauthenticated,
}: RequestArgs): Promise<Response> {
  const auth = useAuthStore()
  const account = useAccountStore()
  const flights = useFlightsStore()

  return new Promise((resolve, reject) => {
    let serializedBody: FormData | string
    if (!(body instanceof FormData) && !isString(body)) {
      serializedBody = JSON.stringify(body)
    } else {
      serializedBody = body
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    }
    if (!unauthenticated && !isNull(auth.authHeader)) headers.Authorization = auth.authHeader
    if (!(body instanceof FormData) && !isString(body)) {
      headers['Content-Type'] = 'application/json'
    }

    fetch(config.APIURL + path, {
      method: method ?? 'get',
      body: serializedBody,
      headers,
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 401 && !skipResetAuth) {
          auth.reset()
          account.reset()
          flights.reset()
          return
        }

        resolve(response)
      })
      .catch((error: unknown) => {
        reject(error instanceof Error ? error : new Error(String(error)))
      })
  })
}

export async function requestJSON<T>(args: RequestArgs): Promise<APIResponse<T>> {
  const response = await request(args)
  if (response.ok) {
    return new Ok({
      response,
      body: response.status === 204 ? undefined : ((await response.json()) as T),
    })
  }
  const parsed = apiErrorBodySchema.parse(await response.json())
  // Normalize Rodauth's ["field", "message"] tuple into { field: ["message"] }.
  const errors =
    parsed.errors ??
    (parsed['field-error'] ? { [parsed['field-error'][0]]: [parsed['field-error'][1]] } : undefined)
  return new Err({
    response,
    body: { errors, error: parsed.error },
  })
}
