import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import { site } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

const KEY = 'loader:seen'

/** Brief branded intro, shown once per browser session. */
export default function Loader() {
  const tr = useT()
  const [show, setShow] = useState(() => !sessionStorage.getItem(KEY))
  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => {
      sessionStorage.setItem(KEY, '1')
      setShow(false)
    }, 1500)
    return () => window.clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] grid place-items-center bg-navy-950"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          role="status"
          aria-label={tr('Loading')}
        >
          <div className="flex flex-col items-center gap-6 text-white">
            <div className="relative grid h-20 w-20 place-items-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold-400" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold-400 [animation-delay:.8s]" />
              <Droplets size={38} className="text-gold-300" aria-hidden />
            </div>
            <p className="font-display text-lg font-semibold tracking-wide">{tr(site.name)}</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-200" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.3, ease: 'easeInOut' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
