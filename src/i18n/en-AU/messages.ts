import type { VueMessageType } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'

// Australian English shares its wording with the base `en` locale; only date and number
// *formatting* differ (handled by Intl via the locale code). Add overrides here only for
// strings that genuinely differ in spelling or phrasing — everything else falls back to `en`.
const enAU: LocaleMessage<VueMessageType> = {}
export default enAU
