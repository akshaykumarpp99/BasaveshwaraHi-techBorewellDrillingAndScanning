import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useT } from '../../i18n/LanguageContext'

interface LightboxItem { src: string; alt: string; title: string; caption?: string }

interface Props {
  items: LightboxItem[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

/** Accessible modal image viewer: Esc to close, ←/→ to navigate, focus trapped and restored. */
export default function Lightbox({ items, index, onIndex, onClose }: Props) {
  const t = useT()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const item = items[index]
  useLockBodyScroll(true)

  // direction of travel, so frames slide the way the user is going (handles wrap-around)
  const lastIndex = useRef(index)
  const forward = lastIndex.current === index ? 1 : (index - lastIndex.current + items.length) % items.length <= items.length / 2 ? 1 : -1
  useEffect(() => { lastIndex.current = index }, [index])

  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex])

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!f?.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex flex-col bg-navy-950/95 p-4 backdrop-blur-md sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-white/60" aria-live="polite">{index + 1} / {items.length}</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('Close preview')} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
          <X size={22} aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {items.length > 1 && (
          <button type="button" onClick={prev} aria-label={t('Previous image')} className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:-left-2">
            <ChevronLeft aria-hidden />
          </button>
        )}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={forward}>
            <motion.img
              key={item.src + index}
              src={item.src}
              alt={item.alt}
              custom={forward}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 120, scale: 0.94 }),
                center: { opacity: 1, x: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: d * -120, scale: 0.94 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </AnimatePresence>
        </div>
        {items.length > 1 && (
          <button type="button" onClick={next} aria-label={t('Next image')} className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:-right-2">
            <ChevronRight aria-hidden />
          </button>
        )}
      </div>

      <div className="mx-auto mt-4 max-w-2xl text-center text-white" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-lg font-semibold">{item.title}</p>
        {item.caption && <p className="mt-1 text-sm text-white/65">{item.caption}</p>}
      </div>
    </motion.div>,
    document.body
  )
}
