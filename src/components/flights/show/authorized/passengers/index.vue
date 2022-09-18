<template>
  <div v-if="passengers.length">
    <passenger
      v-for="passenger in passengers"
      :passenger="passenger"
      :key="passenger.slug"
    />
  </div>
  <p class="empty" data-cy="no-passengers" v-else>
    {{ t("flights.show.authorized.loads.noPassengers") }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import Passenger from "./passenger.vue";
import type { Flight, Load } from "@/types";
import { isPassenger } from "@/types";

const { t } = useI18n();

const props = defineProps<{
  flight: Flight;
}>();

const passengers = computed<Load[]>(
  () => props.flight.loads?.filter((load) => isPassenger(load)) ?? []
);
</script>
