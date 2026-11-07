export type Language = 'en' | 'kn'
export const LANGUAGES: { code: Language; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'ಕನ್ನಡ' },
]
export type Vars = Record<string, string | number>

/** Replaces {name} placeholders. Unknown placeholders are left as-is. */
export const interpolate = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text

/**
 * String-as-key translation: the English text IS the key.
 * Missing entries fall back to the English text, so an untranslated string never breaks the page.
 */
export const translate = (language: Language, dict: Record<string, string>, key: string, vars?: Vars) =>
  interpolate(language === 'en' ? key : (dict[key] ?? key), vars)

export const isLanguage = (v: unknown): v is Language => v === 'en' || v === 'kn'
