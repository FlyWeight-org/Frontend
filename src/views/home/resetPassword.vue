<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import config from '@/config'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import Field from '@/components/field.vue'
import { useAccountStore } from '@/stores/modules/account'
import { isArray } from 'lodash-es'
import { Err, Ok } from 'ts-results'

const { t } = useI18n()
const route = useRoute()
const accountStore = useAccountStore()

function resetPasswordToken(): string {
  if (isArray(route.query.key)) return route.query.key[0] ?? ''
  return route.query.key ?? ''
}

const form = reactive({
  password: '',
  confirmation: '',
})
const URL = `${config.APIURL}/reset-password`
const success = ref(false)
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  async () => {
    success.value = false
    if (form.password !== form.confirmation) {
      return new Err({
        password_confirmation: [t('home.resetPassword.mismatch')],
      })
    }
    return accountStore
      .resetPassword({
        password: form.password,
        token: resetPasswordToken(),
      })
      .then((r) => (r.ok ? Ok.EMPTY : r))
  },
  () => {
    success.value = true
  },
)
</script>

<template>
  <div class="card auth-card">
    <h2>{{ t('home.resetPassword.title') }}</h2>
    <form method="post" :action="URL" @submit.prevent="submitHandler">
      <field
        v-model="form.password"
        type="password"
        object="pilot"
        field="password"
        :label="t('pilot.password')"
        :errors="errors"
        required
        autocomplete="new-password"
        data-testid="reset-password-password"
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
        data-testid="reset-password-password-confirmation"
      />

      <fieldset class="actions">
        <input
          type="submit"
          name="commit"
          :value="t('home.resetPassword.button')"
          :class="{ processing: isProcessing }"
          data-testid="reset-password-submit"
        />
      </fieldset>
    </form>

    <p v-if="error" class="error">
      {{ error }}
    </p>
    <ul v-if="errors.key?.length" class="error" data-testid="reset-password-errors">
      <li v-for="err in errors.key" :key="err">
        {{ t('home.resetPassword.tokenError', { error: err }) }}
      </li>
    </ul>

    <p v-if="success" class="success" data-testid="reset-password-success">
      {{ t('home.resetPassword.success') }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  padding: 24px;
  text-align: left;
}
</style>
