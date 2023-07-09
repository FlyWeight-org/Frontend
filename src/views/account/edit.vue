<template>
  <main>
    <h1>{{ t('account.edit.title') }}</h1>
    <account-form />
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AccountForm from '@/components/account/edit/form.vue'

const { t } = useI18n()
</script>
