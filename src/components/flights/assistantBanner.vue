<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <router-link :to="{ name: 'assistants' }" class="assistant-banner" data-testid="assistant-banner">
    <span class="badge">{{ t('assistants.banner.badge') }}</span>
    <span>{{ t('assistants.banner.message') }}</span>
    <span class="action">{{ t('assistants.banner.action') }}</span>
  </router-link>
</template>

<style scoped lang="scss">
// The brand gradient shows through a transparent border, framing the surface fill.
.assistant-banner {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: 100%;
  padding: 8px 18px 8px 9px;
  margin: 12px auto 36px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-text-primary);
  text-align: center;
  background:
    linear-gradient(var(--color-surface-raised), var(--color-surface-raised)) padding-box,
    linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink)) border-box;
  border: 1.5px solid transparent;
  border-radius: 999px;
  transition: transform 0.1s ease;

  &:hover {
    color: var(--color-text-primary);
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid var(--color-input-focus);
    outline-offset: 3px;
  }
}

.badge {
  padding: 1px 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
  border-radius: 999px;
}

.action {
  font-weight: 700;
  color: var(--color-text-secondary);

  .assistant-banner:hover & {
    text-decoration: underline;
  }
}
</style>
