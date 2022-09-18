<template>
  <a class="flight-list-item" :href="flightURL" data-cy="flight-list-item">
    <div class="header">
      <div class="date">{{ date }}</div>
      <div class="passengers">
        {{ t("flights.list.flight.passengers", { count: paxCount }) }}
      </div>
    </div>
    <p class="description" v-if="flight.description">
      {{ flight.description }}
    </p>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { FlightListItem } from "@/types";

const { d, t } = useI18n();
const router = useRouter();

const props = defineProps<{
  flight: FlightListItem;
}>();

const date = computed(() => d(props.flight.date.toJSDate(), "short"));
const paxCount = computed(() => props.flight.passengerCount);
const flightURL = computed(
  () =>
    router.resolve({
      name: "flightsShow",
      params: { flightID: props.flight.UUID },
    }).href
);
</script>

<style scoped lang="scss">
@use "@/styles/colors";
@use "@/styles/vars";

a.flight-list-item {
  @include vars.slant;
  border: 0;
  display: block;
  margin-bottom: 20px;
  padding: 5px;

  &:hover {
    background: vars.$gradient-2, colors.$cultured;
  }

  .header {
    align-items: baseline;
    display: flex;
    flex-flow: row wrap;

    .date {
      font-size: 16pt;
      font-weight: 700;
      margin-right: 0.5em;
    }

    .passengers {
      font-size: 12pt;
      font-weight: 200;
      margin-right: 0.5em;
    }
  }

  .description {
    font-size: 12pt;
    margin: 0;
  }
}
</style>
