<template>
  <main>
    <div v-if="flightsStore.flightsLoading" class="empty">
      {{ t('messages.loading') }}
    </div>
    <div v-else-if="flightsStore.flightsError" class="error empty">
      {{ flightsStore.flightsError }}
    </div>
    <div v-else-if="flightsStore.noFlights" class="empty" data-testid="no-flights">
      {{ t('flights.list.empty') }}
    </div>
    <div
      v-for="flight in flightsStore.sortedFlights"
      v-else
      :key="flight.UUID"
      class="flight-list"
      :flight="flight"
      data-testid="flight-list"
    >
      <flight-view :flight="flight" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FlightView from '@/components/flights/list/flight.vue'
import requireAuth from '@/composables/requireAuth'
import { useFlightsStore } from '@/stores/modules/flights'

const { t } = useI18n()
const flightsStore = useFlightsStore()

requireAuth()
onMounted(() => flightsStore.loadFlights())
</script>
