<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const isLogin = computed(() => route.name === 'logIn')
const isSignup = computed(() => route.name === 'signUp')
</script>

<template>
  <div class="auth-nav">
    <router-link to="/login" :class="['auth-btn', { active: isLogin }]">
      {{ t('home.nav.logIn') }}
    </router-link>
    <router-link to="/signup" :class="['auth-btn', { active: isSignup }]" data-testid="signup-tab">
      {{ t('home.nav.signUp') }}
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.auth-nav {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.auth-btn {
  padding: 12px 28px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-decoration: none;
  background: transparent;
  border: 1px solid var(--color-surface-border);
  border-radius: 12px;
  transition:
    opacity 0.15s ease,
    transform 0.1s ease,
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: var(--color-surface);
    color: var(--color-text-primary);
    -webkit-text-fill-color: initial;
  }

  &:active {
    transform: scale(0.98);
  }

  &.active {
    color: white;
    background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
    border-color: transparent;

    &:hover {
      opacity: 0.9;
      -webkit-text-fill-color: initial;
    }
  }
}
</style>
