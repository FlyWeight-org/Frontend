<template>
  <form
    class="inline"
    method="post"
    :action="URL"
    data-testid="cargo-form"
    @submit.prevent="submitHandler"
  >
    <field
      v-model="load.name"
      type="text"
      object="load"
      field="name"
      :label="t('cargo.name')"
      :errors="errors"
      required
      data-testid="cargo-name"
    />

    <field
      v-model="load.bagsWeight"
      type="number"
      object="load"
      field="bags_weight"
      :label="t('cargo.bagsWeight')"
      :errors="errors"
      min="0"
      data-testid="cargo-weight"
    />

    <fieldset class="actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.show.authorized.loads.createButton')"
        :class="{ processing: isProcessing }"
        data-testid="cargo-submit"
      />
    </fieldset>

    <p v-if="error" class="error">
      {{ error }}
    </p>
  </form>
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
  disabled: false
})
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Flight>(
  () => flightStore.addAuthorizedLoad(load),
  async () => {
    load.name = ''
    load.bagsWeight = 0
    emit('reset')
  }
)
</script>
