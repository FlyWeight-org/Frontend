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
  cargo: Load
}>()

const deleteError = ref<string | null>(null)

async function deleteClicked() {
  try {
    await flightStore.removeLoad(props.cargo.slug)
  } catch (err) {
    notifySentry(err)
    deleteError.value = errorToString(err)
  }
}

function toggleEnabled(event: Event) {
  const target = event.target as HTMLInputElement
  flightStore.toggleEnabled(props.cargo.slug, target.checked)
}
</script>

<template>
  <div class="load-row" :class="{ disabled: cargo.disabled }" data-testid="cargo-list-item">
    <input
      type="checkbox"
      :checked="!cargo.disabled"
      data-testid="cargo-enabled"
      @change="toggleEnabled($event)"
    />
    <div class="load-info">
      <span class="load-name" data-testid="cargo-name">{{ cargo.name }}</span>
    </div>
    <div class="load-weight" data-testid="cargo-weight">
      {{ n(cargo.bagsWeight, 'pounds') }}
    </div>
    <button
      class="load-delete"
      data-testid="cargo-delete"
      :aria-label="t('flights.show.authorized.loads.removeAria')"
      @click="deleteClicked"
    >
      <X :size="16" :stroke-width="2.5" />
    </button>
  </div>
  <p v-if="deleteError" class="error" data-testid="cargo-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<style scoped lang="scss">
@use '@/styles/load-row';

@include load-row.load-row;
</style>
