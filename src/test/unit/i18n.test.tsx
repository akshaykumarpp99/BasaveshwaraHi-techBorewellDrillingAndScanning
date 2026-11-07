import { act, render, renderHook, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { interpolate, isLanguage, translate, LANGUAGES } from '../../i18n/translate'
import { LANGUAGE_STORAGE_KEY, LanguageProvider, detectLanguage, useLanguage, useT } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../i18n/LanguageSwitcher'
import { kn } from '../../i18n/kn'
import { knGeneral } from '../../i18n/kn.general'
import { knCompany } from '../../i18n/kn.company'

const wrapper = (initial?: 'en' | 'kn') => ({ children }: { children: React.ReactNode }) => <LanguageProvider initial={initial}>{children}</LanguageProvider>

describe('translate helpers', () => {
  it('interpolate fills {placeholders} and leaves unknown ones alone', () => {
    expect(interpolate('Hello {name}, you are {n}', { name: 'Asha', n: 3 })).toBe('Hello Asha, you are 3')
    expect(interpolate('Hi {who}', { name: 'x' })).toBe('Hi {who}')
    expect(interpolate('No vars here')).toBe('No vars here')
    expect(interpolate('{a}{a}', { a: 'z' })).toBe('zz')
  })
  it('English returns the key itself (the English text is the key)', () => {
    expect(translate('en', { Hi: 'ನಮಸ್ಕಾರ' }, 'Hi')).toBe('Hi')
  })
  it('Kannada returns the dictionary entry, and interpolates it', () => {
    expect(translate('kn', { 'Hi {n}': 'ನಮಸ್ಕಾರ {n}' }, 'Hi {n}', { n: 'Asha' })).toBe('ನಮಸ್ಕಾರ Asha')
  })
  it('falls back to English for a missing translation (never breaks the page)', () => {
    expect(translate('kn', {}, 'Not translated yet')).toBe('Not translated yet')
    expect(translate('kn', {}, 'Hi {n}', { n: 1 })).toBe('Hi 1')
  })
  it('isLanguage accepts only en/kn', () => {
    expect(isLanguage('en')).toBe(true)
    expect(isLanguage('kn')).toBe(true)
    for (const v of ['hi', '', null, undefined, 3, 'KN']) expect(isLanguage(v)).toBe(false)
  })
  it('lists English and Kannada with native labels', () => {
    expect(LANGUAGES.map((l) => l.code)).toEqual(['en', 'kn'])
    expect(LANGUAGES[1].label).toBe('ಕನ್ನಡ')
  })
})

describe('Kannada dictionary quality', () => {
  const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')
  const entries = Object.entries(kn)
  it('is large and merges general + company entries', () => {
    expect(entries.length).toBeGreaterThan(350)
    expect(Object.keys(knGeneral).length + Object.keys(knCompany).length).toBe(entries.length)
  })
  it('keeps the same {placeholders} as the English text in every entry', () => {
    for (const [k, v] of entries) expect(ph(v), k).toBe(ph(k))
  })
  it('has no empty translations and no leftover build markers', () => {
    for (const [k, v] of entries) {
      expect(v.trim().length, k).toBeGreaterThan(0)
      expect(v, k).not.toMatch(/@BW@|@Z@/)
    }
  })
  it('really is Kannada (contains Kannada script) for every entry', () => {
    for (const [k, v] of entries) {
      const words = v.replace(/\{\w+\}/g, '').replace(/[^\p{L}]/gu, '')
      if (words.length) expect(/[ಀ-೿]/.test(v), `${k} -> ${v}`).toBe(true)
    }
  })
  it('writes ಬೋರ್‌ವೆಲ್ with a zero-width non-joiner so case/plural endings do not form odd conjuncts', () => {
    const all = entries.map(([, v]) => v).join(' ')
    expect(all).toContain('ಬೋರ್‌ವೆಲ್')
    expect(all).not.toMatch(/ವೆಲ್ಗ|ರಿಗ್ಗ|ಬಿಟ್ಗ|ರಾಡ್ಗ|ಟ್ಯಾಂಕರ್ಗ|ಕಂಪ್ರೆಸರ್ಗ|ಪಂಪ್ನ|ವಾಟ್ಸಾಪ್ನ/)
  })
  it('company entries override general ones', () => {
    for (const k of Object.keys(knCompany)) expect(kn[k]).toBe(knCompany[k])
  })
  it('uses consistent wording for key terms', () => {
    expect(kn['Get a Free Quote']).toContain('ಉಚಿತ ದರಪಟ್ಟಿ')
    expect(kn['Groundwater Survey']).toContain('ಅಂತರ್ಜಲ')
    expect(kn['Borewell Drilling']).toContain('ಬೋರ್‌ವೆಲ್')
  })
})

describe('detectLanguage', () => {
  beforeEach(() => { localStorage.clear(); history.replaceState(null, '', '/') })
  afterEach(() => { vi.restoreAllMocks(); history.replaceState(null, '', '/') })

  it('defaults to English', () => expect(detectLanguage()).toBe('en'))
  it('uses a saved choice', () => { localStorage.setItem(LANGUAGE_STORAGE_KEY, 'kn'); expect(detectLanguage()).toBe('kn') })
  it('ignores a junk saved value', () => { localStorage.setItem(LANGUAGE_STORAGE_KEY, 'xx'); expect(detectLanguage()).toBe('en') })
  it('follows a Kannada browser language on the first visit', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('kn-IN')
    expect(detectLanguage()).toBe('kn')
  })
  it('does not switch for other browser languages', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('hi-IN')
    expect(detectLanguage()).toBe('en')
  })
  it('?lang=kn in the link beats everything (shareable)', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    history.replaceState(null, '', '/?lang=kn')
    expect(detectLanguage()).toBe('kn')
  })
  it('a saved choice beats the browser language', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('kn-IN')
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    expect(detectLanguage()).toBe('en')
  })
  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    expect(detectLanguage()).toBe('en')
  })
})

describe('LanguageProvider / hooks', () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.lang = '' })

  it('without a provider, t() is the identity (English)', () => {
    const { result } = renderHook(() => useT())
    expect(result.current('Get a Free Quote')).toBe('Get a Free Quote')
    expect(result.current('Hi {n}', { n: 2 })).toBe('Hi 2')
  })
  it('translates with t() in Kannada and interpolates', () => {
    const { result } = renderHook(() => useT(), { wrapper: wrapper('kn') })
    expect(result.current('Get a Free Quote')).toBe(kn['Get a Free Quote'])
    expect(result.current('Depth: {depth}', { depth: '300 ft' })).toBe('ಆಳ: 300 ft')
  })
  it('sets <html lang> to match the language', () => {
    renderHook(() => useLanguage(), { wrapper: wrapper('kn') })
    expect(document.documentElement.lang).toBe('kn')
  })
  it('setLanguage switches t(), updates <html lang> and remembers the choice', () => {
    const { result } = renderHook(() => ({ lang: useLanguage(), t: useT() }), { wrapper: wrapper('en') })
    expect(result.current.t('Contact')).toBe('Contact')
    act(() => result.current.lang.setLanguage('kn'))
    expect(result.current.lang.language).toBe('kn')
    expect(result.current.t('Contact')).toBe(kn['Contact'])
    expect(document.documentElement.lang).toBe('kn')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('kn')
    act(() => result.current.lang.setLanguage('en'))
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })
  it('keeps working if storage is blocked when saving', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    const { result } = renderHook(() => useLanguage(), { wrapper: wrapper('en') })
    expect(() => act(() => result.current.setLanguage('kn'))).not.toThrow()
    expect(result.current.language).toBe('kn')
    vi.restoreAllMocks()
  })
  it('restores the saved language on the next visit', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'kn')
    const { result } = renderHook(() => useLanguage(), { wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider> })
    expect(result.current.language).toBe('kn')
  })
})

describe('LanguageSwitcher', () => {
  beforeEach(() => localStorage.clear())
  const Probe = () => { const t = useT(); return <p data-testid="probe">{t('Contact Us')}</p> }
  const setup = (initial: 'en' | 'kn' = 'en') => render(<LanguageProvider initial={initial}><LanguageSwitcher /><Probe /></LanguageProvider>)

  it('offers English and ಕನ್ನಡ as a labelled group with the current one pressed', () => {
    setup('en')
    const group = screen.getByRole('group', { name: /Language/ })
    const [en, kn_] = within(group).getAllByRole('button')
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(kn_).toHaveAttribute('aria-pressed', 'false')
    expect(kn_).toHaveAttribute('lang', 'kn')
    expect(kn_).toHaveTextContent('ಕನ್ನಡ')
  })
  it('switches the page text when clicked, both directions', async () => {
    const user = userEvent.setup()
    setup('en')
    expect(screen.getByTestId('probe')).toHaveTextContent('Contact Us')
    await user.click(screen.getByRole('button', { name: 'ಕನ್ನಡ' }))
    expect(screen.getByTestId('probe')).toHaveTextContent(kn['Contact Us'])
    expect(screen.getByRole('button', { name: 'ಕನ್ನಡ' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByTestId('probe')).toHaveTextContent('Contact Us')
  })
})
