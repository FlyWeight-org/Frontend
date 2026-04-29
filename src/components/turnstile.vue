<script setup lang="ts">
import VueTurnstile from 'vue-turnstile'
import { ref } from 'vue'

defineProps<{ siteKey: string }>()
const token = defineModel<string>({ default: '' })
const widget = ref<InstanceType<typeof VueTurnstile> | null>(null)

defineExpose({ reset: () => widget.value?.reset() })
</script>

<template>
  <VueTurnstile ref="widget" :site-key="siteKey" v-model="token" />
</template>
