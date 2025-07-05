<template>
  <div class="passenger-list-item" data-testid="passenger-list-item">
    <input
      type="checkbox"
      :checked="!passenger.disabled"
      data-testid="passenger-enabled"
      @change="toggleEnabled($event)"
    />

    <div class="name" data-testid="passenger-name">
      {{ passenger.name }}
    </div>
    <div class="weight" data-testid="passenger-weight">
      <img :src="personImageURL" alt="Person" />
      {{ n(passenger.weight, 'pounds') }}
    </div>
    <div v-if="passenger.bagsWeight" class="weight" data-testid="passenger-bags-weight">
      <img :src="luggageImageURL" alt="Bags" />
      {{ n(passenger.bagsWeight, 'pounds') }}
    </div>

    <div class="delete">
      <a href="#" data-testid="passenger-delete" @click.prevent="deleteClicked">&times;</a>
    </div>
  </div>
  <p v-if="deleteError" class="error" data-testid="passenger-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import type { Load } from '@/types'
import personImageURL from '@/images/person.svg'
import luggageImageURL from '@/images/luggage.svg'
import { errorToString, notifyBugsnag } from '@/utils/errors'
import { useFlightStore } from '@/stores/modules/flight'

const { n } = useI18n()
const flightStore = useFlightStore()

const props = defineProps<{
  passenger: Load
}>()

const deleteError = ref<string | null>(null)

async function deleteClicked() {
  try {
    await flightStore.removeLoad(props.passenger.slug)
  } catch (err) {
    notifyBugsnag(err)
    deleteError.value = errorToString(err)
  }
}

async function toggleEnabled(event: Event) {
  const target = event.target as HTMLInputElement
  await flightStore.toggleEnabled(props.passenger.slug, target.checked)
}
</script>

<style scoped lang="scss">
@use '@/styles/colors';
@use '@/styles/vars';

.passenger-list-item {
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

  .icon {
    img {
      width: 16px;
      height: 16px;
    }
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
