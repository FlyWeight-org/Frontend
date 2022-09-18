<template>
  <div class="passenger-list-item" data-cy="passenger-list-item">
    <div class="name" data-cy="passenger-name">{{ passenger.name }}</div>
    <div class="weight" data-cy="passenger-weight">
      <img :src="personImageURL" alt="Person" />
      {{ n(passenger.weight, "pounds") }}
    </div>
    <div
      class="weight"
      v-if="passenger.bagsWeight"
      data-cy="passenger-bags-weight"
    >
      <img :src="luggageImageURL" alt="Bags" />
      {{ n(passenger.bagsWeight, "pounds") }}
    </div>
    <div
      class="icon"
      data-cy="passenger-covid19-vaccination"
      v-if="passenger.covid19Vaccination"
    >
      <img :src="vaccineImageURL" alt="Vaccinated" />
    </div>

    <div class="delete">
      <a href="#" @click.prevent="deleteClicked" data-cy="passenger-delete"
        >&times;</a
      >
    </div>
  </div>
  <p v-if="deleteError" class="error" data-cy="passenger-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import type { Load } from "@/types";
import personImageURL from "@/images/person.svg";
import luggageImageURL from "@/images/luggage.svg";
import vaccineImageURL from "@/images/vaccine.svg";
import { errorToString, notifyBugsnag } from "@/utils/errors";
import { useFlightStore } from "@/stores/modules/flight";

const { n } = useI18n();
const flightStore = useFlightStore();

const props = defineProps<{
  passenger: Load;
}>();

const deleteError = ref<string | null>(null);

async function deleteClicked() {
  try {
    await flightStore.removeLoad(props.passenger.slug);
  } catch (err) {
    notifyBugsnag(err);
    deleteError.value = errorToString(err);
  }
}
</script>

<style scoped lang="scss">
@use "@/styles/colors";
@use "@/styles/vars";

.passenger-list-item {
  @include vars.slant($padding-v: 2.5px);
  align-items: center;
  display: flex;
  flex-flow: row nowrap;

  &:hover {
    background: vars.$gradient-2, colors.$cultured;

    .delete {
      display: block;
    }
  }

  .name {
    font-weight: 700;
    margin-right: 0.5em;
  }

  .weight {
    font-size: 14pt;
    font-weight: 200;
    margin-right: 0.5em;
  }

  .icon {
    img {
      height: 16px;
      width: 16px;
    }
  }

  img {
    margin-right: 0.1em;
  }

  .delete {
    display: none;
    flex-grow: 1;
    text-align: right;

    a {
      background: none;
      border: 0;
      color: vars.$body-color;
      font-weight: 700;
      margin: 0;
      padding: 0;

      &:active {
        transform: translate(1px, 1px);
      }
    }
  }
}

p.error {
  margin: 0;
}
</style>
