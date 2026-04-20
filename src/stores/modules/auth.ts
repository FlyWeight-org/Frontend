import { defineStore } from 'pinia'
import { clone, isEmpty, isNull, isNumber, isString } from 'lodash-es'
import { z } from 'zod'
import type { APIResponse, AuthState, Errors } from '@/stores/types'
import config from '@/config'
import { pilotFromJSON, type PilotJSONDown, type SessionJSONDown } from '@/stores/coding'
import { Err, Ok, Result } from 'ts-results'
import { request, requestJSON } from '@/stores/modules/root'
import { ignoreResponseBody, loadAPIResponseBodyOrReturnErrors } from '@/stores/utils'
import { useAccountStore } from '@/stores/modules/account'
import { useFlightsStore } from '@/stores/modules/flights'
import { Consumer, createConsumer } from '@rails/actioncable'

const jwtPayloadSchema = z.object({
  exp: z.union([z.string(), z.number()]).optional(),
  e: z.string(),
})

type JWTPayload = z.infer<typeof jwtPayloadSchema>

const initialState: AuthState = {
  JWT: null,
  refreshToken: null,
  loggingIn: false,
}

export const useAuthStore = defineStore('auth', {
  state: () => clone(initialState),

  getters: {
    JWTPayload: (state): JWTPayload | null =>
      state.JWT ? jwtPayloadSchema.parse(JSON.parse(atob(state.JWT.split('.')[1] ?? ''))) : null,

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
      const payload = this.JWTPayload
      if (isNull(payload)) return null
      return payload.e
    },

    actionCableConsumer(state): Consumer | null {
      if (isNull(state.JWT)) return null
      const queryString = new URLSearchParams({ jwt: state.JWT })
      const URL = `${config.actionCableURL}?${queryString.toString()}`
      return createConsumer(URL)
    },

    authHeader: (state) => (state.JWT ? `Bearer ${state.JWT}` : null),
  },

  actions: {
    reset() {
      this.$patch(initialState)
    },

    initializeFromLocalStorage() {
      const JWTString = localStorage.getItem('JWT')
      this.JWT = isEmpty(JWTString) ? null : JWTString
      const refreshString = localStorage.getItem('refreshToken')
      this.refreshToken = isEmpty(refreshString) ? null : refreshString
    },

    saveToLocalStorage() {
      localStorage.setItem('JWT', this.JWT ?? '')
      localStorage.setItem('refreshToken', this.refreshToken ?? '')
    },

    /**
     * Logs in a pilot account.
     *
     * @param session The login credentials.
     * @throws If an HTTP error occurred.
     */

    async logIn(session: SessionJSONDown): Promise<Result<void, Errors>> {
      const account = useAccountStore()
      const flights = useFlightsStore()

      this.loggingIn = true

      try {
        const response: APIResponse<PilotJSONDown> = await requestJSON({
          path: '/login',
          method: 'post',
          body: { ...session },
          unauthenticated: true,
          skipResetAuth: true,
        })
        const result = loadAPIResponseBodyOrReturnErrors(response)
        if (result.ok) {
          this.setTokens(response.val.response, result.val)
          account.setCurrentPilot(pilotFromJSON(result.val))
          flights.reset()
          return Ok.EMPTY
        }
        return new Err(result.val)
      } catch (error) {
        this.reset()
        account.reset()
        flights.reset()
        throw error
      } finally {
        this.loggingIn = false
      }
    },

    /**
     * Persists tokens from a login/signup response. The JWT is in the
     * Authorization header; the refresh token is in the body.
     */

    setTokens(response: Response, body: PilotJSONDown): void {
      const authorization = response.headers.get('Authorization')
      const patch: Partial<AuthState> = { loggingIn: false }
      if (authorization && /^Bearer /.exec(authorization)) {
        patch.JWT = authorization.slice(7)
      } else if (body.access_token) {
        patch.JWT = body.access_token
      }
      if (body.refresh_token) patch.refreshToken = body.refresh_token
      this.$patch(patch)
    },

    /**
     * Refreshes the access token using the stored refresh token.
     */

    async refreshAccessToken(): Promise<boolean> {
      if (!this.refreshToken || !this.JWT) return false

      // Rodauth's jwt-refresh route requires the current (possibly expired)
      // JWT in the Authorization header. We send it explicitly since
      // skipResetAuth would suppress the header.
      const response = await requestJSON<{ access_token: string; refresh_token: string }>({
        method: 'post',
        path: '/jwt-refresh',
        body: { refresh_token: this.refreshToken },
      })
      if (!response.ok || !response.val.body) return false

      this.$patch({
        JWT: response.val.body.access_token,
        refreshToken: response.val.body.refresh_token,
      })
      return true
    },

    /**
     * Logs out the logged-in pilot.
     */

    async logOut(): Promise<void> {
      const account = useAccountStore()
      const flights = useFlightsStore()

      if (this.loggedIn) {
        const response = await request({
          method: 'post',
          path: '/logout',
        })
        ignoreResponseBody(response)
      }
      this.reset()
      account.reset()
      flights.reset()
    },
  },
})
