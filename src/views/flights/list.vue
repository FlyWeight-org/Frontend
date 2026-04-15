<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import FlightView from '@/components/flights/list/flight.vue'
import requireAuth from '@/composables/requireAuth'
import { useFlightsStore } from '@/stores/modules/flights'

const { t } = useI18n()
const flightsStore = useFlightsStore()

requireAuth()
onMounted(() => flightsStore.loadFlights())
</script>

<template>
  <main id="main-content">
    <div v-if="flightsStore.flightsLoading" class="empty">
      {{ t('messages.loading') }}
    </div>
    <div v-else-if="flightsStore.flightsError" class="error empty">
      {{ flightsStore.flightsError }}
    </div>
    <div v-else-if="flightsStore.noFlights" class="empty" data-testid="no-flights">
      {{ t('flights.list.empty') }}
    </div>
    <div v-else class="flights-list">
      <div
        v-for="flight in flightsStore.sortedFlights"
        :key="flight.UUID"
        data-testid="flight-list"
      >
        <flight-view :flight="flight" />
      </div>
    </div>

    <router-link
      to="/flights/new"
      class="fab"
      data-testid="nav-add-flight-fab"
      :aria-label="t('flights.list.addFABAria')"
    >
      <Plus :size="24" :stroke-width="2.5" />
    </router-link>
  </main>
</template>

<style scoped lang="scss">
.flights-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
  border: 0;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgb(124 58 237 / 30%);
  transition: transform 0.1s ease;
  -webkit-text-fill-color: initial;

  &:hover {
    transform: scale(1.05);
    -webkit-text-fill-color: initial;
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
