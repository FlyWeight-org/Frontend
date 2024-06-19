<template>
  <h2>{{ t('home.resetPassword.title') }}</h2>
  <form method="patch" :action="URL" @submit.prevent="submitHandler">
    <field
      v-model="form.password"
      type="password"
      object="pilot"
      field="password"
      :label="t('pilot.password')"
      :errors="errors"
      required
      autocomplete="new-password"
      data-cy="reset-password-password"
    />

    <field
      v-model="form.confirmation"
      type="password"
      object="pilot"
      field="password_confirmation"
      :label="t('pilot.password_confirmation')"
      :errors="errors"
      required
      autocomplete="new-password"
      data-cy="reset-password-password-confirmation"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('home.resetPassword.button')"
        :class="{ processing: isProcessing }"
        data-cy="reset-password-submit"
      />
    </fieldset>
  </form>

  <p v-if="error" class="error">
    {{ error }}
  </p>
  <ul v-if="errors.reset_password_token?.length" class="error" data-cy="reset-password-errors">
    <li v-for="err in errors.reset_password_token" :key="err">
      {{ t('home.resetPassword.tokenError', { error }) }}
    </li>
  </ul>

  <p v-if="success" class="success" data-cy="reset-password-success">
    {{ t('home.resetPassword.success') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import config from '@/config'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import Field from '@/components/field.vue'
import { useAccountStore } from '@/stores/modules/account'
import { isArray } from 'lodash-es'

const { t } = useI18n()
const route = useRoute()
const accountStore = useAccountStore()

interface ResetPasswordForm {
  password: string
  confirmation: string
}

function resetPasswordToken(): string {
  if (isArray(route.query.reset_password_token)) return route.query.reset_password_token[0] || ''
  return route.query.reset_password_token || ''
}

const form = reactive<ResetPasswordForm>({
  password: '',
  confirmation: ''
})
const URL = `${config.APIURL}/password_resets.json`
const success = ref<boolean>(false)
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  () => {
    success.value = false
    return accountStore.resetPassword({
      ...form,
      token: resetPasswordToken()
    })
  },
  async () => {
    success.value = true
  },
  () => Promise.resolve()
)
</script>
