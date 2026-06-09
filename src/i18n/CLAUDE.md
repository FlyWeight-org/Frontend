# Localization — strings database

This app is localized with `vue-i18n`. Supported locales: `en` (base locale),
`en-GB`, `en-CA`, `en-AU`, `de-DE`, `fr-FR`.

Whenever you add or change a user-facing string, localize it in every locale —
never ship hard-coded English.

- The English variants (`en-GB`, `en-CA`, `en-AU`) can be minimal. Add an
  override only for a string that genuinely differs in spelling/phrasing for
  that dialect.
- Message catalogs are split by weight: the English catalogs (`en` plus the
  near-empty `en-*` deltas) are bundled eagerly via `messages.ts`; the
  substantial `de-DE` and `fr-FR` catalogs are code-split and lazy-loaded by
  the loader map in `index.ts`. The aggregated `numberFormats.ts` /
  `dateTimeFormats.ts` are tiny and stay eager for every locale.
- Locale selection lives in `locales.ts` (`detectLocale`, `SUPPORTED_LOCALES`)
  and the async `setLocale` / `applyLocale` in `index.ts` — they load the
  catalog chunk _before_ flipping the locale, so switching never flashes
  English. `main.ts` awaits `initLocale()` before mounting for the same
  reason. The active locale drives `<html lang>` and is sent to the backend in
  the `X-Locale` header (fetch cannot set `Accept-Language`).
- Adding a new regional locale: extend `SUPPORTED_LOCALES` and add per-locale
  `messages.ts`, `numberFormats.ts`, and `dateTimeFormats.ts`; register the
  messages either eagerly in `messages.ts` (English-variant deltas) or in the
  `index.ts` loader map (full catalogs). A format map must be registered under
  every locale key, or `vue-i18n` decomposes the tag to its base language and
  formatting silently falls back (e.g. `en-CA` → `en`).

## Translation quality

- Keep aviation/technical jargon in English unless there is a widely-used
  native equivalent — don't over-reach for a translation. When unsure, search
  forums/blogs in the target locale to see whether and how the term is translated
  in real-world usage.
- For translations much longer than the English (German nav/buttons especially),
  check the rendered page for layout/overflow. Run `pnpm dev` and screenshot if
  needed.
- French weight term is split by audience: passenger-facing strings use
  **« poids »**, pilot-facing/technical strings use **« masse »**.

## Third-party components

Any third-party UI component must receive the active locale so it doesn't leak
English.
