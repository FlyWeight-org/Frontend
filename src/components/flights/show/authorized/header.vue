<template>
  <div v-if="adding">
    <div class="header">
      <h3>{{ title }}</h3>
    </div>
    <slot />
  </div>
  <div v-else>
    <div class="header">
      <h3>{{ title }}</h3>
      <div>
        <a href="#" @click="emit('addClicked')" data-cy="add-load">+</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  adding: boolean;
}>();

const emit = defineEmits<{ (e: "addClicked"): void }>();
</script>

<style scoped lang="scss">
@use "@/styles/colors";
@use "@/styles/vars";

div.header {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-top: 4px;
  padding-top: 4px;
  padding-bottom: 10px;
  border-top: 1px solid gray;

  h3 {
    font-weight: bold;
    font-size: 80%;
    padding: 0;
    margin: 0 10px 0 0;
  }
}

a {
  font-size: 50%;
  font-weight: bold;
  display: block;
  border: 0;
  color: vars.$background-color;
  background-color: colors.$resolution-blue;
  border-radius: 40px;
  padding: 4px;
}
</style>
