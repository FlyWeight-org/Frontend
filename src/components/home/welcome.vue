<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Navbar from './nav.vue'

const { t } = useI18n()
</script>

<template>
  <main class="welcome">
    <div class="welcome-content">
      <h1 class="wordmark gradient-text">{{ t('title') }}</h1>
      <p class="tagline">{{ t('home.welcome.subtitle') }}</p>
      <navbar />
      <router-view />
    </div>
  </main>
</template>

<style scoped lang="scss">
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}

.welcome-content {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.wordmark {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
}

.tagline {
  margin-bottom: 32px;
  font-size: 15px;
  color: var(--color-text-secondary);
}
</style>
