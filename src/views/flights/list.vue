<template>
  <main>
    <div class="empty" v-if="flightsStore.flightsLoading">
      {{ t('messages.loading') }}
    </div>
    <div class="error empty" v-else-if="flightsStore.flightsError">
      {{ flightsStore.flightsError }}
    </div>
    <div class="empty" v-else-if="flightsStore.noFlights" data-cy="no-flights">
      {{ t('flights.list.empty') }}
    </div>
    <div
      class="flight-list"
      v-else
      v-for="flight in flightsStore.sortedFlights"
      :flight="flight"
      :key="flight.UUID"
      data-cy="flight-list"
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
