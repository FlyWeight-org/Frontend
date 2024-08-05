<template>
  <h2 data-testid="flight-unauth-title">
    {{
      t('flights.show.unauthorized.title', {
        name: flight.pilot.name,
        date: dateString
      })
    }}
  </h2>

  <div id="passenger-welcome">
    <blockquote v-if="flight.description">
      {{ flight.description }}
    </blockquote>
    <p>{{ t('flights.show.unauthorized.explanation') }}</p>
    <p>{{ t('flights.show.unauthorized.explanation2') }}</p>
  </div>

  <passenger-form :flight="flight" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Flight } from '@/types'
import { computed } from 'vue'
import PassengerForm from '@/components/flights/show/unauthorized/form.vue'

const { t, d } = useI18n()

const props = defineProps<{
  flight: Flight
}>()

const dateString = computed(() => d(props.flight.date.toJSDate(), 'short'))
</script>

<style scoped lang="scss">
#passenger-welcome {
  p,
  blockquote {
    font-size: 12pt;
  }
}
</style>
