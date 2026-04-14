<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'

const { t } = useI18n()

defineProps<{
  title: string
  adding: boolean
}>()

const emit = defineEmits<(e: 'addClicked') => void>()
</script>

<template>
  <div class="section-header">
    <h2>{{ title }}</h2>
    <button
      v-if="!adding"
      class="add-btn"
      data-testid="add-load"
      :aria-label="t('flights.show.authorized.loads.addAria')"
      @click="emit('addClicked')"
    >
      <Plus :size="18" :stroke-width="2.5" />
    </button>
  </div>
  <div v-if="adding" class="add-form">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  h2 {
    margin: 0;
  }
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  border-radius: 8px;
}

.add-form {
  padding: 16px;
  margin-bottom: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 12px;
}
</style>
