<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AccountForm from '@/components/account/edit/form.vue'

const { t } = useI18n()
</script>

<template>
  <main>
    <h1>{{ t('account.edit.title') }}</h1>
    <div class="card form-card">
      <account-form />
    </div>
  </main>
</template>

<style scoped lang="scss">
.form-card {
  padding: 20px;
}
</style>
