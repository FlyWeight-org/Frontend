<template>
  <div class="cargo-list-item" data-cy="cargo-list-item">
    <div class="name" data-cy="cargo-name">{{ cargo.name }}</div>
    <div class="weight" data-cy="cargo-weight">
      <img :src="cargoImageURL" alt="Cargo" />

      {{ n(cargo.bagsWeight, "pounds") }}
    </div>

    <div class="delete">
      <a href="#" @click.prevent="deleteClicked" data-cy="cargo-delete"
        >&times;</a
      >
    </div>
  </div>
  <p v-if="deleteError" class="error" data-cy="cargo-delete-error">
    <small>{{ deleteError }}</small>
  </p>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import type { Load } from "@/types";
import { errorToString, notifyBugsnag } from "@/utils/errors";
import cargoImageURL from "@/images/cargo.svg";
import { useFlightStore } from "@/stores/modules/flight";

const { n } = useI18n();
const flightStore = useFlightStore();

const props = defineProps<{
  cargo: Load;
}>();

const deleteError = ref<string | null>(null);

async function deleteClicked() {
  try {
    await flightStore.removeLoad(props.cargo.slug);
  } catch (err) {
    notifyBugsnag(err);
    deleteError.value = errorToString(err);
  }
}
</script>

<style scoped lang="scss">
@use "@/styles/colors";
@use "@/styles/vars";

.cargo-list-item {
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
