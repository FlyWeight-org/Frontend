<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AccountForm from '@/components/account/edit/form.vue'
import AccountPasskeys from '@/components/account/edit/passkeys.vue'

const { t } = useI18n()
</script>

<template>
  <main id="main-content">
    <h1>{{ t('account.edit.title') }}</h1>
    <div class="card form-card">
      <account-form />
    </div>
    <div class="card form-card">
      <account-passkeys />
    </div>
  </main>
</template>

<style scoped lang="scss">
.form-card {
  padding: 20px;

  & + .form-card {
    margin-top: 20px;
  }
}
</style>
