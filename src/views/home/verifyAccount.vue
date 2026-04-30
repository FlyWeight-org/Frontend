<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { isArray } from 'lodash-es'
import { errorToString, notifySentry } from '@/utils/errors'
import { useAccountStore } from '@/stores/modules/account'

const REDIRECT_DELAY_MS = 1500

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()

type State = 'pending' | 'success' | 'failure'

const state = ref<State>('pending')
const errorText = ref<string | null>(null)

function verifyAccountKey(): string {
  if (isArray(route.query.key)) return route.query.key[0] ?? ''
  return route.query.key ?? ''
}

onMounted(async () => {
  try {
    const result = await accountStore.verifyAccount(verifyAccountKey())
    if (result.ok) {
      state.value = 'success'
      setTimeout(() => {
        router.push({ name: 'logIn' }).catch(notifySentry)
      }, REDIRECT_DELAY_MS)
    } else {
      state.value = 'failure'
      errorText.value = Object.values(result.val).flat().join(', ')
    }
  } catch (err) {
    notifySentry(err)
    state.value = 'failure'
    errorText.value = errorToString(err)
  }
})
</script>

<template>
  <div class="card auth-card">
    <p v-if="state === 'pending'" data-testid="verify-account-pending">
      {{ t('home.verifyAccount.pending') }}
    </p>

    <p v-else-if="state === 'success'" class="success" data-testid="verify-account-success">
      {{ t('home.verifyAccount.success') }}
    </p>

    <p v-else class="error" data-testid="verify-account-failure">
      {{ t('home.verifyAccount.failure', { error: errorText }) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  padding: 24px;
  text-align: left;
}
</style>
