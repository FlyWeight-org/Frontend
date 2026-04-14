<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { Load } from '@/types'
import { errorToString, notifySentry } from '@/utils/errors'
import { useFlightStore } from '@/stores/modules/flight'

const { n, t } = useI18n()
const flightStore = useFlightStore()

const props = defineProps<{
  passenger: Load
}>()

const deleteError = ref<string | null>(null)

async function deleteClicked() {
  try {
    await flightStore.removeLoad(props.passenger.slug)
  } catch (err) {
    notifySentry(err)
    deleteError.value = errorToString(err)
  }
}

function toggleEnabled(event: Event) {
  const target = event.target as HTMLInputElement
  flightStore.toggleEnabled(props.passenger.slug, target.checked)
}
</script>

<template>
  <div class="load-row" :class="{ disabled: passenger.disabled }" data-testid="passenger-list-item">
    <input
      type="checkbox"
      :checked="!passenger.disabled"
      data-testid="passenger-enabled"
      @change="toggleEnabled($event)"
    />
    <div class="load-info">
      <span class="load-name" data-testid="passenger-name">{{ passenger.name }}</span>
      <span v-if="passenger.bagsWeight" class="load-bags" data-testid="passenger-bags-weight">
        {{
          t('flights.show.authorized.loads.bagsWithWeight', {
            weight: n(passenger.bagsWeight, 'pounds'),
          })
        }}
      </span>
    </div>
    <div class="load-weight" data-testid="passenger-weight">
      {{ n(passenger.weight, 'pounds') }}
    </div>
    <button
      class="load-delete"
      data-testid="passenger-delete"
      :aria-label="t('flights.show.authorized.loads.removeAria')"
      @click="deleteClicked"
    >
      <X :size="16" :stroke-width="2.5" />
    </button>
  </div>
  <p v-if="deleteError" class="error" data-testid="passenger-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<style scoped lang="scss">
@use '@/styles/load-row';

@include load-row.load-row;

.load-name {
  line-height: 1.2;
}

.load-bags {
  display: block;
  font-size: 11px;
  line-height: 1.2;
  color: var(--color-text-muted);
}
</style>
