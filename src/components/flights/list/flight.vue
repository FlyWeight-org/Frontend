<template>
  <a class="flight-list-item" :href="flightURL" data-testid="flight-list-item">
    <div class="header">
      <div class="date">{{ date }}</div>
      <div class="passengers">
        {{ t('flights.list.flight.passengers', { count: paxCount }) }}
      </div>
    </div>
    <p v-if="flight.description" class="description">
      {{ flight.description }}
    </p>
  </a>
</template>

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
      params: { flightID: props.flight.UUID }
    }).href
)
</script>

<style scoped lang="scss">
@use '@/styles/colors';
@use '@/styles/vars';

a.flight-list-item {
  @include vars.slant;

  display: block;
  padding: 5px;
  margin-bottom: 20px;
  border: 0;

  &:hover {
    background: vars.$gradient-2, colors.$cultured;
  }

  .header {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;

    .date {
      margin-right: 0.5em;
      font-size: 16pt;
      font-weight: 700;
    }

    .passengers {
      margin-right: 0.5em;
      font-size: 12pt;
      font-weight: 200;
    }
  }

  .description {
    margin: 0;
    font-size: 12pt;
  }
}
</style>
