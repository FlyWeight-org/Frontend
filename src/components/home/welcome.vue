<template>
  <main>
    <h1>
      <span>{{ t("title") }}</span>
    </h1>
    <h2>{{ t("home.welcome.subtitle") }}</h2>

    <i18n-t tag="p" keypath="home.welcome.description">
      <template v-slot:title>
        <strong>{{ t("title") }}</strong>
      </template>
    </i18n-t>

    <navbar />
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Navbar from "./nav.vue";

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use "@/styles/vars";

h1 {
  font-stretch: semi-expanded;
  text-align: center;

  > span {
    @include vars.text-gradient(vars.$gradient-1);

    display: inline-block;
    margin-left: auto;
    margin-right: auto;

    font-size: 32pt;
    font-style: italic;
    font-weight: bold;
  }
}
</style>
