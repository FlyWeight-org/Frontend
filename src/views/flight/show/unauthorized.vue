<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { Lock } from 'lucide-vue-next'
import type { Flight } from '@/types'
import PassengerForm from '@/components/flights/show/unauthorized/form.vue'

const { t, d } = useI18n()

const props = defineProps<{
  flight: Flight
}>()

const dateString = computed(() => d(props.flight.date.toJSDate(), 'medium'))
</script>

<template>
  <div class="passenger-entry">
    <div class="passenger-wordmark gradient-text">{{ t('title') }}</div>

    <h1 class="entry-title" data-testid="flight-unauth-title">
      {{ t('flights.show.unauthorized.title', { name: flight.pilot.name, date: dateString }) }}
    </h1>

    <p v-if="flight.description" class="flight-description">
      &ldquo;{{ flight.description }}&rdquo;
    </p>

    <p class="entry-intro">{{ t('flights.show.unauthorized.explanation') }}</p>

    <div class="entry-form">
      <passenger-form :flight="flight" />
    </div>

    <p class="privacy-note">
      <Lock class="privacy-icon" :size="14" :stroke-width="2.5" aria-hidden="true" />
      {{ t('flights.show.unauthorized.privacy') }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.passenger-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 24px 16px 48px;
  text-align: center;
}

.passenger-wordmark {
  margin-bottom: 32px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.entry-title {
  margin: 0 0 16px;
  max-width: 18ch;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(28px, 6vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1px;
  color: var(--color-text-primary);
}

.flight-description {
  margin: 0 0 16px;
  max-width: 32ch;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(16px, 2.2vw, 22px);
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent-pink);
}

.entry-intro {
  max-width: 44ch;
  margin: 0 0 40px;
  font-size: clamp(14px, 1.6vw, 17px);
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.entry-form {
  width: 100%;
  max-width: 520px;
}

.privacy-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
  font-size: clamp(11px, 1.2vw, 13px);
  letter-spacing: 0.3px;
  color: var(--color-text-muted);
}

.privacy-icon {
  display: inline-block;
  vertical-align: middle;
}

@media (width >= 768px) {
  .passenger-entry {
    justify-content: center;
    padding: 48px 24px;
  }

  .passenger-wordmark {
    font-size: 28px;
    margin-bottom: 56px;
  }

  .entry-form {
    max-width: 640px;
  }
}
</style>
