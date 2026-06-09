<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="field-group">
    <p v-if="label" class="field-group-label">
      {{ label }}
    </p>
    <slot />
  </div>
</template>
