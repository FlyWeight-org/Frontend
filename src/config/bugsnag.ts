import Bugsnag, { type Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import config from '@/config/index'
import BugsnagPerformance from '@bugsnag/browser-performance'

if (config.bugsnagAPIKey) {
  Bugsnag.start({
    apiKey: config.bugsnagAPIKey,
    plugins: [new BugsnagPluginVue() as Plugin],
    releaseStage: import.meta.env.MODE,
    enabledReleaseStages: ['production'],
    onError: (event) => {
      // Don't report internal server errors from the API to BugSnag
      // These are already being tracked on the backend
      const errorMessage = event.errors[0]?.errorMessage
      if (errorMessage === 'An internal error has occurred.' ||
          errorMessage === 'Internal Server Error' ||
          errorMessage?.includes('internal error')) {
        return false // Prevents this error from being sent to BugSnag
      }
      return true
    }
  })
  BugsnagPerformance.start(config.bugsnagAPIKey)
}

const bugsnagVue = config.bugsnagAPIKey ? Bugsnag.getPlugin('vue') : null
export default bugsnagVue
