<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Flight } from '@/types'
import EditForm from '@/components/flights/show/authorized/form.vue'
import { errorToString, notifySentry } from '@/utils/errors'
import requireAuth from '@/composables/requireAuth'
import Manifest from '@/components/flights/show/authorized/manifest.vue'
import { useFlightStore } from '@/stores/modules/flight'

const { t, d } = useI18n()
const router = useRouter()
const flightStore = useFlightStore()

requireAuth()

const props = defineProps<{
  flight: Flight
}>()

const title = computed(() =>
  t('flights.show.authorized.title', {
    date: d(props.flight.date.toJSDate(), 'medium'),
  }),
)

const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

async function onDelete() {
  isDeleting.value = true
  try {
    await flightStore.deleteFlight(props.flight)
    await router.push({ name: 'flightsList' })
  } catch (error) {
    notifySentry(error)
    deleteError.value = errorToString(error)
  }
  isDeleting.value = false
}
</script>

<template>
  <div class="flight-detail">
    <div class="flight-header">
      <h1>{{ flight.description || title }}</h1>
      <p class="flight-date">{{ d(flight.date.toJSDate(), 'medium') }}</p>
    </div>

    <div class="share-row">
      <span class="share-label">{{ t('flights.show.authorized.share') }}</span>
    </div>

    <manifest :flight="flight" />

    <details class="edit-section">
      <summary>{{ t('flights.show.authorized.header.edit') }}</summary>
      <edit-form :flight="flight" />

      <p
        v-if="deleteError"
        class="error delete-error"
        :class="{ disabled: isDeleting }"
        :aria-disabled="isDeleting"
      >
        {{ deleteError }}
      </p>
      <a v-else class="danger" href="#" data-testid="delete-flight" @click.prevent="onDelete">
        {{ t('flights.show.authorized.delete') }}
      </a>
    </details>
  </div>
</template>

<style scoped lang="scss">
.flight-header {
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }

  .flight-date {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--color-text-secondary);
  }
}

.share-row {
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px dashed var(--color-surface-border);
  border-radius: 12px;
}

.edit-section {
  margin-top: 32px;
  padding-bottom: 100px;

  summary {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text-secondary);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.delete-error {
  font-size: 13px;
}

a.danger {
  font-size: 13px;
}
</style>
