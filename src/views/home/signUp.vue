<template>
  <form method="post" :action="URL" @submit.prevent="submitHandler">
    <field
      type="text"
      v-model="pilot.name"
      object="pilot"
      field="name"
      :errors="errors"
      :label="t('pilot.name')"
      required
      autocomplete="name"
      data-cy="signup-name"
    />

    <field
      type="email"
      v-model="pilot.email"
      object="pilot"
      field="email"
      :errors="errors"
      :label="t('pilot.email')"
      required
      autocomplete="email"
      data-cy="signup-email"
    />

    <field
      type="password"
      v-model="pilot.password"
      object="pilot"
      field="password"
      :errors="errors"
      :label="t('pilot.password')"
      required
      autocomplete="new-password"
      data-cy="signup-password"
    />

    <field
      type="password"
      v-model="pilot.password_confirmation"
      object="pilot"
      field="password_confirmation"
      :errors="errors"
      :label="t('pilot.password_confirmation')"
      required
      autocomplete="new-password"
      data-cy="signup-password-confirmation"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('home.signUp.button')"
        :class="{ processing: isProcessing }"
        data-cy="signup-submit"
      />
    </fieldset>
  </form>

  <p class="error" v-if="error">{{ errorMessage }}</p>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { isNull } from 'lodash-es'
import config from '@/config'
import type { PilotJSONUp } from '@/stores/coding'
import Field from '@/components/field.vue'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useAccountStore } from '@/stores/modules/account'

const { t } = useI18n()
const router = useRouter()
const accountStore = useAccountStore()

const pilot = reactive<PilotJSONUp>({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const URL = `${config.APIURL}/signup.json`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  () => accountStore.signUp(pilot),
  async () => {
    await router.push({ name: 'flightsList' })
  }
)

const errorMessage = computed<string | null>(() =>
  isNull(error) ? null : t('home.signUp.error', { error: error.value })
)
</script>
