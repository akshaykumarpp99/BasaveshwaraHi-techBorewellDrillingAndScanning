import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { kn } from './kn'
import { isLanguage, translate, type Language, type Vars } from './translate'

export const LANGUAGE_STORAGE_KEY = 'lang'
type TFn = (key: string, vars?: Vars) => string

interface Ctx { language: Language; setLanguage: (l: Language) => void; t: TFn }

const identity: TFn = (key, vars) => translate('en', {}, key, vars)
const LanguageContext = createContext<Ctx>({ language: 'en', setLanguage: () => {}, t: identity })

/** ?lang=kn (shareable link) > saved choice > browser language > English. */
export function detectLanguage(): Language {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (isLanguage(q)) return q
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLanguage(saved)) return saved
    if (navigator.language?.toLowerCase().startsWith('kn')) return 'kn'
  } catch { /* storage blocked: fall through */ }
  return 'en'
}

export function LanguageProvider({ children, initial }: { children: ReactNode; initial?: Language }) {
  const [language, setLang] = useState<Language>(() => initial ?? detectLanguage())

  const setLanguage = useCallback((l: Language) => {
    setLang(l)
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, l) } catch { /* ignore */ }
  }, [])

  // keep <html lang> in sync (screen readers, hyphenation, CSS font/spacing rules for Kannada)
  useEffect(() => { document.documentElement.lang = language }, [language])

  const t = useMemo<TFn>(() => (key, vars) => translate(language, kn, key, vars), [language])
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
export const useT = () => useContext(LanguageContext).t
