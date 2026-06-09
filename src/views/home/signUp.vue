<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNull } from 'lodash-es'
import config from '@/config'
import Field from '@/components/field.vue'
import FieldGroup from '@/components/fieldGroup.vue'
import Turnstile from '@/components/turnstile.vue'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useAccountStore } from '@/stores/modules/account'
import { global, localeOptions, setLocale, type SupportedLocale } from '@/i18n'
import type { WeightUnit } from '@/utils/weight'

const { t } = useI18n()
const accountStore = useAccountStore()

const pilot = reactive<{
  name: string
  login: string
  password: string
  weight_unit: WeightUnit
  locale: SupportedLocale
}>({
  name: '',
  login: '',
  password: '',
  weight_unit: 'lb',
  locale: global.locale.value as SupportedLocale,
})
const weightUnitOptions = [
  { value: 'lb', label: t('account.edit.weightUnit.lb') },
  { value: 'kg', label: t('account.edit.weightUnit.kg') },
]
const languageOptions = localeOptions()

// Preview the chosen language immediately as the user picks it.
watch(
  () => pilot.locale,
  (locale) => {
    void setLocale(locale)
  },
)
const turnstileToken = ref('')
const turnstileRef = useTemplateRef<{ reset: () => void }>('turnstileRef')

const URL = `${config.APIURL}/signup`
const signedUpEmail = ref<string | null>(null)
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling(
  () => accountStore.signUp({ ...pilot, turnstile_token: turnstileToken.value }),
  () => {
    signedUpEmail.value = pilot.login
  },
  () => {
    turnstileRef.value?.reset()
    turnstileToken.value = ''
  },
)

const errorMessage = computed<string | null>(() =>
  isNull(error) ? null : t('home.signUp.error', { error: error.value }),
)
</script>

<template>
  <div class="card auth-card">
    <template v-if="signedUpEmail">
      <p class="success" data-testid="signup-success">
        {{ t('home.signUp.checkEmail', { email: signedUpEmail }) }}
      </p>
      <p>
        <router-link :to="{ name: 'logIn' }">
          {{ t('home.signUp.logInLink') }}
        </router-link>
      </p>
    </template>

    <template v-else>
      <p v-if="error" class="error">
        {{ errorMessage }}
      </p>

      <form method="post" :action="URL" @submit.prevent="submitHandler">
        <field-group>
          <field
            v-model="pilot.name"
            type="text"
            object="pilot"
            field="name"
            :errors="errors"
            :label="t('pilot.name')"
            required
            autocomplete="name"
            data-testid="signup-name"
          />

          <field
            v-model="pilot.login"
            type="email"
            object="pilot"
            field="login"
            :errors="errors"
            :label="t('pilot.email')"
            required
            autocomplete="email"
            data-testid="signup-email"
          />

          <field
            v-model="pilot.password"
            type="password"
            object="pilot"
            field="password"
            :errors="errors"
            :label="t('pilot.password')"
            required
            autocomplete="new-password"
            data-testid="signup-password"
          />
        </field-group>

        <field-group>
          <field
            v-model="pilot.weight_unit"
            type="select"
            object="pilot"
            field="weight_unit"
            :errors="errors"
            :label="t('account.edit.weightUnit.label')"
            :options="weightUnitOptions"
            data-testid="signup-weight-unit"
          />

          <field
            v-model="pilot.locale"
            type="select"
            object="pilot"
            field="locale"
            :errors="errors"
            :label="t('account.edit.language.label')"
            :options="languageOptions"
            data-testid="signup-language"
          />
        </field-group>

        <Turnstile
          ref="turnstileRef"
          v-model="turnstileToken"
          :site-key="config.TURNSTILE_SITE_KEY"
          data-testid="signup-turnstile"
        />

        <fieldset class="actions">
          <input
            type="submit"
            name="commit"
            :value="t('home.signUp.button')"
            :class="{ processing: isProcessing }"
            :disabled="!turnstileToken"
            data-testid="signup-submit"
          />
        </fieldset>
      </form>
    </template>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  padding: 24px;
  text-align: left;
}
</style>
