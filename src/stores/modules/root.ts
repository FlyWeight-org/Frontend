/* eslint-disable no-shadow */

import { isNull, isString } from 'lodash-es'
import config from '@/config'
import type { APIResponse } from '@/stores/types'
import { Err, Ok } from 'ts-results'
import { useAuthStore } from '@/stores/modules/auth'
import { useAccountStore } from '@/stores/modules/account'
import { useFlightsStore } from '@/stores/modules/flights'

export function request({
  method,
  path,
  body,
  skipResetAuth
}: {
  method?: string
  path: string
  body?: Record<string, unknown> | FormData | string
  skipResetAuth?: boolean
}): Promise<Response> {
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
      Accept: 'application/json'
    }
    if (!skipResetAuth && !isNull(auth.authHeader)) headers.Authorization = auth.authHeader
    if (!(body instanceof FormData) && !isString(body)) {
      headers['Content-Type'] = 'application/json'
    }

    fetch(config.APIURL + path, {
      method: method || 'get',
      body: serializedBody,
      headers,
      credentials: 'include'
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
      .catch((error) => reject(error))
  })
}

export async function requestJSON<T>(args: {
  method?: string
  path: string
  body?: Record<string, unknown>
  skipResetAuth?: boolean
}): Promise<APIResponse<T>> {
  const response = await request(args)
  if (response.ok) {
    return new Ok({
      response,
      body: response.status === 204 ? undefined : await response.json()
    })
  }
  return new Err({
    response,
    body: await response.json()
  })
}
