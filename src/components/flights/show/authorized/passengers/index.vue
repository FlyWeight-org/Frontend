<template>
  <div v-if="passengers.length">
    <passenger v-for="passenger in passengers" :key="passenger.slug" :passenger="passenger" />
  </div>
  <p v-else class="empty" data-testid="no-passengers">
    {{ t('flights.show.authorized.loads.noPassengers') }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Passenger from './passenger.vue'
import type { Flight, Load } from '@/types'
import { isPassenger } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  flight: Flight
}>()

const passengers = computed<Load[]>(
  () => props.flight.loads?.filter((load) => isPassenger(load)) ?? []
)
</script>
