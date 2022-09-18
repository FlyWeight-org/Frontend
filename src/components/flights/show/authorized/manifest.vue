<template>
  <div class="manifest">
    <div class="passenger-manifest" data-cy="passenger-manifest">
      <load-header
        :title="t('flights.show.authorized.header.passengers')"
        :adding="addingPassenger"
        @addClicked="addingPassenger = true"
      >
        <passenger-form :flight="flight" @reset="addingPassenger = false" />
      </load-header>
      <passengers :flight="flight" />
    </div>

    <div class="cargo-manifest" data-cy="cargo-manifest">
      <load-header
        :title="t('flights.show.authorized.header.cargo')"
        :adding="addingCargo"
        @addClicked="addingCargo = true"
      >
        <cargo-form :flight="flight" @reset="addingCargo = false" />
      </load-header>
      <cargo :flight="flight" />
    </div>

    <hr />

    <totals :flight="flight" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import Passengers from "@/components/flights/show/authorized/passengers/index.vue";
import Cargo from "@/components/flights/show/authorized/cargo/index.vue";
import Totals from "@/components/flights/show/authorized/totals.vue";
import LoadHeader from "@/components/flights/show/authorized/header.vue";
import PassengerForm from "@/components/flights/show/authorized/passengers/form.vue";
import CargoForm from "@/components/flights/show/authorized/cargo/form.vue";
import type { Flight } from "@/types";

const { t } = useI18n();

defineProps<{
  flight: Flight;
}>();

const addingPassenger = ref<boolean>(false);
const addingCargo = ref<boolean>(false);
</script>

<style scoped lang="scss">
@use "@/styles/vars";

hr {
  border: 1px solid vars.$body-color;
  margin: 5px 0;
}

.cargo-manifest {
  margin-top: 20px;
}
</style>
