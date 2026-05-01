import { onMounted } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import config from '@/config'

type PresenceOptions = { mode: 'once' } | { mode: 'continuous'; intervalMs?: number }

const DEFAULT_INTERVAL_MS = 60_000

// Pings GET /presence so the backend (Fly machine + Postgres + Redis) is
// already warm when the user submits the form. Fire-and-forget; failures
// are swallowed by design — this is opportunistic warming, not a critical
// request, and we never want the warm-up to surface as an error.
//
// `mode: 'once'` pings once on mount; `mode: 'continuous'` also keeps
// pinging on an interval (default 60s) and stops automatically when the
// component unmounts.
export function usePresence(options: PresenceOptions): void {
  // Swallow errors with a no-op .catch — warm-up is opportunistic, not
  // critical, and we never want it to surface as a console/Sentry error.
  const ping = (): void => {
    fetch(`${config.APIURL}/presence`, { method: 'GET', credentials: 'omit' }).catch(
      () => undefined,
    )
  }

  onMounted(ping)

  if (options.mode === 'continuous') {
    useIntervalFn(ping, options.intervalMs ?? DEFAULT_INTERVAL_MS)
  }
}
