<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useFlightStore } from '@/stores/modules/flight'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()
const flightStore = useFlightStore()

const passengerName = computed(() => route.params.loadName)
const flight = computed(() => flightStore.flight)
const pilotName = computed(() => flight.value?.pilot.name)
</script>

<template>
  <div class="finished" data-testid="flight-finished">
    <div v-if="!flightStore.flight" class="empty error">
      {{ t('error.notFound') }}
    </div>
    <div v-else-if="flightStore.flightLoading" class="empty">
      {{ t('messages.loading') }}
    </div>
    <div v-else class="finished-content">
      <div class="finished-wordmark gradient-text">{{ t('title') }}</div>
      <h1>{{ t('flights.finished.title', { name: passengerName }) }}</h1>
      <p class="finished-body">{{ t('flights.finished.body', { name: pilotName }) }}</p>
      <p class="finished-note">
        <i18n-t keypath="flights.finished.note" tag="small">
          <router-link :to="{ name: 'flightsShow', params: { id: flight?.UUID } }">
            {{ t('flights.finished.formLink') }}
          </router-link>
        </i18n-t>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.finished {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 32px 16px;
}

.finished-content {
  max-width: 400px;
  text-align: center;
}

.finished-wordmark {
  margin-bottom: 20px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.finished-body {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.finished-note {
  margin-top: 20px;
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
