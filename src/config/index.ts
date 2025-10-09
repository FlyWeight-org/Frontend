import type { Config } from '@/config/type'

const config: Config = {
  sentryDSN: import.meta.env.VITE_SENTRY_DSN,
  APIURL: import.meta.env.VITE_API_URL,
  actionCableURL: import.meta.env.VITE_ACTION_CABLE_URL
}

export default config
