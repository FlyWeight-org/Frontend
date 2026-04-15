<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FlightForm from '@/components/flights/new/form.vue'

const { t } = useI18n()
</script>

<template>
  <main id="main-content">
    <h1>{{ t('flights.new.title') }}</h1>
    <div class="card form-card">
      <flight-form />
    </div>
  </main>
</template>

<style scoped lang="scss">
.form-card {
  padding: 20px;
}
</style>
