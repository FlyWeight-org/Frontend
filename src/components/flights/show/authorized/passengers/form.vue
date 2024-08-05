<template>
  <form
    class="inline"
    method="post"
    :action="URL"
    data-testid="passenger-form"
    @submit.prevent="submitHandler"
  >
    <field
      v-model="load.name"
      type="text"
      object="load"
      field="name"
      :label="t('passenger.name')"
      :errors="errors"
      required
      data-testid="passenger-name"
    />

    <field
      v-model="load.weight"
      type="number"
      object="load"
      field="weight"
      :label="t('passenger.weight')"
      :errors="errors"
      required
      min="0"
      data-testid="passenger-weight"
    />

    <field
      v-model="load.bagsWeight"
      type="number"
      object="load"
      field="bags_weight"
      :label="t('passenger.bagsWeight')"
      :errors="errors"
      min="0"
      data-testid="passenger-bags-weight"
    />

    <field
      v-model="load.covid19Vaccination"
      type="checkbox"
      object="load"
      field="covid19_vaccination"
      :label="t('passenger.covid19Vaccination')"
      :errors="errors"
      data-testid="passenger-covid19-vaccination"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.show.authorized.loads.createButton')"
        :class="{ processing: isProcessing }"
        data-testid="passenger-submit"
      />
    </fieldset>
  </form>

  <p v-if="error" class="error" data-testid="passenger-error">
    {{ error }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import type { EditableLoad, Flight } from '@/types'
import Field from '@/components/field.vue'
import requireAuth from '@/composables/requireAuth'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useFlightStore } from '@/stores/modules/flight'

const { t } = useI18n()
const flightStore = useFlightStore()

requireAuth()

const props = defineProps<{
  flight: Flight
}>()

const emit = defineEmits<{ (e: 'reset'): void }>()

const URL = `/flights/${props.flight.UUID}/loads.json`
const load = reactive<EditableLoad>({
  name: '',
  weight: 0,
  bagsWeight: 0,
  covid19Vaccination: false,
  disabled: false
})
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Flight>(
  () => flightStore.addAuthorizedLoad(load),
  async () => {
    load.name = ''
    load.weight = 0
    load.bagsWeight = 0
    load.covid19Vaccination = false
    emit('reset')
  }
)
</script>

<style lang="scss">
form.inline input[type='number'] {
  max-width: 100px;
}
</style>
