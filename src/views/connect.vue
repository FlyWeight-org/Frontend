<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth'
import { decideConsent, loadConsent, type Consent } from '@/services/connections'
import LogIn from '@/views/home/logIn.vue'
import Navbar from '@/components/flights/nav.vue'
import ConnectionPermissions from '@/components/connections/permissions.vue'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()
const consent = ref<Consent | null>(null)
const requestQuery = ref<URLSearchParams | null>(null)
const error = ref(false)
const processing = ref(false)
const callbackHost = computed(() => consent.value && new URL(consent.value.redirect_uri).host)
const heading = computed(() =>
  consent.value
    ? t('connections.requestTitle', { name: consent.value.client_name })
    : t('connections.connectTitle'),
)

watch(
  [() => auth.loggedIn, () => route.fullPath],
  async ([loggedIn], _, onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => {
      controller.abort()
    })
    consent.value = null
    requestQuery.value = null
    error.value = false
    if (!loggedIn) return
    try {
      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(route.query)) {
        if (typeof value !== 'string') throw new Error('Invalid authorization query')
        query.set(key, value)
      }
      const details = await loadConsent(query)
      if (!controller.signal.aborted) {
        consent.value = details
        requestQuery.value = query
      }
    } catch {
      if (!controller.signal.aborted) error.value = true
    }
  },
  { immediate: true },
)

async function decide(decision: 'allow' | 'deny'): Promise<void> {
  if (!requestQuery.value || processing.value) return
  processing.value = true
  error.value = false
  try {
    const callback = await decideConsent(requestQuery.value, decision)
    window.location.assign(callback)
  } catch {
    error.value = true
    processing.value = false
  }
}
</script>

<template>
  <Navbar v-if="auth.loggedIn" />
  <main id="main-content">
    <h1>{{ heading }}</h1>
    <template v-if="!auth.loggedIn">
      <p>{{ t('connections.signIn') }}</p>
      <LogIn stay-on-page />
    </template>
    <section v-else class="card consent-card" :aria-busy="processing">
      <p v-if="error" role="alert" class="error">{{ t('connections.error') }}</p>
      <template v-if="consent">
        <i18n-t keypath="connections.callbackHost" tag="p" class="callback-host">
          <template #host>
            <strong>{{ callbackHost }}</strong>
          </template>
        </i18n-t>
        <p class="destination">{{ t('connections.destination', { url: consent.redirect_uri }) }}</p>
        <p>
          {{ t('connections.identity', { name: consent.pilot.name, email: consent.pilot.email }) }}
          <button type="button" class="link" :disabled="processing" @click="auth.logOut()">
            {{ t('connections.switchAccount') }}
          </button>
        </p>
        <p>{{ t('connections.request') }}</p>
        <ConnectionPermissions :scopes="consent.scopes" />
        <p>{{ t('connections.privacy') }}</p>
        <div class="consent-actions">
          <button type="button" :disabled="processing" @click="decide('allow')">
            {{ t('connections.allow') }}
          </button>
          <button type="button" class="link" :disabled="processing" @click="decide('deny')">
            {{ t('connections.deny') }}
          </button>
        </div>
      </template>
      <p v-else-if="!error" role="status">{{ t('connections.loading') }}</p>
    </section>
  </main>
</template>

<style scoped lang="scss">
.consent-card {
  padding: 24px;
  overflow-wrap: anywhere;
}

.callback-host {
  margin-top: 0;
  font-size: 16px;

  strong {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
  }
}

.destination {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.consent-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
</style>
