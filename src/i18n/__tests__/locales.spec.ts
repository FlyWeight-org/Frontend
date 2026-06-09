import { beforeEach, describe, expect, it } from 'vitest'
import { detectLocale, matchLocale } from '@/i18n/locales'

function setBrowserLanguages(languages: string[]) {
  Object.defineProperty(navigator, 'languages', { value: languages, configurable: true })
  Object.defineProperty(navigator, 'language', { value: languages[0] ?? '', configurable: true })
}

describe('matchLocale', () => {
  it('matches a supported locale exactly, case-insensitively', () => {
    expect(matchLocale('de-DE')).toBe('de-DE')
    expect(matchLocale('DE-de')).toBe('de-DE')
  })

  it('matches a base language to its regional locale', () => {
    expect(matchLocale('de')).toBe('de-DE')
    expect(matchLocale('fr-CA')).toBe('fr-FR')
  })

  it('collapses unsupported English variants to en', () => {
    expect(matchLocale('en-NZ')).toBe('en')
  })

  it('returns null for an unsupported language', () => {
    expect(matchLocale('es-ES')).toBeNull()
  })
})

describe('detectLocale', () => {
  beforeEach(() => {
    localStorage.clear()
    setBrowserLanguages([])
  })

  it('prefers a stored preference over browser languages', () => {
    localStorage.setItem('locale', 'fr-FR')
    setBrowserLanguages(['de-DE'])
    expect(detectLocale()).toBe('fr-FR')
  })

  it('ignores an unsupported stored value and falls back to the browser', () => {
    localStorage.setItem('locale', 'es-ES')
    setBrowserLanguages(['de-DE'])
    expect(detectLocale()).toBe('de-DE')
  })

  it('uses the first browser language that matches a supported locale', () => {
    setBrowserLanguages(['es-ES', 'de'])
    expect(detectLocale()).toBe('de-DE')
  })

  it('falls back to the provided locale when nothing else matches', () => {
    setBrowserLanguages(['es-ES'])
    expect(detectLocale('fr')).toBe('fr-FR')
  })

  it('defaults to en when no preference is supported', () => {
    setBrowserLanguages(['es-ES', 'ja-JP'])
    expect(detectLocale()).toBe('en')
  })
})
