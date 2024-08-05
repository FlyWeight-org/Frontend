<template>
  <p v-if="!accountStore.currentPilot" class="empty">
    {{ t('messages.loading') }}
  </p>

  <form
    v-else
    method="patch"
    :action="URL"
    data-testid="account-form"
    @submit.prevent="submitHandler"
  >
    <field
      v-model="pilot.name"
      type="text"
      object="pilot"
      field="name"
      requried
      :errors="errors"
      :label="t('pilot.name')"
      autocomplete="name"
      data-testid="account-name"
    />

    <field
      v-model="pilot.email"
      type="email"
      object="pilot"
      field="email"
      requried
      :errors="errors"
      :label="t('pilot.email')"
      autocomplete="email"
      data-testid="account-email"
    />

    <field
      v-model="pilot.current_password"
      type="password"
      object="pilot"
      field="current_password"
      requried
      :errors="errors"
      :label="t('pilot.current_password')"
      autocomplete="current-password"
      data-testid="account-password"
    />

    <h2>Change Password</h2>

    <field
      v-model="pilot.password"
      type="password"
      object="pilot"
      field="password"
      requried
      :errors="errors"
      :label="t('pilot.password')"
      autocomplete="new-password"
      data-testid="account-new-password"
    />

    <field
      v-model="pilot.password_confirmation"
      type="password"
      object="pilot"
      field="password_confirmation"
      requried
      :errors="errors"
      :label="t('pilot.password_confirmation')"
      autocomplete="new-password"
      data-testid="account-new-password-confirmation"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('account.edit.button')"
        :disabled="!dirty"
        :class="{ processing: isProcessing }"
        data-testid="account-submit"
      />
    </fieldset>
  </form>

  <p v-if="error" class="error" data-testid="account-errors">
    {{ error }}
  </p>
  <p v-if="success" class="success" data-testid="account-success">
    {{ t('account.edit.success') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, watch } from 'vue'
import { isEmpty, isNull } from 'lodash-es'
import Field from '@/components/field.vue'
import config from '@/config'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import requireAuth from '@/composables/requireAuth'
import type { PilotJSONUp } from '@/stores/coding'
import { useAccountStore } from '@/stores/modules/account'

const { t } = useI18n()
const accountStore = useAccountStore()

requireAuth()

const URL = `${config.APIURL}/account.json`
const pilot = reactive<PilotJSONUp>({
  ...(accountStore.currentPilot || {
    email: '',
    name: ''
  }),
  current_password: '',
  password: '',
  password_confirmation: ''
})
const success = ref(false)
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  () => {
    success.value = false
    return accountStore.updateAccount(pilot)
  },
  () => {
    success.value = true
    return Promise.resolve()
  },
  async () => {
    success.value = false
    pilot.current_password = ''
    pilot.password = ''
    pilot.password_confirmation = ''
  }
)

const dirty = computed<boolean>(() => {
  if (isNull(accountStore.currentPilot)) return true
  return (
    pilot.email !== accountStore.currentPilot.email ||
    pilot.name !== accountStore.currentPilot.name ||
    !isEmpty(pilot.password) ||
    !isEmpty(pilot.password_confirmation)
  )
})

watch(
  () => accountStore.currentPilot,
  () => {
    if (isNull(accountStore.currentPilot)) return // requireAuth will handle redirect
    pilot.email = accountStore.currentPilot.email
    pilot.name = accountStore.currentPilot.name
  }
)
</script>
