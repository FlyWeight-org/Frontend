<template>
  <div class="passenger-list-item" data-cy="passenger-list-item">
    <input
      type="checkbox"
      :checked="!passenger.disabled"
      @change="toggleEnabled($event)"
      data-cy="passenger-enabled"
    />

    <div class="name" data-cy="passenger-name">{{ passenger.name }}</div>
    <div class="weight" data-cy="passenger-weight">
      <img :src="personImageURL" alt="Person" />
      {{ n(passenger.weight, 'pounds') }}
    </div>
    <div class="weight" v-if="passenger.bagsWeight" data-cy="passenger-bags-weight">
      <img :src="luggageImageURL" alt="Bags" />
      {{ n(passenger.bagsWeight, 'pounds') }}
    </div>
    <div class="icon" data-cy="passenger-covid19-vaccination" v-if="passenger.covid19Vaccination">
      <img :src="vaccineImageURL" alt="Vaccinated" />
    </div>

    <div class="delete">
      <a href="#" @click.prevent="deleteClicked" data-cy="passenger-delete">&times;</a>
    </div>
  </div>
  <p v-if="deleteError" class="error" data-cy="passenger-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import type { Load } from '@/types'
import personImageURL from '@/images/person.svg'
import luggageImageURL from '@/images/luggage.svg'
import vaccineImageURL from '@/images/vaccine.svg'
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
