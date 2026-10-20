<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadConnections, revokeConnection, type Connection } from '@/services/connections'
import ConnectionPermissions from '@/components/connections/permissions.vue'

const { t, d } = useI18n()
const enabled = ref(false)
const connections = ref<Connection[]>([])
const error = ref<'connections.loadError' | 'connections.revokeError' | null>(null)
const success = ref<string | null>(null)
const processing = ref<number | null>(null)
const heading = useTemplateRef<HTMLHeadingElement>('heading')

onMounted(async () => {
  try {
    const result = await loadConnections()
    enabled.value = result.enabled
    connections.value = result.connections
  } catch {
    error.value = 'connections.loadError'
  }
})

function revokeButtonID(connection: Connection): string {
  return `revoke-connection-${String(connection.id)}`
}

async function focusAfterRemoval(index: number): Promise<void> {
  await nextTick()
  const next = connections.value.at(Math.min(index, connections.value.length - 1))
  const target = next ? document.getElementById(revokeButtonID(next)) : heading.value
  target?.focus()
}

async function revoke(connection: Connection): Promise<void> {
  error.value = null
  success.value = null
  if (!window.confirm(t('connections.confirmRevoke', { name: connection.name }))) return
  processing.value = connection.id
  try {
    await revokeConnection(connection.id)
  } catch {
    error.value = 'connections.revokeError'
    return
  } finally {
    processing.value = null
  }
  const index = connections.value.indexOf(connection)
  connections.value = connections.value.filter((item) => item.id !== connection.id)
  success.value = t('connections.revoked', { name: connection.name })
  await focusAfterRemoval(index)
}
</script>

<template>
  <section v-if="enabled || error" class="card connections-card">
    <h2 ref="heading" tabindex="-1">{{ t('connections.title') }}</h2>
    <p v-if="error" role="alert" class="error">{{ t(error) }}</p>
    <p role="status" class="success">{{ success }}</p>
    <p v-if="enabled && connections.length === 0">{{ t('connections.empty') }}</p>
    <ul v-else class="connections-list">
      <li v-for="connection in connections" :key="connection.id">
        <h3>{{ connection.name }}</h3>
        <p class="connection-meta">
          {{ t('connections.connectionHost', { host: connection.callback_host }) }}
          <br />
          {{ t('connections.since', { date: d(new Date(connection.created_at), 'short') }) }}
        </p>
        <ConnectionPermissions :scopes="connection.scopes" />
        <button
          :id="revokeButtonID(connection)"
          type="button"
          class="destructive"
          :class="{ processing: processing === connection.id }"
          :disabled="processing !== null"
          :aria-label="t('connections.revokeName', { name: connection.name })"
          @click="revoke(connection)"
        >
          {{ t('connections.revoke') }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.connections-card {
  margin-top: 20px;
  padding: 20px;
}

.connections-list {
  list-style: none;
  padding: 0;

  li + li {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--color-surface-border);
  }
}

.connection-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.success:empty {
  margin: 0;
}
</style>
