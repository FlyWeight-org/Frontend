import type { IntlNumberFormats } from 'vue-i18n'
import en from '@/i18n/en/numberFormats'
import enGB from '@/i18n/en-GB/numberFormats'
import enCA from '@/i18n/en-CA/numberFormats'
import enAU from '@/i18n/en-AU/numberFormats'
import deDE from '@/i18n/de-DE/numberFormats'
import frFR from '@/i18n/fr-FR/numberFormats'

const numberFormats: IntlNumberFormats = {
  en,
  'en-GB': enGB,
  'en-CA': enCA,
  'en-AU': enAU,
  'de-DE': deDE,
  'fr-FR': frFR,
}
export default numberFormats
