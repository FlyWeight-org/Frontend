<template>
  <form
    class="inline"
    method="post"
    :action="URL"
    @submit.prevent="submitHandler"
    data-cy="passenger-form"
  >
    <field
      type="text"
      object="load"
      field="name"
      v-model="load.name"
      :label="t('passenger.name')"
      :errors="errors"
      required
      data-cy="passenger-name"
    />

    <field
      type="number"
      object="load"
      field="weight"
      v-model="load.weight"
      :label="t('passenger.weight')"
      :errors="errors"
      required
      min="0"
      data-cy="passenger-weight"
    />

    <field
      type="number"
      object="load"
      field="bags_weight"
      v-model="load.bagsWeight"
      :label="t('passenger.bagsWeight')"
      :errors="errors"
      min="0"
      data-cy="passenger-bags-weight"
    />

    <field
      type="checkbox"
      object="load"
      field="covid19_vaccination"
      v-model="load.covid19Vaccination"
      :label="t('passenger.covid19Vaccination')"
      :errors="errors"
      data-cy="passenger-covid19-vaccination"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.show.authorized.loads.createButton')"
        :class="{ processing: isProcessing }"
        data-cy="passenger-submit"
      />
    </fieldset>
  </form>

  <p class="error" v-if="error" data-cy="passenger-error">{{ error }}</p>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import type { EditableLoad, Flight } from "@/types";
import Field from "@/components/field.vue";
import requireAuth from "@/composables/requireAuth";
import useFormErrorHandling from "@/composables/useFormErrorHandling";
import { useFlightStore } from "@/stores/modules/flight";

const { t } = useI18n();
const flightStore = useFlightStore();

requireAuth();

const props = defineProps<{
  flight: Flight;
}>();

const emit = defineEmits<{ (e: "reset"): void }>();

const URL = `/flights/${props.flight.UUID}/loads.json`;
const load = reactive<EditableLoad>({
  name: "",
  weight: 0,
  bagsWeight: 0,
  covid19Vaccination: false,
  disabled: false,
});
const { submitHandler, errors, error, isProcessing } =
  useFormErrorHandling<Flight>(
    () => flightStore.addAuthorizedLoad(load),
    async () => {
      load.name = "";
      load.weight = 0;
      load.bagsWeight = 0;
      load.covid19Vaccination = false;
      emit("reset");
    }
  );
</script>

<style lang="scss">
form.inline input[type="number"] {
  max-width: 100px;
}
</style>
