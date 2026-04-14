<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FlightsIndex from '../flights/index.vue'
import Welcome from '../../components/home/welcome.vue'
import { useAuthStore } from '@/stores/modules/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.loggedIn) await router.replace({ name: 'flightsList' })
})
</script>

<template>
  <FlightsIndex v-if="authStore.loggedIn" />
  <Welcome v-else />
</template>
