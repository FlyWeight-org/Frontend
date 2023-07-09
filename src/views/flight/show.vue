<template>
  <main>
    <div class="empty" v-if="flightStore.flightLoading">
      {{ t('messages.loading') }}
    </div>
    <div class="error empty" v-else-if="flightStore.flightError">
      {{ flightStore.flightError }}
    </div>
    <div class="empty" v-else-if="!flightStore.flight">
      {{ t('flights.show.authorized.none') }}
    </div>

    <div data-cy="authorized-flight" v-else>
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
