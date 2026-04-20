<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { isNull } from 'lodash-es'
import { browserSupportsWebAuthnAutofill, WebAuthnAbortService } from '@simplewebauthn/browser'
import config from '@/config'
import type { SessionJSONDown } from '@/stores/coding'
import Field from '@/components/field.vue'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useAuthStore } from '@/stores/modules/auth'
import { usePasskeysStore } from '@/stores/modules/passkeys'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const passkeysStore = usePasskeysStore()

const session: SessionJSONDown = reactive({
  login: '',
  password: '',
})
const URL = `${config.APIURL}/login`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<unknown>(
  () => authStore.logIn(session),
  async () => {
    await router.push({ name: 'flightsList' })
  },
  () => {
    session.password = ''
  },
)
const errorMessage = computed<string | null>(() =>
  isNull(error) ? null : t('home.logIn.error', { error: error.value }),
)

onMounted(async () => {
  if (!(await browserSupportsWebAuthnAutofill())) return
  try {
    const result = await passkeysStore.autofillLogIn()
    if (result.ok) await router.push({ name: 'flightsList' })
  } catch {
    // Autofill rejects when the user dismisses it, navigates away, or
    // submits the password form. None of these are errors worth surfacing.
  }
})

onBeforeUnmount(() => {
  WebAuthnAbortService.cancelCeremony()
})
</script>

<template>
  <div class="card auth-card">
    <p v-if="error" class="error" data-testid="login-error">
      {{ errorMessage }}
    </p>

    <form method="post" :action="URL" @submit.prevent="submitHandler">
      <field
        v-model="session.login"
        type="email"
        object="session"
        field="login"
        :label="t('pilot.email')"
        :errors="errors"
        required
        autocomplete="email webauthn"
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

      <fieldset class="actions">
        <input
          type="submit"
          name="commit"
          :value="t('home.logIn.button')"
          :class="{ processing: isProcessing }"
          data-testid="login-submit"
        />
      </fieldset>
    </form>

    <p class="auth-link" data-testid="forgot-password-link">
      <router-link to="/forgot-password">
        {{ t('home.logIn.forgotPassword') }}
      </router-link>
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  padding: 24px;
  text-align: left;
}

.auth-link {
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
}
</style>
