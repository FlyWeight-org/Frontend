/** The locales the app ships translations (or locale-specific formats) for. */
export const SUPPORTED_LOCALES = ['en', 'en-GB', 'en-CA', 'en-AU', 'de-DE', 'fr-FR'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/** The locale used when nothing else matches, and the source for fallback translations. */
export const DEFAULT_LOCALE: SupportedLocale = 'en'

const localStorageKey = 'locale'

/**
 * Resolves an arbitrary BCP-47 language tag to a {@link SupportedLocale}. An exact match wins;
 * otherwise the first supported locale sharing the base language (e.g. `de` → `de-DE`) is used.
 *
 * @param tag A BCP-47 language tag such as `en-US`, `de`, or `fr-CA`.
 * @returns The best-matching supported locale, or `null` if none matches.
 */
export function matchLocale(tag: string): SupportedLocale | null {
  const normalized = tag.toLowerCase()
  const exact = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized)
  if (exact) return exact

  const base = normalized.split('-')[0]
  return SUPPORTED_LOCALES.find((locale) => locale.toLowerCase().split('-')[0] === base) ?? null
}

/**
 * Determines the locale from (in order) a stored user preference, the browser's preferred
 * languages, an optional fallback locale, and finally {@link DEFAULT_LOCALE}.
 *
 * @param fallback A locale to prefer over {@link DEFAULT_LOCALE} when nothing else matches.
 *   Used by the public passenger flow to fall back to the flight pilot's locale — a better
 *   guess for that pilot's passengers than the app default.
 */
export function detectLocale(fallback?: string | null): SupportedLocale {
  const stored = localStorage.getItem(localStorageKey)
  if (stored) {
    const matched = matchLocale(stored)
    if (matched) return matched
  }

  for (const tag of navigator.languages) {
    const matched = matchLocale(tag)
    if (matched) return matched
  }

  if (fallback) {
    const matched = matchLocale(fallback)
    if (matched) return matched
  }

  return DEFAULT_LOCALE
}

/** Persists the user's locale preference to local storage. */
export function storeLocale(locale: SupportedLocale): void {
  localStorage.setItem(localStorageKey, locale)
}

/**
 * The selectable language options for a locale picker, each labelled with its own
 * autonym (e.g. `Deutsch (Deutschland)`, `Français (France)`). `Intl.DisplayNames`
 * returns lowercase autonyms for some languages, so the first character is uppercased
 * with the locale's own casing rules.
 */
export function localeOptions(): { value: SupportedLocale; label: string }[] {
  return SUPPORTED_LOCALES.map((locale) => {
    const autonym =
      new Intl.DisplayNames([locale], { type: 'language', languageDisplay: 'standard' }).of(
        locale,
      ) ?? locale
    return {
      value: locale,
      label: autonym.charAt(0).toLocaleUpperCase(locale) + autonym.slice(1),
    }
  })
}
