import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Expand } from 'lucide-react'
import { images } from '../../data/images'
import { equipment } from '../../data/equipment'
import Lightbox from '../ui/Lightbox'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import WaveDivider from '../ui/WaveDivider'
import { useT } from '../../i18n/LanguageContext'

export default function Machinery() {
  const t = useT()
  const [open, setOpen] = useState<number | null>(null)
  const items = equipment.map((e) => ({ src: images[e.image], alt: `${t(e.title)} – ${t(e.description)}`, title: t(e.title), caption: t(e.description) }))

  return (
    <section id="machinery" aria-labelledby="machinery-title" className="section-y relative bg-white">
      <div className="container-x">
        <SectionHeading id="machinery-title" eyebrow={t('Machinery & Equipment')} title={t('The equipment behind every borewell')} subtitle={t('Rigs, compressors, tankers and accessories, maintained and ready for the job. Tap any image to preview.')} />

        <ul className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 sm:auto-rows-[240px] lg:grid-cols-4">
          {equipment.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 0.06} className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={t('Preview {title}', { title: t(e.title) })}
                className="group relative block h-full w-full overflow-hidden rounded-3xl text-left shadow-card"
              >
                <img src={images[e.image]} alt={`${t(e.title)}: ${t(e.description)}`} width={800} height={600} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent transition group-hover:from-navy-950/95" />
                <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand size={18} aria-hidden />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-water-300">{t(e.category)}</span>
                  <h3 className={`mt-1 font-display font-semibold ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{t(e.title)}</h3>
                  <p className={`mt-1 text-sm text-white/70 ${i === 0 ? '' : 'hidden sm:block'}`}>{t(e.description)}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
      <WaveDivider className="text-navy-900" />
    </section>
  )
}
