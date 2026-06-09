import type { IntlDateTimeFormats } from 'vue-i18n'
import en from '@/i18n/en/dateTimeFormats'
import enGB from '@/i18n/en-GB/dateTimeFormats'
import enCA from '@/i18n/en-CA/dateTimeFormats'
import enAU from '@/i18n/en-AU/dateTimeFormats'
import deDE from '@/i18n/de-DE/dateTimeFormats'
import frFR from '@/i18n/fr-FR/dateTimeFormats'

const dateTimeFormats: IntlDateTimeFormats = {
  en,
  'en-GB': enGB,
  'en-CA': enCA,
  'en-AU': enAU,
  'de-DE': deDE,
  'fr-FR': frFR,
}
export default dateTimeFormats
