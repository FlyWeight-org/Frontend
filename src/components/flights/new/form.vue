<template>
  <form method="post" :action="URL" @submit.prevent="submitHandler">
    <field
      v-model="flight.date"
      type="date"
      object="flight"
      field="date"
      :min-date="new Date()"
      :errors="errors"
      :label="t('flight.date')"
      required
      data-testid="flight-date"
    />

    <field
      v-model="flight.description"
      type="textarea"
      object="flight"
      field="description"
      :errors="errors"
      :label="t('flight.description')"
      data-testid="flight-description"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.new.button')"
        :class="{ processing: isProcessing }"
        data-testid="flight-submit"
      />
    </fieldset>
  </form>

  <p v-if="error" class="error" data-testid="flight-error">
    {{ error }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config'
import Field from '@/components/field.vue'
import type { EditableFlight, Flight } from '@/types'
import requireAuth from '@/composables/requireAuth'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useFlightsStore } from '@/stores/modules/flights'

const { t } = useI18n()
const router = useRouter()
const flightsStore = useFlightsStore()

requireAuth()

const flight = reactive<EditableFlight>({
  date: undefined,
  description: ''
})
const URL = `${config.APIURL}/account/flights.json`
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Flight>(
  async () => flightsStore.createFlight(flight),

  async (flight) => {
    await router.push({
      name: 'flightsShow',
      params: { flightID: flight.UUID }
    })
  }
)
</script>
