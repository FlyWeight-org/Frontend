import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import config from '@/config/index'
import BugsnagPerformance from '@bugsnag/browser-performance'

Bugsnag.start({
  apiKey: config.bugsnagAPIKey,
  plugins: [new BugsnagPluginVue()],
  releaseStage: import.meta.env.MODE,
  enabledReleaseStages: ['production']
})
BugsnagPerformance.start(config.bugsnagAPIKey)

const bugsnagVue = Bugsnag.getPlugin('vue')
export default bugsnagVue
