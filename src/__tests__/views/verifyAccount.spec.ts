import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { Err, Ok } from 'ts-results'
import { createMemoryHistory, createRouter } from 'vue-router'
import VerifyAccount from '../../views/home/verifyAccount.vue'
import { useAccountStore } from '../../stores/modules/account'
import i18n from '../../i18n'

type VerifyResult = Ok<void> | Err<Record<string, string[]>>
type VerifyPromise = Promise<VerifyResult>

interface MountOptions {
  query?: Record<string, string>
  verifyResult?: VerifyPromise
}

async function mountVerifyAccount({
  query = { key: 'abc' },
  verifyResult,
}: MountOptions = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/verify-account', name: 'verifyAccount', component: VerifyAccount },
      { path: '/login', name: 'logIn', component: { template: '<div />' } },
    ],
  })
  await router.push({ name: 'verifyAccount', query })
  await router.isReady()

  const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: true })
  const accountStore = useAccountStore(pinia)
  if (verifyResult) {
    vi.mocked(accountStore.verifyAccount).mockReturnValue(verifyResult)
  }

  const wrapper = mount(VerifyAccount, {
    global: {
      plugins: [pinia, i18n, router],
    },
  })

  return { wrapper, pinia, router, accountStore }
}

describe('verifyAccount.vue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the pending state while the request is in flight', async () => {
    const verifyResult = new Promise<VerifyResult>(() => {
      // Never resolves; component stays in pending.
    })
    const { wrapper } = await mountVerifyAccount({ verifyResult })

    expect(wrapper.get('[data-testid="verify-account-pending"]').text()).toEqual(
      'Verifying your account…',
    )
  })

  it('shows the success state after a resolved request and redirects to login', async () => {
    vi.useFakeTimers()
    const { wrapper, accountStore, router } = await mountVerifyAccount({
      verifyResult: Promise.resolve(Ok.EMPTY),
    })
    const pushSpy = vi.spyOn(router, 'push')

    await flushPromises()

    expect(accountStore.verifyAccount).toHaveBeenCalledWith('abc')
    expect(wrapper.get('[data-testid="verify-account-success"]').text()).toEqual(
      'Account verified — redirecting to login.',
    )

    vi.advanceTimersByTime(2000)
    expect(pushSpy).toHaveBeenCalledWith({ name: 'logIn' })
  })

  it('shows the failure state on a validation error', async () => {
    const { wrapper } = await mountVerifyAccount({
      verifyResult: Promise.resolve(new Err({ key: ['is invalid or has expired'] })),
    })

    await flushPromises()

    expect(wrapper.get('[data-testid="verify-account-failure"]').text()).toEqual(
      'Verification failed: is invalid or has expired.',
    )
  })

  it('shows the failure state on a thrown error', async () => {
    const { wrapper } = await mountVerifyAccount({
      verifyResult: Promise.reject(new Error('network down')),
    })

    await flushPromises()

    expect(wrapper.get('[data-testid="verify-account-failure"]').text()).toEqual(
      'Verification failed: network down.',
    )
  })
})
