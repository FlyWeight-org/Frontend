import { defineStore } from 'pinia'
import { Err, Ok, Result } from 'ts-results'
import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser'
import { clone } from 'lodash-es'
import type { APIResponse, Errors } from '@/stores/types'
import type { Passkey } from '@/types'
import { pilotFromJSON, type PasskeyJSONDown, type PilotJSONDown } from '@/stores/coding'
import { request, requestJSON } from '@/stores/modules/root'
import {
  ignoreAPIResponseBodyOrReturnErrors,
  ignoreResponseBody,
  loadAPIResponseBodyOrReturnErrors,
} from '@/stores/utils'
import { useAuthStore } from '@/stores/modules/auth'
import { useAccountStore } from '@/stores/modules/account'
import { useFlightsStore } from '@/stores/modules/flights'

interface PasskeysState {
  loading: boolean
  registering: boolean
}

const initialState: PasskeysState = {
  loading: false,
  registering: false,
}

/**
 * Response shape from Rodauth's POST /webauthn-setup:
 *   {
 *     webauthn_setup: { challenge, user, rp, pubKeyCredParams, ... },
 *     webauthn_setup_challenge: "...",
 *     webauthn_setup_challenge_hmac: "..."
 *   }
 * When the request body is empty, Rodauth returns the options; when it
 * contains the credential response, Rodauth completes registration.
 */
interface WebauthnSetupResponse {
  webauthn_setup?: PublicKeyCredentialCreationOptionsJSON
  webauthn_setup_challenge?: string
  webauthn_setup_challenge_hmac?: string
}

interface WebauthnLoginResponse extends PilotJSONDown {
  webauthn_auth?: PublicKeyCredentialRequestOptionsJSON
  webauthn_auth_challenge?: string
  webauthn_auth_challenge_hmac?: string
}

export const usePasskeysStore = defineStore('passkeys', {
  state: () => clone(initialState),

  actions: {
    reset(): void {
      this.$patch(initialState)
    },

    /**
     * Registers a new passkey for the current pilot.
     *
     * @param label An optional user-friendly label for the passkey.
     * @return A Result containing the new passkey if successful, or errors.
     */

    async register(password: string, label?: string): Promise<Result<Passkey, Errors>> {
      this.registering = true
      try {
        // 1. Ask Rodauth for credential creation options.
        //    The first POST returns 401 with the options payload because the
        //    password param isn't yet provided; we use the options anyway.
        const optionsResponse = await request({
          method: 'post',
          path: '/webauthn-setup',
          body: {},
          skipResetAuth: true,
        })
        const optionsBody = (await optionsResponse.json()) as WebauthnSetupResponse
        const { webauthn_setup, webauthn_setup_challenge, webauthn_setup_challenge_hmac } =
          optionsBody
        if (!webauthn_setup || !webauthn_setup_challenge || !webauthn_setup_challenge_hmac) {
          return new Err({ base: ['Missing WebAuthn setup options'] })
        }

        // 2. Invoke the browser's WebAuthn API.
        const credential = await startRegistration({ optionsJSON: webauthn_setup })

        // 3. Complete registration with Rodauth (requires the user's password).
        const registerResponse: APIResponse<unknown> = await requestJSON({
          method: 'post',
          path: '/webauthn-setup',
          body: {
            webauthn_setup: credential,
            webauthn_setup_challenge,
            webauthn_setup_challenge_hmac,
            password,
            label,
          },
        })
        const result = ignoreAPIResponseBodyOrReturnErrors(registerResponse)
        if (!result.ok) return new Err(result.val)

        // 4. Reload account data so the passkey list is up to date.
        const account = useAccountStore()
        await account.loadAccount()
        const newest = account.currentPilot?.passkeys?.at(-1)
        return newest ? new Ok(newest) : new Ok({ id: '', label: label ?? null, lastUsedAt: null })
      } finally {
        this.registering = false
      }
    },

    /**
     * Begins a conditional-UI passkey login ceremony. The browser shows
     * available passkeys when the user focuses an input with
     * `autocomplete="... webauthn"`, and this promise resolves only when a
     * passkey is selected (or rejects when the ceremony is canceled).
     *
     * @return A Result containing nothing if successful, or errors.
     */

    async autofillLogIn(): Promise<Result<void, Errors>> {
      const auth = useAuthStore()
      const account = useAccountStore()
      const flights = useFlightsStore()

      // 1. Ask Rodauth for credential request options with no login param.
      //    Rodauth returns the options in the body with a 4xx status, since
      //    the request is missing the credential response it expects.
      const optionsResponse = await request({
        method: 'post',
        path: '/webauthn-login',
        body: {},
        unauthenticated: true,
        skipResetAuth: true,
      })
      const optionsBody = (await optionsResponse.json()) as WebauthnLoginResponse
      const { webauthn_auth, webauthn_auth_challenge, webauthn_auth_challenge_hmac } = optionsBody
      if (!webauthn_auth || !webauthn_auth_challenge || !webauthn_auth_challenge_hmac) {
        return new Err({ base: ['Missing WebAuthn login options'] })
      }

      // 2. Start conditional UI. Resolves when the user picks a passkey from
      //    autofill; rejects if canceled via WebAuthnAbortService.
      const assertion = await startAuthentication({
        optionsJSON: webauthn_auth,
        useBrowserAutofill: true,
      })

      this.loading = true
      try {
        // 3. Complete the login. Rodauth resolves the account from the
        //    credential ID in the assertion (webauthn_autofill feature).
        const loginResponse: APIResponse<PilotJSONDown> = await requestJSON({
          method: 'post',
          path: '/webauthn-login',
          body: {
            webauthn_auth: assertion,
            webauthn_auth_challenge,
            webauthn_auth_challenge_hmac,
          },
          unauthenticated: true,
          skipResetAuth: true,
        })
        const result = loadAPIResponseBodyOrReturnErrors(loginResponse)
        if (!result.ok) return new Err(result.val)

        auth.setTokens(loginResponse.val.response, result.val)
        account.setCurrentPilot(pilotFromJSON(result.val))
        flights.reset()
        return Ok.EMPTY
      } finally {
        this.loading = false
      }
    },

    /**
     * Renames a passkey.
     */

    async rename(id: string, label: string): Promise<Result<void, Errors>> {
      const response = await requestJSON<PasskeyJSONDown>({
        method: 'PATCH',
        path: `/account/passkeys/${encodeURIComponent(id)}`,
        body: { label },
      })
      const result = ignoreAPIResponseBodyOrReturnErrors(response)
      if (result.ok) {
        const account = useAccountStore()
        await account.loadAccount()
      }
      return result
    },

    /**
     * Removes a passkey.
     */

    async remove(id: string): Promise<void> {
      const response = await request({
        method: 'delete',
        path: `/account/passkeys/${encodeURIComponent(id)}`,
      })
      ignoreResponseBody(response)
      const account = useAccountStore()
      await account.loadAccount()
    },
  },
})
