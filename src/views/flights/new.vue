<template>
  <main>
    <h1>{{ t("flights.new.title") }}</h1>
    <flight-form />
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import FlightForm from "@/components/flights/new/form.vue";

const { t } = useI18n();
</script>
