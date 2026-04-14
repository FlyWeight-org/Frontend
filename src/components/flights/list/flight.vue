<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { FlightListItem } from '@/types'

const { d, t } = useI18n()
const router = useRouter()

const props = defineProps<{
  flight: FlightListItem
}>()

const date = computed(() => d(props.flight.date.toJSDate(), 'short'))
const paxCount = computed(() => props.flight.passengerCount)
const flightURL = computed(
  () =>
    router.resolve({
      name: 'flightsShow',
      params: { flightID: props.flight.UUID },
    }).href,
)
</script>

<template>
  <a class="flight-card" :href="flightURL" data-testid="flight-list-item">
    <div class="flight-card-body">
      <div class="flight-card-info">
        <div class="flight-card-description" v-if="flight.description">
          {{ flight.description }}
        </div>
        <div class="flight-card-meta">
          <span class="flight-card-date">{{ date }}</span>
          <span class="flight-card-pax">
            {{ t('flights.list.flight.passengers', { count: paxCount }) }}
          </span>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped lang="scss">
.flight-card {
  display: block;
  padding: 14px 16px;
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 12px;
  box-shadow: var(--color-surface-shadow);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-input-border);
  }
}

.flight-card-description {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.flight-card-meta {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 13px;
}

.flight-card-date {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.flight-card-pax {
  color: var(--color-text-muted);
}
</style>
