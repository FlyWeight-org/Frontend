import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { Ok } from 'ts-results'
import { createRouter, createMemoryHistory } from 'vue-router'
import SignUp from '@/views/home/signUp.vue'
import { useAccountStore } from '@/stores/modules/account'
import i18n from '@/i18n'
import TurnstileStub from './turnstileStub'

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: SignUp, name: 'signUp' },
      { path: '/flights', component: { template: '<div />' }, name: 'flightsList' },
    ],
  })
}

describe('signUp.vue', () => {
  it('disables submit until Turnstile produces a token', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const wrapper = mount(SignUp, {
      global: {
        plugins: [pinia, i18n, buildRouter()],
        stubs: { Turnstile: TurnstileStub },
      },
    })

    expect(wrapper.get('input[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('passes turnstile_token in the signUp payload', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const wrapper = mount(SignUp, {
      global: {
        plugins: [pinia, i18n, buildRouter()],
        stubs: { Turnstile: TurnstileStub },
      },
    })

    const accountStore = useAccountStore(pinia)
    vi.mocked(accountStore.signUp).mockResolvedValue(new Ok(undefined))

    await wrapper.get('input[name="pilot[name]"]').setValue('Sancho Sample')
    await wrapper.get('input[name="pilot[login]"]').setValue('sancho@example.com')
    await wrapper.get('input[name="pilot[password]"]').setValue('supersecret')
    await wrapper.get('[data-testid="turnstile-stub"]').trigger('click')
    await wrapper.get('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(accountStore.signUp).toHaveBeenCalledWith({
      name: 'Sancho Sample',
      login: 'sancho@example.com',
      password: 'supersecret',
      turnstile_token: 'fake-turnstile-token',
    })
  })
})
