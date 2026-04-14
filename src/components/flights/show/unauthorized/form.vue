<script setup lang="ts">
import type { Flight, Load } from '@/types'
import config from '@/config'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFlightStore } from '@/stores/modules/flight'
import Field from '@/components/field.vue'
import type { EditableLoad } from '@/types'
import useFormErrorHandling from '@/composables/useFormErrorHandling'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const flightStore = useFlightStore()
const router = useRouter()

const weightUnitSymbol = computed(() => {
  const parts = new Intl.NumberFormat(locale.value, {
    style: 'unit',
    unit: 'pound',
    unitDisplay: 'short',
  }).formatToParts(0)
  return parts.find((part) => part.type === 'unit')?.value ?? 'lb'
})

const props = defineProps<{
  flight: Flight
}>()

const URL = `${config.APIURL}/flights/${props.flight.UUID}/loads.json`
const load = reactive<EditableLoad>({
  name: '',
  weight: 0,
  bagsWeight: 0,
  disabled: false,
})
const { submitHandler, errors, error, isProcessing } = useFormErrorHandling<Load>(
  () => flightStore.addUnauthorizedLoad(load),
  async (load) => {
    await router.push({
      name: 'flightsFinished',
      params: {
        flightID: props.flight.UUID,
        loadName: load.name,
      },
    })
  },
)

const step = ref(0)

watch(
  () => load.name,
  (name) => {
    if (step.value < 1 && name.trim()) step.value = 1
  },
)

watch(
  () => load.weight,
  (weight) => {
    if (step.value < 2 && weight > 0) step.value = 2
  },
)

watch(
  () => load.bagsWeight,
  () => {
    if (step.value < 3) step.value = 3
  },
)
</script>

<template>
  <form
    id="passenger-form"
    method="post"
    :action="URL"
    data-testid="passenger-unauth-form"
    @submit.prevent="submitHandler"
  >
    <fieldset>
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
    </fieldset>

    <fieldset
      v-if="step >= 1"
      class="reveal weight-field"
      :style="{ '--weight-unit': `'${weightUnitSymbol}'` }"
    >
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
    </fieldset>

    <fieldset
      v-if="step >= 2"
      class="reveal weight-field"
      :style="{ '--weight-unit': `'${weightUnitSymbol}'` }"
    >
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
    </fieldset>

    <fieldset v-if="step >= 3" class="reveal actions">
      <input
        type="submit"
        name="commit"
        :value="t('flights.show.unauthorized.loads.createButton')"
        :class="{ processing: isProcessing }"
        data-testid="passenger-submit"
      />
    </fieldset>
  </form>

  <p v-if="error" class="error" data-testid="passenger-errors">
    {{ error }}
  </p>
</template>

<style lang="scss">
@use '@/styles/animations';

.reveal {
  animation: field-reveal 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
  }
}

#passenger-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }

  fieldset.actions {
    margin-top: 8px;
  }

  label {
    display: block;

    span {
      display: block;
      margin: 0 0 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
  }

  input[type='text'],
  input[type='number'] {
    width: 100%;
    padding: 18px 20px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 700;
    color: var(--color-text-primary);
    text-align: center;
    background: rgb(255 255 255 / 4%);
    border: 1px solid rgb(192 132 252 / 25%);
    border-radius: 16px;
    backdrop-filter: blur(8px);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;

    &:focus {
      background: rgb(255 255 255 / 6%);
      border-color: var(--color-accent-pink);
      box-shadow:
        0 0 0 4px rgb(236 72 153 / 15%),
        0 8px 32px rgb(124 58 237 / 20%);
    }

    &::placeholder {
      color: var(--color-text-muted);
    }
  }

  input[type='submit'] {
    width: 100%;
    padding: 20px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(16px, 2vw, 20px);
    font-weight: 800;
    letter-spacing: 0.5px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgb(124 58 237 / 35%);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgb(236 72 153 / 45%);
    }
  }

  [data-theme='light'] & {
    input[type='text'],
    input[type='number'] {
      background: rgb(255 255 255 / 50%);
      border-color: rgb(124 58 237 / 20%);

      &:focus {
        background: rgb(255 255 255 / 75%);
        border-color: var(--color-accent-pink);
      }
    }
  }

  fieldset.weight-field {
    label {
      position: relative;
    }

    label::after {
      content: var(--weight-unit, 'lb');
      position: absolute;
      right: 24px;
      top: calc(50% + 14px);
      transform: translateY(-50%);
      pointer-events: none;
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(14px, 1.6vw, 18px);
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    input[type='number'] {
      padding-right: 64px;

      // hide native number spinners so they don't overlap the suffix
      appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
        margin: 0;
      }
    }
  }
}
</style>
