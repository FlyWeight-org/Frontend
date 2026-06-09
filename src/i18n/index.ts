import { createI18n } from 'vue-i18n'
import type { VueMessageType } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'
import messages from '@/i18n/messages'
import numberFormats from '@/i18n/numberFormats'
import dateTimeFormats from '@/i18n/dateTimeFormats'
import { DEFAULT_LOCALE, detectLocale, storeLocale, type SupportedLocale } from '@/i18n/locales'

export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  detectLocale,
  matchLocale,
  localeOptions,
  type SupportedLocale,
} from '@/i18n/locales'

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
  numberFormats,
  datetimeFormats: dateTimeFormats,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
})

export default i18n
export const { global } = i18n

type LazyLocale = Exclude<SupportedLocale, 'en' | 'en-GB' | 'en-CA' | 'en-AU'>
interface MessagesModule {
  default: LocaleMessage<VueMessageType>
}

// Explicit per-locale loaders (rather than a templated dynamic import) so the eagerly-bundled
// English catalogs aren't also pulled into dynamic chunks.
const loaders: Record<LazyLocale, () => Promise<MessagesModule>> = {
  'de-DE': () => import('@/i18n/de-DE/messages'),
  'fr-FR': () => import('@/i18n/fr-FR/messages'),
}

const loaded = new Set<LazyLocale>()

function isLazyLocale(locale: SupportedLocale): locale is LazyLocale {
  return locale in loaders
}

async function loadMessages(locale: SupportedLocale): Promise<void> {
  if (!isLazyLocale(locale) || loaded.has(locale)) return
  const { default: catalog } = await loaders[locale]()
  global.setLocaleMessage(locale, catalog)
  loaded.add(locale)
}

/**
 * Activates a locale without persisting it: lazy-loads its message catalog (so the switch never
 * flashes the fallback language), switches vue-i18n, and reflects the choice on `<html lang>`.
 */
export async function applyLocale(locale: SupportedLocale): Promise<void> {
  await loadMessages(locale)
  global.locale.value = locale
  document.documentElement.setAttribute('lang', locale)
}

/** Activates a locale and persists it as the user's explicit preference. */
export async function setLocale(locale: SupportedLocale): Promise<void> {
  await applyLocale(locale)
  storeLocale(locale)
}

/** Resolves and applies the initial locale from storage / browser preferences. */
export function initLocale(): Promise<void> {
  return applyLocale(detectLocale())
}
