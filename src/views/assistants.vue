<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, ChevronDown, Copy } from '@lucide/vue'
import { useAuthStore } from '@/stores/modules/auth'
import Navbar from '@/components/flights/nav.vue'
import InstructionText from '@/components/assistants/instructionText.vue'
import config from '@/config'

const { t } = useI18n()
const auth = useAuthStore()
const serverURL = `${config.APIURL}/mcp`
const copiedText = ref<string | null>(null)

/** A platform's translation key and the terminal command each step runs, by step number. */
interface Platform {
  key: string
  commands: Partial<Record<number, string>>
}

const platforms: Platform[] = [
  { key: 'claude', commands: {} },
  { key: 'chatgpt', commands: {} },
  { key: 'claudeCode', commands: { 1: `claude mcp add --transport http flyweight ${serverURL}` } },
  {
    key: 'codex',
    commands: { 1: `codex mcp add flyweight --url ${serverURL}`, 2: 'codex mcp login flyweight' },
  },
]

async function copy(text: string) {
  await navigator.clipboard.writeText(text)
  copiedText.value = text
}
</script>

<template>
  <Navbar v-if="auth.loggedIn" />
  <main id="main-content">
    <h1>{{ t('assistants.title') }}</h1>
    <p>{{ t('assistants.intro') }}</p>

    <div class="card server-url">
      <label for="server-url">{{ t('assistants.serverURL') }}</label>
      <div class="server-url-row">
        <input id="server-url" type="text" :value="serverURL" readonly />
        <button type="button" @click="copy(serverURL)">{{ t('assistants.copy') }}</button>
      </div>
      <p role="status" class="copied">
        {{ copiedText === serverURL ? t('assistants.copied') : '' }}
      </p>
    </div>

    <details v-for="platform in platforms" :key="platform.key" class="card platform">
      <summary>
        <h2>{{ t(`assistants.${platform.key}.title`) }}</h2>
        <span class="platform-kind">{{ t(`assistants.${platform.key}.kind`) }}</span>
        <ChevronDown class="chevron" :size="20" aria-hidden="true" />
      </summary>
      <div class="platform-body">
        <ol>
          <li v-for="step in 3" :key="step">
            <InstructionText :text="t(`assistants.${platform.key}.step${step}`)" />
            <div v-if="platform.commands[step]" class="command">
              <pre><code>{{ platform.commands[step] }}</code></pre>
              <button
                type="button"
                class="copy-command"
                :aria-label="
                  copiedText === platform.commands[step]
                    ? t('assistants.copiedCommand')
                    : t('assistants.copyCommand')
                "
                @click="copy(platform.commands[step])"
              >
                <Check
                  v-if="copiedText === platform.commands[step]"
                  :size="16"
                  aria-hidden="true"
                />
                <Copy v-else :size="16" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ol>
      </div>
    </details>

    <p class="revoke"><InstructionText :text="t('assistants.revoke')" /></p>
    <p class="privacy">{{ t('assistants.privacy') }}</p>
    <router-link v-if="!auth.loggedIn" to="/">{{ t('assistants.home') }}</router-link>
  </main>
</template>

<style scoped lang="scss">
.card {
  margin-bottom: 16px;
}

.server-url {
  padding: 20px;

  label {
    font-weight: 700;
  }
}

.server-url-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;

  input {
    flex: 1;
    min-width: 0;
  }
}

.copied {
  min-height: 1.6em;
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--color-success);
}

.platform {
  summary {
    display: flex;
    gap: 10px;
    align-items: baseline;
    padding: 16px 20px;
    cursor: pointer;
    list-style: none;
    border-radius: 16px;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      background: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-input-focus);
      outline-offset: 2px;
    }
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: var(--color-text-primary);
    text-transform: none;
    letter-spacing: -0.2px;
  }
}

.platform-kind {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.chevron {
  align-self: center;
  margin-left: auto;
  color: var(--color-text-secondary);
  transition: transform 0.15s ease;

  .platform[open] & {
    transform: rotate(180deg);
  }
}

.platform-body {
  padding: 0 20px 20px;

  ol {
    padding-left: 20px;
    margin: 0;
  }

  li + li {
    margin-top: 8px;
  }
}

.command {
  position: relative;
  margin-top: 8px;
}

.copy-command {
  position: absolute;
  inset-block: 0;
  right: 6px;
  height: fit-content;
  padding: 6px;
  margin-block: auto;
  color: var(--color-text-secondary);
  background: var(--color-surface-raised);
  border: none;
  border-radius: 8px;

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }
}

pre {
  padding: 10px 44px 10px 12px;
  margin: 0;
  font-size: 13px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 10px;
}

.revoke {
  margin-top: 24px;
}

.privacy {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
