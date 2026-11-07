import { Link, useParams } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd, localBusinessJsonLd, serviceJsonLd } from '../lib/seo'
import { cities, getCity } from '../data/cities'
import { services } from '../data/services'
import { images } from '../data/images'
import PageHero from '../components/layout/PageHero'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import Contact from '../components/sections/Contact'
import NotFound from './NotFound'
import { useT } from '../i18n/LanguageContext'

export default function CityLanding() {
  const t = useT()
  const { city: slug } = useParams()
  const city = getCity(slug)
  if (!city) return <NotFound />
  const path = `/borewell-drilling-in/${city.slug}`

  return (
    <>
      <Seo
        path={path}
        title={t('Borewell Drilling Services in {city} | {name}', { city: t(city.name), name: t(site.name) })}
        description={t('Looking for borewell drilling in {city}? {name} offers borewell drilling, cleaning, flushing, pump installation and groundwater surveys. Free quote.', { city: t(city.name), name: t(site.name) })}
        jsonLd={[
          localBusinessJsonLd(),
          serviceJsonLd(t('Borewell Drilling in {city}', { city: t(city.name) }), t(city.blurb), path, t(city.name)),
          breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('Borewell Drilling in {city}', { city: t(city.name) }), path }]),
        ]}
      />
      <PageHero title={t('Borewell Drilling Services in {city}', { city: t(city.name) })} subtitle={city.blurb} crumbs={[{ label: city.name }]}>
        <Button to="#enquire" size="lg" icon={<ArrowRight size={18} aria-hidden />}>{t('Get a Free Quote')}</Button>
      </PageHero>

      <section aria-label={t('Services in {city}', { city: t(city.name) })} className="bg-white pb-20 sm:pb-24">
        <div className="container-x">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold">{t('Borewell contractors serving {city}', { city: t(city.name) })}</h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-900/65">
              {t('Whether you need a new borewell, a borewell cleaned or flushed, a submersible pump installed, or a groundwater survey before you drill, {name} serves homes, farms, businesses and industry in {city}, {region}.', { name: t(site.name), city: t(city.name), region: t(city.region) })}
            </p>
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 0.06}>
                <Link to={`/services/${s.slug}`} className="group block h-full overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-900/5 transition hover:-translate-y-1.5 hover:shadow-glow">
                  <img src={images[s.image]} alt={t('{title} in {city}', { title: t(s.title), city: t(city.name) })} width={800} height={600} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="p-5"><h3 className="font-display font-semibold">{t('{title} in {city}', { title: t(s.title), city: t(city.name) })}</h3><p className="mt-1.5 text-sm text-navy-900/60">{t(s.short)}</p></div>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-14 rounded-3xl bg-water-50 p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold"><MapPin size={20} className="text-water-600" aria-hidden /> {t('Other areas we serve')}</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {cities.filter((c) => c.slug !== city.slug).map((c) => (
                <li key={c.slug}><Link to={`/borewell-drilling-in/${c.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-navy-900/10 transition hover:ring-water-400">{t('Borewell Drilling in {city}', { city: t(c.name) })}</Link></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <div id="enquire"><Contact asPageContent /></div>
    </>
  )
}
