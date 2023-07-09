<template>
  <p class="empty" v-if="!accountStore.currentPilot">
    {{ t('messages.loading') }}
  </p>

  <form method="patch" :action="URL" @submit.prevent="submitHandler" data-cy="account-form" v-else>
    <field
      type="text"
      v-model="pilot.name"
      object="pilot"
      field="name"
      requried
      :errors="errors"
      :label="t('pilot.name')"
      autocomplete="name"
      data-cy="account-name"
    />

    <field
      type="email"
      v-model="pilot.email"
      object="pilot"
      field="email"
      requried
      :errors="errors"
      :label="t('pilot.email')"
      autocomplete="email"
      data-cy="account-email"
    />

    <field
      type="password"
      v-model="pilot.current_password"
      object="pilot"
      field="current_password"
      requried
      :errors="errors"
      :label="t('pilot.current_password')"
      autocomplete="current-password"
      data-cy="account-password"
    />

    <h2>Change Password</h2>

    <field
      type="password"
      v-model="pilot.password"
      object="pilot"
      field="password"
      requried
      :errors="errors"
      :label="t('pilot.password')"
      autocomplete="new-password"
      data-cy="account-new-password"
    />

    <field
      type="password"
      v-model="pilot.password_confirmation"
      object="pilot"
      field="password_confirmation"
      requried
      :errors="errors"
      :label="t('pilot.password_confirmation')"
      autocomplete="new-password"
      data-cy="account-new-password-confirmation"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('account.edit.button')"
        :disabled="!dirty"
        :class="{ processing: isProcessing }"
        data-cy="account-submit"
      />
    </fieldset>
  </form>

  <p class="error" data-cy="account-errors" v-if="error">{{ error }}</p>
  <p class="success" data-cy="account-success" v-if="success">
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
