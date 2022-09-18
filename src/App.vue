<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAccountStore } from "@/stores/modules/account";
import { useAuthStore } from "@/stores/modules/auth";
import { onMounted } from "vue";

const accountStore = useAccountStore();
const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeFromLocalStorage();
  authStore.$subscribe(() => authStore.saveToLocalStorage());

  accountStore.loadAccount();
});
</script>
