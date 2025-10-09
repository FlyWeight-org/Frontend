<template>
  <div class="cargo-list-item" data-testid="cargo-list-item">
    <input
      type="checkbox"
      :checked="!cargo.disabled"
      data-testid="cargo-enabled"
      @change="toggleEnabled($event)"
    />

    <div class="name" data-testid="cargo-name">
      {{ cargo.name }}
    </div>
    <div class="weight" data-testid="cargo-weight">
      <img :src="cargoImageURL" alt="Cargo" />

      {{ n(cargo.bagsWeight, 'pounds') }}
    </div>

    <div class="delete">
      <a href="#" data-testid="cargo-delete" @click.prevent="deleteClicked">&times;</a>
    </div>
  </div>
  <p v-if="deleteError" class="error" data-testid="cargo-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import type { Load } from '@/types'
import { errorToString, notifySentry } from '@/utils/errors'
import cargoImageURL from '@/images/cargo.svg'
import { useFlightStore } from '@/stores/modules/flight'

const { n } = useI18n()
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

async function toggleEnabled(event: Event) {
  const target = event.target as HTMLInputElement
  await flightStore.toggleEnabled(props.cargo.slug, target.checked)
}
</script>

<style scoped lang="scss">
@use '@/styles/colors';
@use '@/styles/vars';

.cargo-list-item {
  @include vars.slant($padding-v: 2.5px);

  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .name {
    margin-right: 0.5em;
    font-weight: 700;
  }

  .weight {
    margin-right: 0.5em;
    font-size: 14pt;
    font-weight: 200;
  }

  img {
    margin-right: 0.1em;
  }

  .delete {
    display: none;
    flex-grow: 1;
    text-align: right;

    a {
      padding: 0;
      margin: 0;
      font-weight: 700;
      color: vars.$body-color;
      background: none;
      border: 0;

      &:active {
        transform: translate(1px, 1px);
      }
    }
  }

  &:hover {
    background: vars.$gradient-2, colors.$cultured;

    .delete {
      display: block;
    }
  }
}

p.error {
  margin: 0;
}
</style>
