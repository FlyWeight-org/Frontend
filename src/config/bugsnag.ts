import Bugsnag, { type Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import config from '@/config/index'
import BugsnagPerformance from '@bugsnag/browser-performance'

if (config.bugsnagAPIKey) {
  Bugsnag.start({
    apiKey: config.bugsnagAPIKey,
    plugins: [new BugsnagPluginVue() as Plugin],
    releaseStage: import.meta.env.MODE,
    enabledReleaseStages: ['production']
  })
  BugsnagPerformance.start(config.bugsnagAPIKey)
}

const bugsnagVue = config.bugsnagAPIKey ? Bugsnag.getPlugin('vue') : null
export default bugsnagVue
