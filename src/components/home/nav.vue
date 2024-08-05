<template>
  <div class="tabs">
    <ul role="tablist">
      <li :class="{ active: isLogin }" role="tab">
        <router-link to="/login">
          {{ t('home.nav.logIn') }}
        </router-link>
      </li>
      <li :class="{ active: isSignup }" role="tab" data-testid="signup-tab">
        <router-link to="/signup">
          {{ t('home.nav.signUp') }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const isLogin = computed(() => route.name === 'logIn')
const isSignup = computed(() => route.name === 'signUp')
</script>
