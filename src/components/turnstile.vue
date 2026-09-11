<script setup lang="ts">
import VueTurnstile from 'vue-turnstile'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'

defineProps<{ siteKey: string }>()
const token = defineModel<string>({ default: '' })
const widget = ref<InstanceType<typeof VueTurnstile> | null>(null)

const { locale } = useI18n()
// Cloudflare Turnstile expects a base language code (e.g. `de`, `fr`, `en`).
const language = computed(() => locale.value.split('-')[0])

// `vue-turnstile` injects Cloudflare's script — and the request chain behind it — as soon as it
// mounts, regardless of `renderOnMount`. Holding the widget back until the visitor touches the
// form keeps that chain off the critical path. The load event is a backstop: the submit button
// stays disabled until a token arrives, so a visitor whose credentials are autofilled — and who
// therefore never touches the form — must still get a widget.
const ready = ref(document.readyState === 'complete')
const mountWidget = () => (ready.value = true)
useEventListener(document, ['focusin', 'pointerdown', 'keydown'], mountWidget, { once: true })
useEventListener(window, 'load', mountWidget, { once: true })

defineExpose({ reset: () => widget.value?.reset() })
</script>

<template>
  <div class="turnstile-slot">
    <VueTurnstile
      v-if="ready"
      ref="widget"
      :site-key="siteKey"
      v-model="token"
      :language="language"
    />
  </div>
</template>

<style scoped lang="scss">
.turnstile-slot {
  // Reserves the widget's "normal" render size up front, so mounting it later doesn't push the
  // surrounding card around.
  min-height: 65px;
}
</style>
