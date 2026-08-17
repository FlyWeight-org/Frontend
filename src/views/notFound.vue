<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main id="main-content" class="not-found">
    <div class="not-found-content">
      <h1 class="numeral gradient-text">404</h1>
      <div class="rule" />
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
  padding: 32px 16px;
}

.not-found-content {
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.numeral {
  margin: 0;
  font-size: 88px;
  letter-spacing: -3px;
}

// The brand gradient as a hairline, holding the numeral and the message apart.
.rule {
  width: 56px;
  height: 3px;
  margin: 20px auto 24px;
  background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
  border-radius: 2px;
}

.message {
  margin: 0 0 28px;
  font-size: 16px;
  color: var(--color-text-secondary);
}

.home-link {
  display: inline-block;
  padding: 11px 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 8px;
  box-shadow: var(--color-surface-shadow);

  &:hover {
    background: var(--color-surface-hover);
  }
}

@media (width >= 640px) {
  .numeral {
    font-size: 120px;
    letter-spacing: -5px;
  }

  .rule {
    width: 72px;
  }
}
</style>
