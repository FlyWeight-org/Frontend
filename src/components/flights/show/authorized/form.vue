<template>
  <form method="patch" :action="URL" @submit.prevent="submitHandler">
    <field
      type="date"
      v-model="flight.date"
      object="flight"
      :minDate="new Date()"
      field="date"
      :errors="errors"
      :label="t('flight.date')"
      required
      data-cy="flight-date"
    />

    <field
      type="textarea"
      v-model="flight.description"
      object="flight"
      field="description"
      :errors="errors"
      :label="t('flight.description')"
      data-cy="flight-description"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.show.authorized.edit.button')"
        :disabled="!dirty"
        :class="{ processing: isProcessing }"
        data-cy="flight-submit"
      />
    </fieldset>
  </form>

  <p class="error" v-if="error">{{ error }}</p>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash-es'
import config from '@/config'
import type { EditableFlight, Flight } from '@/types'
import requireAuth from '@/composables/requireAuth'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import Field from '@/components/field.vue'
import { useFlightStore } from '@/stores/modules/flight'

const { t } = useI18n()
const flightStore = useFlightStore()

requireAuth()

const props = defineProps<{
  flight: Flight
}>()

const flight = reactive<EditableFlight>({
  ...props.flight
})
const URL = `${config.APIURL}/pilot/flights/${props.flight.UUID}.json`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Flight>(
  async () => flightStore.updateFlight(flight),
  async () => Promise.resolve(undefined)
)

const dirty = computed<boolean>(() => !isEqual(flight, props.flight))
</script>
