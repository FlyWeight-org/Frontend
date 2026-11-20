<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { isNull } from 'lodash-es'
import { browserSupportsWebAuthnAutofill, WebAuthnAbortService } from '@simplewebauthn/browser'
import config from '@/config'
import Field from '@/components/field.vue'
import Turnstile from '@/components/turnstile.vue'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { usePresence } from '@/composables/usePresence'
import { useAuthStore } from '@/stores/modules/auth'
import { usePasskeysStore } from '@/stores/modules/passkeys'
import type { Errors } from '@/stores/types'

usePresence({ mode: 'once' })

const props = defineProps<{ stayOnPage?: boolean }>()
const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const passkeysStore = usePasskeysStore()

const session = reactive({
  login: '',
  password: '',
})
const turnstileToken = ref('')
const turnstileRef = useTemplateRef<{ reset: () => void }>('turnstileRef')

const URL = `${config.APIURL}/login`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<unknown>(
  () => authStore.logIn({ ...session, turnstile_token: turnstileToken.value }),
  async () => {
    if (!props.stayOnPage) await router.push({ name: 'flightsList' })
  },
  () => {
    session.password = ''
    turnstileRef.value?.reset()
    turnstileToken.value = ''
  },
)
const errorMessage = computed<string | null>(() =>
  isNull(error) ? null : t('home.logIn.error', { error: error.value }),
)

const passkeyError = ref<string | null>(null)
let unmounted = false

const errorsSentence = (errors: Errors): string => Object.values(errors).flat().join(', ')

// Offers passkeys through autofill until one logs in. A passkey the server
// rejects (such as one picked after its challenge expired) re-arms autofill
// with fresh options; each attempt waits on the user picking a passkey.
async function armPasskeyAutofill(): Promise<void> {
  try {
    const result = await passkeysStore.autofillLogIn()
    if (result.ok) {
      if (!props.stayOnPage) await router.push({ name: 'flightsList' })
    } else {
      rearmPasskeyAutofill(result.val)
    }
  } catch {
    // Autofill rejects when the user dismisses it, navigates away, or
    // submits the password form, and when no options can be fetched. None
    // of these are errors worth surfacing.
  }
}

function rearmPasskeyAutofill(rejection: Errors): void {
  passkeyError.value = errorsSentence(rejection)
  if (!unmounted) void armPasskeyAutofill()
}

onMounted(async () => {
  if (await browserSupportsWebAuthnAutofill()) await armPasskeyAutofill()
})

onBeforeUnmount(() => {
  unmounted = true
  WebAuthnAbortService.cancelCeremony()
})
</script>

<template>
  <div class="card auth-card">
    <p v-if="error" class="error" data-testid="login-error">
      {{ errorMessage }}
    </p>

    <p v-if="passkeyError" class="error" data-testid="login-passkey-error">
      {{ passkeyError }}
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

      <Turnstile
        ref="turnstileRef"
        v-model="turnstileToken"
        :site-key="config.TURNSTILE_SITE_KEY"
        data-testid="login-turnstile"
      />

      <fieldset class="actions">
        <input
          type="submit"
          name="commit"
          :value="t('home.logIn.button')"
          :class="{ processing: isProcessing }"
          :disabled="!turnstileToken"
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
