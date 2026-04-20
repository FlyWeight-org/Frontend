<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref, watch } from 'vue'
import { isNull } from 'lodash-es'
import Field from '@/components/field.vue'
import config from '@/config'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import requireAuth from '@/composables/requireAuth'
import type { PilotJSONUp } from '@/stores/coding'
import { useAccountStore } from '@/stores/modules/account'

const { t } = useI18n()
const accountStore = useAccountStore()

requireAuth()

const URL = `${config.APIURL}/account`
const pilot: PilotJSONUp = reactive({
  email: accountStore.currentPilot?.email ?? '',
  name: accountStore.currentPilot?.name ?? '',
})
const success = ref(false)
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  () => {
    success.value = false
    return accountStore.updateAccount(pilot)
  },
  () => {
    success.value = true
  },
  () => {
    success.value = false
  },
)

const dirty = computed<boolean>(() => {
  if (isNull(accountStore.currentPilot)) return true
  return (
    pilot.email !== accountStore.currentPilot.email || pilot.name !== accountStore.currentPilot.name
  )
})

watch(
  () => accountStore.currentPilot,
  () => {
    if (isNull(accountStore.currentPilot)) return // requireAuth will handle redirect
    pilot.email = accountStore.currentPilot.email ?? ''
    pilot.name = accountStore.currentPilot.name
  },
)
</script>

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
