import { defineStore } from 'pinia'
import { clone, isEmpty, isNull, isNumber, isString } from 'lodash-es'
import type { APIResponse, AuthState, Errors } from '@/stores/types'
import config from '@/config'
import type { SessionJSONDown } from '@/stores/coding'
import { Err, Ok, Result } from 'ts-results'
import type { Pilot } from '@/types'
import { request, requestJSON } from '@/stores/modules/root'
import { ignoreResponseBody, loadAPIResponseBodyOrReturnErrors } from '@/stores/utils'
import { useAccountStore } from '@/stores/modules/account'
import { useFlightsStore } from '@/stores/modules/flights'
import { Consumer, createConsumer } from '@rails/actioncable'

interface JWTPayload {
  iss: string
  sub: string
  aud: string
  exp?: string | number
  nbf?: string | number
  iat: string | number
  jti: string

  u: string
}

const initialState: AuthState = {
  JWT: null,
  loggingIn: false
}

export const useAuthStore = defineStore('auth', {
  state: () => clone(initialState),

  getters: {
    JWTPayload: (state) => (state.JWT ? JSON.parse(atob(state.JWT.split('.')[1] || '')) : null),

    JWTExpiresAt(): Date | null {
      if (isNull(this.JWTPayload)) return null
      const { exp } = this.JWTPayload
      if (isNumber(exp)) return new Date(exp * 1000)
      if (isString(exp)) return new Date(Number.parseInt(exp, 10) * 1000)
      return null
    },

    /** @return Whether a pilot is logged in for this session. */
    loggedIn(state): boolean {
      if (isNull(state.JWT)) return false
      if (isNull(this.JWTExpiresAt)) return false
      return this.JWTExpiresAt > new Date()
    },

    /** The email of the Pilot that's logged in, if any. */
    currentEmail(): string | null {
      const payload: JWTPayload | null = this.JWTPayload
      if (isNull(payload)) return null
      return payload.u
    },

    actionCableConsumer(state): Consumer | null {
      if (isNull(state.JWT)) return null
      const queryString = new URLSearchParams({ jwt: state.JWT })
      const URL = `${config.actionCableURL}?${queryString.toString()}`
      return createConsumer(URL)
    },

    authHeader: (state) => (state.JWT ? `Bearer ${state.JWT}` : null)
  },

  actions: {
    reset() {
      this.$patch(initialState)
    },

    initializeFromLocalStorage() {
      const JWTString = localStorage.getItem('JWT')
      this.JWT = isEmpty(JWTString) ? null : JWTString
    },

    saveToLocalStorage() {
      localStorage.setItem('JWT', this.JWT || '')
    },

    /**
     * Logs in a pilot account.
     *
     * @param session The login information.
     * @throws If an HTTP error occurred.
     */

    async logIn(session: SessionJSONDown): Promise<Result<void, Errors>> {
      const account = useAccountStore()
      const flights = useFlightsStore()

      this.loggingIn = true

      try {
        const response: APIResponse<Pilot> = await requestJSON({
          path: '/login.json',
          method: 'post',
          body: { pilot: session },
          skipResetAuth: true
        })
        const result = loadAPIResponseBodyOrReturnErrors(response)
        if (result.ok) {
          this.setJWT(response.val.response)
          account.setCurrentPilot(result.val)
          flights.reset()
          return Ok.EMPTY
        }
        return new Err(result.val)
      } catch (error) {
        this.reset()
        account.reset()
        flights.reset()
        throw error
      }
    },

    setJWT(response: Response): void {
      const authorization = response.headers.get('Authorization')
      if (authorization && authorization.match(/^Bearer /)) {
        const JWT = authorization.slice(7)
        this.$patch({
          JWT,
          loggingIn: false
        })
      }
    },

    /**
     * Logs out the logged-in pilot user.
     */

    async logOut(): Promise<void> {
      const account = useAccountStore()
      const flights = useFlightsStore()

      const result = await request({
        method: 'delete',
        path: '/logout.json'
      })
      ignoreResponseBody(result)
      this.reset()
      account.reset()
      flights.reset()
    }
  }
})
