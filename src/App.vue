<script setup lang="ts">
import { useAccountStore } from '@/stores/modules/account'
import { useAuthStore } from '@/stores/modules/auth'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useTheme from '@/composables/useTheme'

const { t } = useI18n()
const accountStore = useAccountStore()
const authStore = useAuthStore()

useTheme()

onMounted(async () => {
  authStore.initializeFromLocalStorage()
  authStore.$subscribe(() => {
    authStore.saveToLocalStorage()
  })

  await accountStore.loadAccount()
})
</script>

<template>
  <a class="skip-link" href="#main-content">{{ t('a11y.skipToContent') }}</a>
  <router-view />
</template>

<style scoped lang="scss">
// The link parks itself one of its own heights above the viewport. A percentage
// translation tracks the rendered box, so padding, border and font metrics can
// change without leaving a sliver of the link visible in the corner.
.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 8px 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-bg-mid);
  border: 1px solid var(--color-surface-border);
  border-radius: 0 0 8px;
  transform: translateY(-100%);
  transition: transform 0.15s ease;

  &:focus {
    outline: 2px solid var(--color-accent-purple);
    outline-offset: 2px;
    transform: translateY(0);
  }
}
</style>
