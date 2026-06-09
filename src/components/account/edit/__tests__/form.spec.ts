import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Form from '../form.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAccountStore } from '../../../../stores/modules/account'
import { Err, Ok } from 'ts-results'
import i18n from '../../../../i18n'
import { JWT } from '../../../../__tests__/util'

describe('form.vue', () => {
  const initialState = {
    auth: {
      JWT,
      refreshToken: null,
      loggingIn: false,
    },
    account: {
      currentPilot: {
        name: 'Sancho Sample',
        email: 'sancho@example.com',
        weightUnit: 'lb',
        passkeys: [],
      },
      currentPilotLoading: false,
      currentPilotError: null,
    },
  }

  describe('form', () => {
    it('handles success', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState,
      })

      const wrapper = mount(Form, {
        global: {
          plugins: [pinia, i18n],
        },
      })

      const accountStore = useAccountStore(pinia)
      vi.mocked(accountStore.updateAccount).mockReturnValue(Promise.resolve(new Ok(undefined)))

      await wrapper.get('input[name="pilot[name]"]').setValue('New Name')
      await wrapper.get('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.get('p.success').text()).toEqual('Your account information has been changed.')
    })

    it('submits the selected weight unit', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState,
      })

      const wrapper = mount(Form, {
        global: {
          plugins: [pinia, i18n],
        },
      })

      const accountStore = useAccountStore(pinia)
      vi.mocked(accountStore.updateAccount).mockReturnValue(Promise.resolve(new Ok(undefined)))

      await wrapper.get('select[name="pilot[weight_unit]"]').setValue('kg')
      await wrapper.get('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(accountStore.updateAccount).toHaveBeenCalledWith(
        expect.objectContaining({ weight_unit: 'kg' }),
      )
    })

    it('handles invalid data', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState,
      })

      const wrapper = mount(Form, {
        global: {
          plugins: [pinia, i18n],
        },
      })

      const accountStore = useAccountStore(pinia)
      vi.mocked(accountStore.updateAccount).mockReturnValue(
        Promise.resolve(
          new Err({
            email: ['must not be blank'],
          }),
        ),
      )

      await wrapper.get('input[name="pilot[name]"]').setValue('New Name')
      await wrapper.get('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.get('ul.error li').text()).toEqual('must not be blank')
    })

    it('handles errors', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        initialState,
      })

      const wrapper = mount(Form, {
        global: {
          plugins: [pinia, i18n],
        },
      })

      const accountStore = useAccountStore(pinia)
      vi.mocked(accountStore.updateAccount).mockReturnValue(Promise.reject(new Error('some error')))

      await wrapper.get('input[name="pilot[name]"]').setValue('New Name')
      await wrapper.get('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.get('p.error').text()).toEqual('some error')
    })
  })
})
