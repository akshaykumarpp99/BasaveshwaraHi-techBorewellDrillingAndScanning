import { useLanguage } from './LanguageContext'
import { LANGUAGES } from './translate'

/** EN | ಕನ್ನಡ toggle. `tone` picks colours for dark (navbar) or light surfaces. */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  return (
    <div role="group" aria-label="Language / ಭಾಷೆ" className={`inline-flex items-center rounded-full bg-white/10 p-0.5 text-xs font-semibold ${className}`}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={language === l.code}
          aria-label={l.name}
          onClick={() => setLanguage(l.code)}
          className={`rounded-full px-2.5 py-1.5 transition sm:px-3 ${language === l.code ? 'bg-gold-400 text-navy-950 shadow' : 'text-white/80 hover:text-white'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
