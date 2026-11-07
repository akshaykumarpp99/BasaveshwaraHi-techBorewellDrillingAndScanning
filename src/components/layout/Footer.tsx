import { Link } from 'react-router-dom'
import { Clock, Droplets, Mail, MapPin, Phone } from 'lucide-react'
import { fullAddress, mailHref, phoneHref, site } from '../../config/site'
import { services } from '../../data/services'
import { cities } from '../../data/cities'
import HashLink from '../ui/HashLink'
import { useT } from '../../i18n/LanguageContext'

const col = 'text-sm text-white/65 transition hover:text-white'
const head = 'font-display text-sm font-semibold uppercase tracking-widest text-gold-300'

export default function Footer() {
  const t = useT()
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-water-400" />
      <div aria-hidden className="gauge pointer-events-none absolute inset-y-0 right-6 hidden w-3 text-white/10 lg:block" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5" aria-label={t('{name} – home', { name: t(site.name) })}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950"><Droplets size={22} aria-hidden /></span>
            <span className="font-display text-lg font-bold">{t(site.name)}</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {t('{tagline}. Borewell drilling, cleaning, flushing, pump installation and groundwater surveys in {city} and nearby areas.', { tagline: t(site.tagline), city: t(site.city) })}
          </p>
        </div>

        <nav aria-label={t('Footer services')}>
          <h2 className={head}>{t('Services')}</h2>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.slug}><Link className={col} to={`/services/${s.slug}`}>{t(s.title)}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('Footer company')}>
          <h2 className={head}>{t('Company')}</h2>
          <ul className="mt-5 space-y-3">
            <li><Link className={col} to="/about">{t('About Us')}</Link></li>
            <li><Link className={col} to="/services">{t('All Services')}</Link></li>
            <li><Link className={col} to="/projects">{t('Projects')}</Link></li>
            <li><HashLink className={col} to="/#process">{t('Work Process')}</HashLink></li>
            <li><HashLink className={col} to="/#faq">{t('FAQ')}</HashLink></li>
            <li><Link className={col} to="/contact">{t('Contact')}</Link></li>
          </ul>
          <h2 className={`mt-8 ${head}`}>{t('Service Areas')}</h2>
          <ul className="mt-5 space-y-3">
            {cities.map((c) => (
              <li key={c.slug}><Link className={col} to={`/borewell-drilling-in/${c.slug}`}>{t('Borewell Drilling in {city}', { city: t(c.name) })}</Link></li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className={head}>{t('Contact')}</h2>
          <ul className="mt-5 space-y-4 text-sm text-white/75">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" aria-hidden />{fullAddress(t)}</li>
            <li className="flex gap-3"><Phone size={18} className="shrink-0 text-gold-400" aria-hidden /><a className="hover:text-white" href={phoneHref}>{site.phone}</a></li>
            <li className="flex gap-3"><Mail size={18} className="shrink-0 text-gold-400" aria-hidden /><a className="break-all hover:text-white" href={mailHref}>{site.email}</a></li>
            <li className="flex gap-3"><Clock size={18} className="shrink-0 text-gold-400" aria-hidden />{t(site.hours)}</li>
          </ul>
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>{t('© {year} {name}. All rights reserved.', { year: new Date().getFullYear(), name: t(site.name) })}</p>
          <p>{t('Groundwater results vary by site; no driller can guarantee water.')}</p>
        </div>
      </div>
    </footer>
  )
}
