<template>
  <main>
    <div v-if="flightStore.flightLoading" class="empty">
      {{ t('messages.loading') }}
    </div>
    <div v-else-if="flightStore.flightError" class="error empty">
      {{ flightStore.flightError }}
    </div>
    <div v-else-if="!flightStore.flight" class="empty">
      {{ t('flights.show.authorized.none') }}
    </div>

    <div v-else data-cy="authorized-flight">
      <authorized-flight v-if="flightStore.flight.canEdit" :flight="flightStore.flight" />
      <unauthorized-flight v-else :flight="flightStore.flight" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthorizedFlight from './show/authorized.vue'
import UnauthorizedFlight from './show/unauthorized.vue'
import { useFlightStore } from '@/stores/modules/flight'

const { t } = useI18n()
const flightStore = useFlightStore()
</script>
