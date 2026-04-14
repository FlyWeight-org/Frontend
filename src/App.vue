<script setup lang="ts">
import { useAccountStore } from '@/stores/modules/account'
import { useAuthStore } from '@/stores/modules/auth'
import { onMounted } from 'vue'
import useTheme from '@/composables/useTheme'

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
  <router-view />
</template>
