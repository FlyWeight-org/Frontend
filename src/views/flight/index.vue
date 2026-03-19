<script setup lang="ts">
import { onMounted } from 'vue'
import { isArray } from 'lodash-es'
import { useRoute } from 'vue-router'
import { useFlightStore } from '@/stores/modules/flight'

const route = useRoute()
const flightStore = useFlightStore()

function flightUUID(): string {
  if (isArray(route.params.flightID)) return route.params.flightID[0] ?? ''
  else return route.params.flightID
}

onMounted(() => flightStore.loadFlight(flightUUID(), true))
</script>

<template>
  <router-view />
</template>
