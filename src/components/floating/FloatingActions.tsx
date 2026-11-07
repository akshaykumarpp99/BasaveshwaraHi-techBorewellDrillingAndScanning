import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { phoneHref, whatsappLink } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

/** Floating WhatsApp (all screens), Call Now (mobile only) and Back-to-top buttons. */
export default function FloatingActions() {
  const t = useT()
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 700)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <a
        href={phoneHref}
        aria-label={t('Call now')}
        className="fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-950/30 transition active:scale-95 md:hidden"
      >
        <Phone size={18} aria-hidden /> {t('Call Now')}
      </a>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('Chat on WhatsApp')}
        className="group fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/30 transition hover:scale-105 active:scale-95 sm:right-6"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" aria-hidden />
        <MessageCircle size={28} className="relative" aria-hidden />
      </a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label={t('Back to top')}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-white text-navy-900 shadow-lg ring-1 ring-navy-900/10 transition hover:bg-water-50 sm:right-6"
          >
            <ArrowUp size={20} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
