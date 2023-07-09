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
  title: string
  adding: boolean
}>()

const emit = defineEmits<{ (e: 'addClicked'): void }>()
</script>

<style scoped lang="scss">
@use '@/styles/colors';
@use '@/styles/vars';

div.header {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 10px;
  margin-top: 4px;
  border-top: 1px solid gray;

  h3 {
    padding: 0;
    margin: 0 10px 0 0;
    font-size: 80%;
    font-weight: bold;
  }
}

a {
  display: block;
  padding: 4px;
  font-size: 50%;
  font-weight: bold;
  color: vars.$background-color;
  background-color: colors.$resolution-blue;
  border: 0;
  border-radius: 40px;
}
</style>
