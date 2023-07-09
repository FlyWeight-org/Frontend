import type { Config } from '@/config/type'

const config: Config = {
  bugsnagAPIKey: import.meta.env.VITE_BUGSNAG_API_KEY,
  APIURL: import.meta.env.VITE_API_URL,
  actionCableURL: import.meta.env.VITE_ACTION_CABLE_URL
}

export default config
