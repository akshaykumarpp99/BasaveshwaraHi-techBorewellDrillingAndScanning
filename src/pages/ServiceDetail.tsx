import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Lightbulb } from 'lucide-react'
import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd, serviceJsonLd } from '../lib/seo'
import { images } from '../data/images'
import { getService, services } from '../data/services'
import PageHero from '../components/layout/PageHero'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import Contact from '../components/sections/Contact'
import NotFound from './NotFound'
import { useT } from '../i18n/LanguageContext'

export default function ServiceDetail() {
  const t = useT()
  const { slug } = useParams()
  const s = getService(slug)
  if (!s) return <NotFound />
  const path = `/services/${s.slug}`
  const others = services.filter((o) => o.slug !== s.slug)

  return (
    <>
      <Seo
        path={path}
        title={t('{title} in {city} | {name}', { title: t(s.title), city: t(site.city), name: t(site.name) })}
        description={t('{short} Get a free quote from {name} in {city}.', { short: t(s.short), name: t(site.name), city: t(site.city) })}
        jsonLd={[serviceJsonLd(t(s.title), t(s.short), path), breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('Services'), path: '/services' }, { name: t(s.title), path }])]}
      />
      <PageHero title={s.title} subtitle={s.short} crumbs={[{ label: 'Services', to: '/services' }, { label: s.title }]}>
        <Button to="#enquire" size="lg">{t('Get a Free Quote')}</Button>
      </PageHero>

      <section aria-label={t('{title} details', { title: t(s.title) })} className="bg-white pb-20 sm:pb-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal><img src={images[s.image]} alt={t('{title} by {name}', { title: t(s.title), name: t(site.name) })} width={800} height={600} className="aspect-[16/9] w-full rounded-3xl object-cover shadow-card" /></Reveal>
            <Reveal><h2 className="mt-10 text-2xl font-bold">{t('About this service')}</h2><p className="mt-4 text-lg leading-relaxed text-navy-900/70">{t(s.overview)}</p></Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Reveal className="rounded-3xl bg-water-50 p-7">
                <h2 className="font-display text-lg font-bold">{t('What’s included')}</h2>
                <ul className="mt-4 space-y-3">{s.included.map((i) => <li key={i} className="flex gap-3 text-sm text-navy-900/75"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-water-600" aria-hidden />{t(i)}</li>)}</ul>
              </Reveal>
              <Reveal delay={0.08} className="rounded-3xl bg-earth-100 p-7">
                <h2 className="font-display text-lg font-bold">{t('When you need it')}</h2>
                <ul className="mt-4 space-y-3">{s.whenYouNeedIt.map((i) => <li key={i} className="flex gap-3 text-sm text-navy-900/75"><Lightbulb size={18} className="mt-0.5 shrink-0 text-earth-500" aria-hidden />{t(i)}</li>)}</ul>
              </Reveal>
            </div>
          </div>

          <aside aria-label={t('Other services')} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 p-7 text-white shadow-card">
              <h2 className="font-display text-lg font-bold">{t('Other services')}</h2>
              <ul className="mt-4 divide-y divide-white/10">
                {others.map((o) => (
                  <li key={o.slug}><Link to={`/services/${o.slug}`} className="flex items-center gap-3 py-3 text-sm text-white/75 transition hover:text-white"><o.icon size={18} className="text-gold-300" aria-hidden />{t(o.title)}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <div id="enquire"><Contact defaultService={s.title} asPageContent /></div>
    </>
  )
}
