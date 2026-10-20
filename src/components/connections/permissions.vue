<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Connection } from '@/services/connections'

defineProps<{ scopes: Connection['scopes'] }>()

const { t } = useI18n()
</script>

<template>
  <ul class="connection-permissions">
    <li>{{ t('connections.read') }}</li>
    <li v-if="scopes.includes('flights:write')">{{ t('connections.write') }}</li>
  </ul>
</template>
