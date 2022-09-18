<template>
  <h1>{{ title }}</h1>

  <p>{{ t("flights.show.authorized.share") }}</p>
  <p>{{ t("flights.show.authorized.owner") }}</p>

  <manifest :flight="flight" />

  <h2>{{ t("flights.show.authorized.header.edit") }}</h2>
  <edit-form :flight="flight" />

  <p
    class="error"
    :class="{ disabled: isDeleting }"
    id="delete-error"
    v-if="deleteError"
    :aria-disabled="isDeleting"
  >
    {{ deleteError }}
  </p>
  <a
    class="danger"
    href="#"
    @click.prevent="onDelete"
    data-cy="delete-flight"
    v-else
    >{{ t("flights.show.authorized.delete") }}</a
  >
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Flight } from "@/types";
import EditForm from "@/components/flights/show/authorized/form.vue";
import { errorToString, notifyBugsnag } from "@/utils/errors";
import requireAuth from "@/composables/requireAuth";
import Manifest from "@/components/flights/show/authorized/manifest.vue";
import { useFlightStore } from "@/stores/modules/flight";

const { t, d } = useI18n();
const router = useRouter();
const flightStore = useFlightStore();

requireAuth();

const props = defineProps<{
  flight: Flight;
}>();

const title = computed(() =>
  t("flights.show.authorized.title", {
    date: d(props.flight.date.toJSDate(), "medium"),
  })
);

const isDeleting = ref<boolean>(false);
const deleteError = ref<string | null>(null);

async function onDelete() {
  isDeleting.value = true;
  try {
    await flightStore.deleteFlight(props.flight);
    await router.push({ name: "flightsList" });
  } catch (error) {
    notifyBugsnag(error);
    deleteError.value = errorToString(error);
  }
  isDeleting.value = false;
}
</script>

<style scoped lang="scss">
h2 {
  margin-top: 50px;
}

a.danger {
  font-size: 75%;
}

p#delete-error {
  font-size: 75%;
}
</style>
