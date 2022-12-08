<template>
  <div id="total-weight">
    <div class="name">{{ t("flights.show.authorized.loads.totalWeight") }}</div>
    <div class="weight" data-cy="total-weight">
      {{ n(totalWeight, "pounds") }}
      <small v-if="paxCount > 0" data-cy="total-weight-breakdown">{{
        t("flights.show.authorized.loads.averageWeight", {
          pax: n(averagePaxWeight, "pounds"),
          cargo: n(totalCargoWeight, "pounds"),
        })
      }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import type { Flight } from "@/types";
import { isPassenger } from "@/types";

const { t, n } = useI18n();

const props = defineProps<{
  flight: Flight;
}>();

const loads = computed(() =>
  props.flight.loads ? props.flight.loads.filter((load) => !load.disabled) : []
);
const paxCount = computed(() =>
  loads.value.reduce((count, cur) => count + (isPassenger(cur) ? 1 : 0), 0)
);
const totalWeight = computed(() =>
  loads.value.reduce((sum, cur) => sum + cur.weight + cur.bagsWeight, 0)
);
const totalCargoWeight = computed(() =>
  loads.value.reduce((sum, cur) => sum + cur.bagsWeight, 0)
);
const averagePaxWeight = computed(
  () => loads.value.reduce((sum, cur) => sum + cur.weight, 0) / paxCount.value
);
</script>

<style scoped lang="scss">
#total-weight {
  align-items: baseline;
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 40px;

  .name {
    font-weight: 700;
    margin-right: 0.5em;
  }

  .weight {
    font-size: 14pt;
    font-weight: 200;
  }
}
</style>
