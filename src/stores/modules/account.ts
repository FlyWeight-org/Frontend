import { defineStore } from 'pinia'
import type { AccountState, APIResponse, Errors } from '@/stores/types'
import {
  pilotFromJSON,
  type ForgotPasswordJSONUp,
  type PilotJSONDown,
  type PilotJSONUp,
  type SignUpJSONUp,
} from '@/stores/coding'
import { Err, Ok, Result } from 'ts-results'
import type { Pilot } from '@/types'
import { request, requestJSON } from '@/stores/modules/root'
import {
  anythingToError,
  ignoreAPIResponseBodyOrReturnErrors,
  ignoreResponseBody,
  loadAPIResponseBodyOrReturnErrors,
  loadAPIResponseBodyOrThrowErrors,
} from '@/stores/utils'
import { notifySentry } from '@/utils/errors'
import { useAuthStore } from '@/stores/modules/auth'
import { useFlightsStore } from '@/stores/modules/flights'
import { clone } from 'lodash-es'

const initialState: AccountState = {
  currentPilot: null,
  currentPilotLoading: false,
  currentPilotError: null,
}

export const useAccountStore = defineStore('account', {
  state: () => clone(initialState),
  actions: {
    reset(): void {
      this.$patch(initialState)
    },

    setCurrentPilot(pilot: Pilot): void {
      this.$patch({
        currentPilot: pilot,
        currentPilotError: null,
        currentPilotLoading: false,
      })
    },

    /**
     * Creates a new pilot and sets `currentPilot`.
     *
     * @param signUp The signup attributes (login, password, name).
     * @throws If an HTTP error occurs.
     */

    async signUp(signUp: SignUpJSONUp): Promise<Result<void, Errors>> {
      const auth = useAuthStore()
      const flights = useFlightsStore()

      auth.reset()

      try {
        const response = await requestJSON<PilotJSONDown>({
          method: 'post',
          path: '/signup',
          body: { ...signUp },
          unauthenticated: true,
          skipResetAuth: true,
        })
        const result = loadAPIResponseBodyOrReturnErrors(response)
        if (result.ok) {
          auth.setTokens(response.val.response, result.val)
          this.setCurrentPilot(pilotFromJSON(result.val))
          flights.reset()
          return Ok.EMPTY
        }
        return new Err(result.val)
      } catch (error) {
        this.reset()
        auth.reset()
        flights.reset()
        throw error
      }
    },

    /**
     * Generates a reset-password email.
     *
     * @param payload The pilot email address and Turnstile token.
     * @throws If an HTTP error occurs.
     */

    async forgotPassword(payload: ForgotPasswordJSONUp): Promise<void> {
      const response = await request({
        method: 'post',
        path: '/password-resets',
        body: { ...payload },
      })
      ignoreResponseBody(response)
    },

    /**
     * Resets a pilot password using a token from a reset-password email.
     *
     * @param password The new pilot password.
     * @param token The token from the reset-password email.
     * @return A Result containing nothing if successful, or the validation errors
     * if failed.
     * @throws If an HTTP error occurs.
     */

    async resetPassword({
      password,
      token,
    }: {
      password: string
      token: string
    }): Promise<Result<void, Errors>> {
      const response: APIResponse<void> = await requestJSON({
        method: 'post',
        path: '/reset-password',
        body: { key: token, password },
        unauthenticated: true,
        skipResetAuth: true,
      })
      return ignoreAPIResponseBodyOrReturnErrors(response)
    },

    /**
     * Loads the current pilot account to `currentPilot`. Does nothing if not
     * logged in.
     *
     * @throws If an HTTP error occurs.
     */

    async loadAccount(): Promise<void> {
      const auth = useAuthStore()

      if (!auth.loggedIn) return

      this.$patch({
        currentPilot: null,
        currentPilotError: null,
        currentPilotLoading: true,
      })
      try {
        const response = await requestJSON<PilotJSONDown>({
          method: 'GET',
          path: '/account',
        })
        if (response.ok) {
          const body = loadAPIResponseBodyOrThrowErrors(response)
          this.setCurrentPilot(pilotFromJSON(body))
        }
      } catch (error) {
        this.$patch({
          currentPilot: null,
          currentPilotLoading: false,
          currentPilotError: anythingToError(error),
        })
        notifySentry(error)
      }
    },

    /**
     * Updates the Pilot's profile (name, email).
     *
     * @param pilot The new pilot attributes.
     * @return A Result containing nothing if successful, or the validation errors
     * if failed.
     * @throws If an HTTP error occurs.
     */

    async updateAccount(pilot: PilotJSONUp): Promise<Result<void, Errors>> {
      const response = await requestJSON<PilotJSONDown>({
        method: 'PATCH',
        path: '/account',
        body: { pilot },
      })
      const result = loadAPIResponseBodyOrReturnErrors(response)
      if (result.ok) {
        this.setCurrentPilot(pilotFromJSON(result.val))
        return Ok.EMPTY
      }
      return new Err(result.val)
    },

    /**
     * Deletes the current Pilot account.
     */

    async deleteAccount(): Promise<void> {
      const auth = useAuthStore()
      const flights = useFlightsStore()

      const response: Response = await request({
        method: 'delete',
        path: '/account',
      })
      ignoreResponseBody(response)
      this.reset()
      auth.reset()
      flights.reset()
    },
  },
})
