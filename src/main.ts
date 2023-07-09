import bugsnagPlugin from '@/config/bugsnag'

import { createApp } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { createPinia } from 'pinia'
import { isUndefined } from 'lodash-es'

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

const app = createApp(App).use(createPinia()).use(router).use(i18n)
if (!isUndefined(bugsnagPlugin)) app.use(bugsnagPlugin)
app.component('VueDatePicker', VueDatePicker).mount('#app')
