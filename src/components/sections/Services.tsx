import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { images } from '../../data/images'
import { services } from '../../data/services'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

export default function Services({ asPageContent = false }: { asPageContent?: boolean }) {
  const t = useT()
  return (
    <section id="services" aria-labelledby={asPageContent ? undefined : 'services-title'} aria-label={asPageContent ? t('Our services') : undefined} className={`relative bg-gradient-to-b from-water-50/70 to-white ${asPageContent ? 'pb-20 pt-6 sm:pb-28' : 'section-y'}`}>
      <div className="container-x">
        {asPageContent && <h2 className="sr-only">{t('All services')}</h2>}
        {!asPageContent && (
          <SectionHeading id="services-title" eyebrow={t('Our Services')} title={t('Complete borewell and groundwater services')} subtitle={t('From the first survey to a tested, working borewell and pump, we handle the whole job.')} />
        )}
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 4) * 0.07}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-900/5 transition duration-500 hover:-translate-y-2 hover:shadow-glow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={images[s.image]} alt={t('{title} service', { title: t(s.title) })} width={800} height={600} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 grid h-12 w-12 place-items-center rounded-2xl bg-water-500 text-white shadow-lg transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <s.icon size={24} aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-navy-900">{t(s.title)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-900/65">{t(s.short)}</p>
                  <Link to={`/services/${s.slug}`} aria-label={t('Learn more about {title}', { title: t(s.title) })} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-water-600 transition-all group-hover:gap-2.5">
                    {t('Learn More')} <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
