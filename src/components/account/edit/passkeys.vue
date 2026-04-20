<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { browserSupportsWebAuthn } from '@simplewebauthn/browser'
import type { Passkey } from '@/types'
import { useAccountStore } from '@/stores/modules/account'
import { usePasskeysStore } from '@/stores/modules/passkeys'
import { errorToString } from '@/utils/errors'

const { t, locale } = useI18n()
const accountStore = useAccountStore()
const passkeysStore = usePasskeysStore()

const JUST_NOW_THRESHOLD_SEC = 5
type RelativeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

function selectUnit(seconds: number): { value: number; unit: RelativeUnit } {
  if (seconds < 60) return { value: seconds, unit: 'second' }
  if (seconds < 3600) return { value: Math.round(seconds / 60), unit: 'minute' }
  if (seconds < 86_400) return { value: Math.round(seconds / 3600), unit: 'hour' }
  if (seconds < 86_400 * 7) return { value: Math.round(seconds / 86_400), unit: 'day' }
  if (seconds < 86_400 * 30) return { value: Math.round(seconds / 86_400 / 7), unit: 'week' }
  if (seconds < 86_400 * 365) return { value: Math.round(seconds / 86_400 / 30), unit: 'month' }
  return { value: Math.round(seconds / 86_400 / 365), unit: 'year' }
}

const newLabel = ref('')
const newPassword = ref('')
const renameId = ref<string | null>(null)
const renameLabel = ref('')
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const supported = browserSupportsWebAuthn()
const passkeys = computed<Passkey[]>(() => accountStore.currentPilot?.passkeys ?? [])

function clearMessages(): void {
  error.value = null
  success.value = null
}

async function addPasskey(): Promise<void> {
  clearMessages()
  if (!newPassword.value) {
    error.value = t('account.edit.passkeys.passwordRequired')
    return
  }
  try {
    const result = await passkeysStore.register(
      newPassword.value,
      newLabel.value.trim() || undefined,
    )
    if (result.ok) {
      success.value = t('account.edit.passkeys.registered')
      newLabel.value = ''
      newPassword.value = ''
    } else {
      const errs = Object.values(result.val).flat().join(', ')
      error.value = errs || t('account.edit.passkeys.registerError')
    }
  } catch (err) {
    error.value = errorToString(err)
  }
}

function startRename(passkey: Passkey): void {
  clearMessages()
  renameId.value = passkey.id
  renameLabel.value = passkey.label ?? ''
}

async function saveRename(): Promise<void> {
  clearMessages()
  if (!renameId.value) return
  try {
    const result = await passkeysStore.rename(renameId.value, renameLabel.value.trim())
    if (result.ok) {
      success.value = t('account.edit.passkeys.renamed')
      renameId.value = null
      renameLabel.value = ''
    } else {
      error.value = t('account.edit.passkeys.renameError')
    }
  } catch (err) {
    error.value = errorToString(err)
  }
}

function cancelRename(): void {
  renameId.value = null
  renameLabel.value = ''
}

async function remove(passkey: Passkey): Promise<void> {
  clearMessages()
  if (!window.confirm(t('account.edit.passkeys.confirmRemove'))) return
  try {
    await passkeysStore.remove(passkey.id)
    success.value = t('account.edit.passkeys.removed')
  } catch (err) {
    error.value = errorToString(err)
  }
}

function formatLastUsed(passkey: Passkey): string {
  if (!passkey.lastUsedAt) return t('account.edit.passkeys.neverUsed')
  const diffSec = Math.round(Math.abs(passkey.lastUsedAt.diffNow().milliseconds) / 1000)
  if (diffSec < JUST_NOW_THRESHOLD_SEC) return t('account.edit.passkeys.justUsed')
  const { value, unit } = selectUnit(diffSec)
  const duration = new Intl.NumberFormat(locale.value, {
    style: 'unit',
    unit,
    unitDisplay: 'long',
  }).format(value)
  return t('account.edit.passkeys.lastUsed', { duration })
}
</script>

<template>
  <section class="passkeys" data-testid="passkeys-section">
    <h2>{{ t('account.edit.passkeys.title') }}</h2>

    <p v-if="!supported" class="info">
      {{ t('account.edit.passkeys.unsupported') }}
    </p>

    <template v-else>
      <p v-if="passkeys.length === 0" class="empty">
        {{ t('account.edit.passkeys.empty') }}
      </p>

      <ul v-else class="passkey-list">
        <li v-for="passkey in passkeys" :key="passkey.id" class="passkey-item">
          <template v-if="renameId === passkey.id">
            <input
              v-model="renameLabel"
              type="text"
              :placeholder="t('account.edit.passkeys.labelPlaceholder')"
              data-testid="passkey-rename-input"
              @keyup.enter="saveRename"
              @keyup.escape="cancelRename"
            />
            <button type="button" data-testid="passkey-rename-save" @click="saveRename">
              {{ t('account.edit.passkeys.save') }}
            </button>
            <button type="button" class="secondary" @click="cancelRename">
              {{ t('account.edit.passkeys.cancel') }}
            </button>
          </template>

          <template v-else>
            <div class="passkey-info">
              <span class="passkey-label" data-testid="passkey-label">
                {{ passkey.label || t('account.edit.passkeys.unnamed') }}
              </span>
              <span class="passkey-meta">
                {{ formatLastUsed(passkey) }}
              </span>
            </div>
            <div class="passkey-actions">
              <button type="button" data-testid="passkey-rename" @click="startRename(passkey)">
                {{ t('account.edit.passkeys.rename') }}
              </button>
              <button
                type="button"
                class="destructive"
                data-testid="passkey-remove"
                @click="remove(passkey)"
              >
                {{ t('account.edit.passkeys.remove') }}
              </button>
            </div>
          </template>
        </li>
      </ul>

      <div class="add-passkey">
        <input
          v-model="newLabel"
          type="text"
          :placeholder="t('account.edit.passkeys.labelPlaceholder')"
          data-testid="passkey-new-label"
          :disabled="passkeysStore.registering"
        />
        <input
          v-model="newPassword"
          type="password"
          autocomplete="current-password"
          :placeholder="t('account.edit.passkeys.passwordPlaceholder')"
          data-testid="passkey-new-password"
          :disabled="passkeysStore.registering"
        />
        <button
          type="button"
          data-testid="passkey-add"
          :disabled="passkeysStore.registering"
          :class="{ processing: passkeysStore.registering }"
          @click="addPasskey"
        >
          {{ t('account.edit.passkeys.add') }}
        </button>
      </div>
    </template>

    <p v-if="error" class="error" data-testid="passkeys-error">{{ error }}</p>
    <p v-if="success" class="success" data-testid="passkeys-success">{{ success }}</p>
  </section>
</template>

<style scoped lang="scss">
.passkeys h2 {
  margin-top: 0;
}

.passkey-list {
  padding: 0;
  margin: 0 0 16px;
  list-style: none;
}

.passkey-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-surface-border);

  &:last-child {
    border-bottom: none;
  }
}

.passkey-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.passkey-label {
  font-weight: 600;
}

.passkey-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.passkey-actions {
  display: flex;
  gap: 8px;
}

.add-passkey {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 16px;

  input {
    flex: 1;
  }
}

button.destructive {
  background: linear-gradient(135deg, #ef4444, #be123c);
}

button.secondary {
  color: var(--color-text-secondary);
}
</style>
