import { createApp } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import { createSentryPiniaPlugin } from '@sentry/vue'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'

import 'normalize.css'
import './styles/archivo.scss'
import './styles/base.scss'
import './styles/datepicker.scss'
import './styles/forms.scss'
import './styles/layout.scss'
import './styles/nav.scss'
import './styles/tabs.scss'

const app = createApp(App)

const sentryDSN = import.meta.env.VITE_SENTRY_DSN
if (sentryDSN) {
  Sentry.init({
    app,
    dsn: sentryDSN,
    sendDefaultPii: true,
    integrations: [
      Sentry.vueIntegration({
        tracingOptions: {
          trackComponents: true
        }
      }),
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],
    tracesSampleRate: 1.0,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Don't report internal server errors from the API to Sentry
      // These are already being tracked on the backend
      const errorMessage = event.exception?.values?.[0]?.value
      if (
        errorMessage === 'An internal error has occurred.' ||
        errorMessage === 'Internal Server Error' ||
        errorMessage?.includes('internal error')
      ) {
        return null // Prevents this error from being sent to Sentry
      }
      return event
    }
  })
}

const pinia = createPinia()
if (sentryDSN) {
  pinia.use(createSentryPiniaPlugin())
}
app.use(pinia)
app.use(router)
app.use(i18n)

app.component('VueDatePicker', VueDatePicker).mount('#app')
