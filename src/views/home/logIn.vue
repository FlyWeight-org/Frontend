<template>
  <p class="error">
    {{ t('home.logIn.newAccounts') }}
  </p>

  <form method="post" :action="URL" @submit.prevent="submitHandler">
    <field
      v-model="session.email"
      type="email"
      object="session"
      field="email"
      :label="t('pilot.email')"
      :errors="errors"
      required
      autocomplete="email"
      data-testid="login-email"
    />

    <field
      v-model="session.password"
      type="password"
      object="session"
      field="password"
      :label="t('session.password')"
      :errors="errors"
      required
      autocomplete="current-password"
      data-testid="login-password"
    />

    <field
      v-model="session.remember_me"
      type="checkbox"
      object="session"
      field="remember_me"
      :errors="errors"
      :label="t('home.logIn.rememberMe')"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('home.logIn.button')"
        :class="{ processing: isProcessing }"
        data-testid="login-submit"
      />

      <p data-testid="forgot-password-link">
        <router-link to="/forgot-password">
          {{ t('home.logIn.forgotPassword') }}
        </router-link>
      </p>
    </fieldset>
  </form>

  <p v-if="error" class="error" data-testid="login-error">
    {{ errorMessage }}
  </p>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { isNull } from 'lodash-es'
import config from '@/config'
import type { SessionJSONDown } from '@/stores/coding'
import Field from '@/components/field.vue'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useAuthStore } from '@/stores/modules/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const session = reactive<SessionJSONDown>({
  email: '',
  password: '',
  remember_me: false
})
const URL = `${config.APIURL}/login.json`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<unknown>(
  () => authStore.logIn(session),
  async () => {
    await router.push({ name: 'flightsList' })
  },
  async () => {
    session.password = ''
  }
)
const errorMessage = computed<string | null>(() =>
  isNull(error) ? null : t('home.logIn.error', { error: error.value })
)
</script>
