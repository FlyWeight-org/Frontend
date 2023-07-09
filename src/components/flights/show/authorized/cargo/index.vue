<template>
  <div v-if="allCargo.length">
    <cargo v-for="cargo in allCargo" :cargo="cargo" :key="cargo.slug" />
  </div>
  <p class="empty" data-cy="no-cargo" v-else>
    {{ t('flights.show.authorized.loads.noCargo') }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Cargo from './cargo.vue'
import type { Flight, Load } from '@/types'
import { isCargo } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  flight: Flight
}>()

const allCargo = computed<Load[]>(() => props.flight.loads?.filter((load) => isCargo(load)) ?? [])
</script>
