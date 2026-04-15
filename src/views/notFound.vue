<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="not-found">
    <div class="not-found-content">
      <h1 class="gradient-text">404</h1>
      <p class="message">{{ t('notFound.message') }}</p>
      <router-link to="/" class="home-link">{{ t('notFound.goHome') }}</router-link>
    </div>
  </main>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}

.not-found-content {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -2px;
}

.message {
  margin-bottom: 24px;
  font-size: 16px;
  color: var(--color-text-secondary);
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 8px;
}
</style>
