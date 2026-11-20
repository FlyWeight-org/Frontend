import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { Err, Ok, type Result } from 'ts-results'
import { createRouter, createMemoryHistory } from 'vue-router'
import LogIn from '@/views/home/logIn.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { usePasskeysStore } from '@/stores/modules/passkeys'
import type { Errors } from '@/stores/types'
import i18n from '@/i18n'
import TurnstileStub from './turnstileStub'

const webAuthn = vi.hoisted(() => ({ autofillSupported: false }))

vi.mock('@simplewebauthn/browser', () => ({
  browserSupportsWebAuthnAutofill: () => Promise.resolve(webAuthn.autofillSupported),
  WebAuthnAbortService: {
    cancelCeremony: () => undefined,
  },
}))

type PasskeyCeremony = () => Promise<Result<void, Errors>>

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: LogIn, name: 'logIn' },
      { path: '/flights', component: { template: '<div />' }, name: 'flightsList' },
      { path: '/forgot-password', component: { template: '<div />' }, name: 'forgotPassword' },
    ],
  })
}

function mountLogIn(pinia = createTestingPinia({ createSpy: vi.fn })) {
  const wrapper = mount(LogIn, {
    global: {
      plugins: [pinia, i18n, buildRouter()],
      stubs: { Turnstile: TurnstileStub },
    },
  })
  return { pinia, wrapper }
}

// Mounts the view with passkey autofill available; the passkeys store answers
// each autofill ceremony in turn, then leaves the next one pending.
async function mountWithAutofill(...ceremonies: PasskeyCeremony[]) {
  webAuthn.autofillSupported = true
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const autofillLogIn = vi.mocked(usePasskeysStore(pinia).autofillLogIn)
  autofillLogIn.mockReturnValue(new Promise(() => undefined))
  for (const ceremony of ceremonies) autofillLogIn.mockImplementationOnce(ceremony)
  const { wrapper } = mountLogIn(pinia)
  await flushPromises()
  return { autofillLogIn, wrapper }
}

const rejectedByServer: PasskeyCeremony = () =>
  Promise.resolve(new Err({ base: ['webauthn challenge expired'] }))

const canceled: PasskeyCeremony = () =>
  Promise.reject(new DOMException('The operation was aborted.', 'AbortError'))

describe('logIn.vue', () => {
  afterEach(() => {
    webAuthn.autofillSupported = false
  })

  it('disables submit until Turnstile produces a token', () => {
    const { wrapper } = mountLogIn()

    expect(wrapper.get('input[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('passes turnstile_token in the logIn payload', async () => {
    const { pinia, wrapper } = mountLogIn()

    const authStore = useAuthStore(pinia)
    vi.mocked(authStore.logIn).mockResolvedValue(new Ok(undefined))

    await wrapper.get('input[name="session[login]"]').setValue('sancho@example.com')
    await wrapper.get('input[name="session[password]"]').setValue('supersecret')
    await wrapper.get('[data-testid="turnstile-stub"]').trigger('click')
    await wrapper.get('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(authStore.logIn).toHaveBeenCalledWith({
      login: 'sancho@example.com',
      password: 'supersecret',
      turnstile_token: 'fake-turnstile-token',
    })
  })

  describe('passkey autofill', () => {
    it('restarts with fresh options and shows the error when the server rejects a passkey', async () => {
      const { autofillLogIn, wrapper } = await mountWithAutofill(rejectedByServer)

      expect(autofillLogIn).toHaveBeenCalledTimes(2)
      expect(wrapper.get('[data-testid="login-passkey-error"]').text()).toBe(
        'webauthn challenge expired',
      )
    })

    it('stops once the ceremony is canceled', async () => {
      const { autofillLogIn, wrapper } = await mountWithAutofill(canceled)

      expect(autofillLogIn).toHaveBeenCalledTimes(1)
      expect(wrapper.find('[data-testid="login-passkey-error"]').exists()).toBe(false)
    })

    it('does not restart after the view unmounts', async () => {
      let settleCeremony: (result: Result<void, Errors>) => void = () => undefined
      const { autofillLogIn, wrapper } = await mountWithAutofill(
        () =>
          new Promise((resolve) => {
            settleCeremony = resolve
          }),
      )

      wrapper.unmount()
      settleCeremony(new Err({ base: ['webauthn challenge expired'] }))
      await flushPromises()

      expect(autofillLogIn).toHaveBeenCalledTimes(1)
    })
  })
})
