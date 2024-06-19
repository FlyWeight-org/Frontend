<template>
  <form
    id="passenger-form"
    method="post"
    :action="URL"
    class="inline"
    data-cy="passenger-unauth-form"
    @submit.prevent="submitHandler"
  >
    <fieldset v-for="(fragment, i) in fragments" :key="i" :class="fieldsetClass(fragment)">
      <field
        v-if="fragment === '[name]'"
        v-model="load.name"
        type="text"
        object="load"
        field="name"
        :label="t('passenger.name')"
        :errors="errors"
        required
        data-cy="passenger-name"
      />

      <field
        v-else-if="fragment === '[weight]'"
        v-model="load.weight"
        type="number"
        object="load"
        field="weight"
        :label="t('passenger.weight')"
        :errors="errors"
        required
        min="0"
        data-cy="passenger-weight"
      />

      <field
        v-else-if="fragment === '[bags_weight]'"
        v-model="load.bagsWeight"
        type="number"
        object="load"
        field="bags_weight"
        :label="t('passenger.bagsWeight')"
        :errors="errors"
        min="0"
        data-cy="passenger-bags-weight"
      />

      <field
        v-else-if="fragment === '[covid19_vaccine]'"
        v-model="load.covid19Vaccination"
        type="checkbox"
        object="load"
        field="covid19_vaccination"
        :label="t('passenger.covid19Vaccination')"
        :errors="errors"
        data-cy="passenger-covid19-vaccination"
      />

      <input
        v-else-if="fragment === '[submit]'"
        type="submit"
        name="commit"
        :value="t('flights.show.unauthorized.loads.createButton')"
        :class="{ processing: isProcessing }"
        data-cy="passenger-submit"
      />

      <span v-else>{{ fragment }}</span>
    </fieldset>
  </form>

  <p v-if="error" class="error" data-cy="passenger-errors">
    {{ error }}
  </p>
</template>

<script setup lang="ts">
import type { Flight, Load } from '@/types'
import config from '@/config'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFlightStore } from '@/stores/modules/flight'
import Field from '@/components/field.vue'
import type { EditableLoad } from '@/types'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { isEmpty } from 'lodash-es'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const flightStore = useFlightStore()
const router = useRouter()

const props = defineProps<{
  flight: Flight
}>()

const URL = `${config.APIURL}/flights/${props.flight.UUID}/loads.json`
const load = reactive<EditableLoad>({
  name: '',
  weight: 0,
  bagsWeight: 0,
  covid19Vaccination: false,
  disabled: false
})
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Load>(
  () => flightStore.addUnauthorizedLoad(load),
  async (load) => {
    await router.push({
      name: 'flightsFinished',
      params: {
        flightID: props.flight.UUID,
        loadName: load.name
      }
    })
  }
)

const fragments = computed(() =>
  t('flights.show.unauthorized.form')
    .split('#')
    .map((s) => s.trim())
)

function fieldsetClass(fragment: string): string {
  if (fragment === '[submit]') return 'actions'
  if (isEmpty(fragment)) return 'flex-break-h'
  return ''
}
</script>

<style lang="scss">
#passenger-form {
  label:not(.checkbox-label) span {
    display: none;
  }
}
</style>
