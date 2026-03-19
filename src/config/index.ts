import type { Config } from '@/config/type'

const config: Config = {
  sentryDSN: String(import.meta.env.VITE_SENTRY_DSN ?? ''),
  APIURL: String(import.meta.env.VITE_API_URL ?? ''),
  actionCableURL: String(import.meta.env.VITE_ACTION_CABLE_URL ?? ''),
}

export default config
