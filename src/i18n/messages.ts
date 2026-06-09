import type { LocaleMessage } from '@intlify/core-base'
import type { VueMessageType } from 'vue-i18n'
import en from '@/i18n/en/messages'
import enGB from '@/i18n/en-GB/messages'
import enCA from '@/i18n/en-CA/messages'
import enAU from '@/i18n/en-AU/messages'

// Only the English catalogs are bundled eagerly: `en` is the fallback and the `en-*` variants
// are tiny delta objects. The substantial de-DE and fr-FR catalogs are code-split and loaded
// on demand by `loadMessages` in `index.ts`.
const messages: Record<string, LocaleMessage<VueMessageType>> = {
  en,
  'en-GB': enGB,
  'en-CA': enCA,
  'en-AU': enAU,
}
export default messages
