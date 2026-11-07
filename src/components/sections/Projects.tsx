import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Layers, MapPin, Ruler, ZoomIn } from 'lucide-react'
import { images } from '../../data/images'
import { projectCategories, projects, type ProjectCategory } from '../../data/projects'
import Button from '../ui/Button'
import Lightbox from '../ui/Lightbox'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

type Filter = 'All' | ProjectCategory
const filters: Filter[] = ['All', ...projectCategories]

export default function Projects({ asPageContent = false }: { asPageContent?: boolean }) {
  const t = useT()
  const [filter, setFilter] = useState<Filter>('All')
  const [open, setOpen] = useState<number | null>(null)
  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const items = useMemo(
    () => visible.map((p) => ({ src: images[p.image], alt: `${t(p.title)}, ${t(p.location)}`, title: t(p.title), caption: `${t(p.location)} · ${t(p.depth)} · ${t(p.drillingType)}` })),
    [visible, t]
  )

  return (
    <section id="projects" aria-labelledby={asPageContent ? undefined : 'projects-title'} aria-label={asPageContent ? t('Completed projects') : undefined} className={`bg-earth-50 ${asPageContent ? 'pb-20 pt-6 sm:pb-28' : 'section-y'}`}>
      <div className="container-x">
        {asPageContent ? <h2 className="sr-only">{t('Project gallery')}</h2> : (
          <SectionHeading id="projects-title" eyebrow={t('Completed Projects')} title={t('Borewells we have delivered')} subtitle={t('Filter by project type and open any image for a closer look.')} />
        )}

        <div role="group" aria-label={t('Filter projects by category')} className="mb-10 flex flex-wrap justify-center gap-2.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${filter === f ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/25' : 'bg-white text-navy-900/70 ring-1 ring-navy-900/10 hover:text-navy-900 hover:ring-navy-900/30'}`}
            >
              {t(f)}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{t('{count} projects shown', { count: visible.length })}</p>

        <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.length === 0 && <li className="col-span-full py-10 text-center text-navy-900/60">{t('No projects in this category yet.')}</li>}
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35 }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-glow">
                  <button type="button" onClick={() => setOpen(i)} aria-label={t('Open image: {title}', { title: t(p.title) })} className="relative block aspect-[4/3] overflow-hidden">
                    <img src={images[p.image]} alt={t('{title} in {location}', { title: t(p.title), location: t(p.location) })} width={800} height={600} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute left-4 top-4 rounded-full bg-navy-900/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{t(p.category)}</span>
                    {p.isSample && <span className="absolute right-4 top-4 rounded-full bg-earth-400 px-3 py-1 text-xs font-semibold text-white">{t('Sample')}</span>}
                    <span className="absolute inset-0 grid place-items-center bg-navy-950/0 text-white opacity-0 transition duration-300 group-hover:bg-navy-950/35 group-hover:opacity-100"><ZoomIn size={32} aria-hidden /></span>
                  </button>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold">{t(p.title)}</h3>
                    <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-navy-900/70">
                      <div className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-water-600" aria-hidden /><dt className="sr-only">{t('Location')}</dt><dd>{t(p.location)}</dd></div>
                      <div className="flex items-center gap-2"><Ruler size={16} className="shrink-0 text-water-600" aria-hidden /><dt className="sr-only">{t('Borewell depth')}</dt><dd>{t('Depth: {depth}', { depth: t(p.depth) })}</dd></div>
                      <div className="flex items-center gap-2"><Layers size={16} className="shrink-0 text-water-600" aria-hidden /><dt className="sr-only">{t('Type of drilling')}</dt><dd>{t(p.drillingType)}</dd></div>
                    </dl>
                    <p className="mt-4 text-sm leading-relaxed text-navy-900/65">{t(p.description)}</p>
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {!asPageContent && (
          <div className="mt-12 text-center">
            <Button to="/projects" variant="secondary" icon={<ArrowRight size={16} aria-hidden />}>{t('View All Projects')}</Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open !== null && items[open] && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}
