import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()
  return (
    <div className="divide-y divide-navy-900/10 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-card">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${uid}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-base font-semibold text-navy-900 transition hover:bg-water-50/60 sm:text-lg"
              >
                {it.q}
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${isOpen ? 'rotate-45 bg-water-500 text-white' : 'bg-water-50 text-water-600'}`}>
                  <Plus size={18} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-navy-900/70">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
