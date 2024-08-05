<template>
  <nav v-if="authStore.loggedIn">
    <ul role="menubar">
      <li>
        <h1>
          <span>{{ t('title') }}</span>
        </h1>
      </li>
      <li role="menuitem">
        <router-link to="/flights">
          {{ t('flights.nav.myFlights') }}
        </router-link>
      </li>
      <li role="menuitem">
        <router-link to="/flights/new">
          {{ t('flights.nav.addFlight') }}
        </router-link>
      </li>
      <li role="none" class="spacer">&nbsp;</li>
      <li role="menuitem" class="active">
        <router-link to="/account">
          {{ t('account.nav.myAccount') }}
        </router-link>
      </li>
      <li>
        <a href="/logout.json" data-testid="nav-logout" @click.prevent="logoutClicked">{{
          t('flights.nav.logout')
        }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

async function logoutClicked() {
  await authStore.logOut()
  await router.push({ name: 'logIn' })
}
</script>
