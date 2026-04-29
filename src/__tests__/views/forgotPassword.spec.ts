import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import ForgotPassword from '@/views/home/forgotPassword.vue'
import { useAccountStore } from '@/stores/modules/account'
import i18n from '@/i18n'
import TurnstileStub from './turnstileStub'

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: ForgotPassword, name: 'forgotPassword' },
      { path: '/login', component: { template: '<div />' }, name: 'logIn' },
    ],
  })
}

describe('forgotPassword.vue', () => {
  it('disables submit until Turnstile produces a token', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const wrapper = mount(ForgotPassword, {
      global: {
        plugins: [pinia, i18n, buildRouter()],
        stubs: { Turnstile: TurnstileStub },
      },
    })

    expect(wrapper.get('input[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('passes turnstile_token in the forgotPassword payload', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const wrapper = mount(ForgotPassword, {
      global: {
        plugins: [pinia, i18n, buildRouter()],
        stubs: { Turnstile: TurnstileStub },
      },
    })

    const accountStore = useAccountStore(pinia)
    vi.mocked(accountStore.forgotPassword).mockResolvedValue(undefined)

    await wrapper.get('input[name="form[email]"]').setValue('sancho@example.com')
    await wrapper.get('[data-testid="turnstile-stub"]').trigger('click')
    await wrapper.get('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(accountStore.forgotPassword).toHaveBeenCalledWith({
      login: 'sancho@example.com',
      turnstile_token: 'fake-turnstile-token',
    })
  })
})
