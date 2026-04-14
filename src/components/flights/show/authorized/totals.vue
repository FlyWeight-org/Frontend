<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { Flight } from '@/types'
import { isPassenger, isCargo } from '@/types'

const { t, n } = useI18n()

const props = defineProps<{
  flight: Flight
}>()

const loads = computed(() =>
  props.flight.loads ? props.flight.loads.filter((load) => !load.disabled) : [],
)
const passengers = computed(() => loads.value.filter(isPassenger))
const cargo = computed(() => loads.value.filter(isCargo))
const paxCount = computed(() => passengers.value.length)
const avgPaxWeight = computed(() =>
  paxCount.value > 0
    ? passengers.value.reduce((sum, cur) => sum + cur.weight, 0) / paxCount.value
    : 0,
)
const totalCargoAndBags = computed(() => {
  const bags = passengers.value.reduce((sum, cur) => sum + cur.bagsWeight, 0)
  const cargoW = cargo.value.reduce((sum, cur) => sum + cur.bagsWeight, 0)
  return bags + cargoW
})
const totalWeight = computed(() => {
  const pax = passengers.value.reduce((sum, cur) => sum + cur.weight, 0)
  return pax + totalCargoAndBags.value
})
</script>

<template>
  <div class="sticky-totals" data-testid="total-weight">
    <div class="totals-breakdown">
      <div class="totals-stats">
        <div class="stat">
          <div class="stat-value">{{ paxCount }}</div>
          <div class="stat-label">{{ t('flights.show.authorized.header.passengers') }}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ paxCount > 0 ? n(avgPaxWeight, 'pounds') : '—' }}</div>
          <div class="stat-label">{{ t('flights.show.authorized.loads.averageWeightLabel') }}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ n(totalCargoAndBags, 'pounds') }}</div>
          <div class="stat-label">{{ t('flights.show.authorized.loads.cargoAndBagsLabel') }}</div>
        </div>
      </div>
      <div class="totals-divider" />
      <div class="totals-row total">
        <span class="totals-label">{{ t('flights.show.authorized.loads.totalWeight') }}</span>
        <span class="totals-value gradient-text" data-testid="total-weight-value">{{
          n(totalWeight, 'pounds')
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sticky-totals {
  position: sticky;
  bottom: 0;
  z-index: 50;
  padding: 12px 16px;
  margin: 0 -16px;
  background: var(--color-totals-bg);
  border-top: 1px solid var(--color-totals-border);
  backdrop-filter: blur(12px);
}

.totals-breakdown {
  max-width: 640px;
  margin: 0 auto;
}

.totals-stats {
  display: flex;
  gap: 16px;
  justify-content: space-around;
  margin-bottom: 4px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.stat-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.totals-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.totals-value {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.totals-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--color-totals-border);
}

.total {
  .totals-label {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .totals-value {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 800;
  }
}

@media (width >= 640px) {
  .sticky-totals {
    margin: 0 -24px;
    padding: 12px 24px;
  }
}
</style>
