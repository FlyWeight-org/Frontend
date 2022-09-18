<template>
  <main data-cy="flight-finished">
    <div class="empty error" v-if="!flightStore.flight">
      {{ t("error.notFound") }}
    </div>
    <div class="empty" v-else-if="flightStore.flightLoading">
      {{ t("messages.loading") }}
    </div>
    <div v-else>
      <h1>
        <span>{{ t("flights.finished.title", { name: passengerName }) }}</span>
      </h1>
      <p>{{ t("flights.finished.body", { name: pilotName }) }}</p>
      <p>
        <i18n-t keypath="flights.finished.note" tag="small">
          <router-link
            :to="{ name: 'flightsShow', params: { id: flight?.UUID } }"
          >
            {{ t("flights.finished.formLink") }}
          </router-link>
        </i18n-t>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useFlightStore } from "@/stores/modules/flight";
import { computed } from "vue";

const { t } = useI18n();
const route = useRoute();
const flightStore = useFlightStore();

const passengerName = computed(() => route.params.loadName);
const flight = computed(() => flightStore.flight);
const pilotName = computed(() => flight.value?.pilot.name);
</script>
