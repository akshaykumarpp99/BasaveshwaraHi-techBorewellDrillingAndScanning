import { ArrowRight, ChevronDown, Phone } from 'lucide-react'
import { phoneHref, site } from '../../config/site'
import { images } from '../../data/images'
import Button from '../ui/Button'
import Counter from '../ui/Counter'
import WaveDivider from '../ui/WaveDivider'
import { useT } from '../../i18n/LanguageContext'

/** Still hero: one background image, headline, CTAs and stats. No entrance or background animation. */
export default function Hero() {
  const t = useT()
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 text-white">
      <img
        src={images.hero}
        alt={t('Borewell drilling rig operating on site')}
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
      <div aria-hidden className="gauge absolute bottom-0 right-6 top-24 hidden w-3 text-white/15 xl:block" />

      <div className="container-x relative flex flex-1 flex-col justify-center pb-10 pt-32">
        <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-gold-400" aria-hidden />
          {t('{name} · Borewell Drilling in {city}', { name: t(site.name), city: t(site.city) })}
        </p>

        <h1 id="hero-title" className="max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
          {t('Delivering Reliable')} <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-gold-500 bg-clip-text text-transparent">{t('Water Solutions')}</span> {t('Through Advanced Borewell Technology.')}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
          {t('Your trusted partner for borewell drilling, groundwater solutions, and professional drilling services.')}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button to="/#contact" size="lg" icon={<ArrowRight size={18} aria-hidden />}>{t('Get a Free Quote')}</Button>
          <Button to="/#services" size="lg" variant="outline">{t('Explore Our Services')}</Button>
          <Button href={phoneHref} size="lg" variant="outline" icon={<Phone size={16} aria-hidden />}>{t('Contact Us')}</Button>
        </div>
      </div>

      <div className="relative pb-24 sm:pb-28">
        <dl className="container-x grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl lg:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="bg-navy-950/40 px-5 py-6 text-center sm:px-8 sm:py-7">
              <dd className="font-display text-3xl font-bold text-white sm:text-4xl"><Counter value={s.value} suffix={s.suffix} /></dd>
              <span aria-hidden className="mx-auto mt-2 block h-0.5 w-8 rounded-full bg-gradient-to-r from-gold-300 to-gold-500" />
              <dt className="mt-2 text-xs font-medium uppercase tracking-wider text-gold-200 sm:text-sm">{t(s.label)}</dt>
            </div>
          ))}
        </dl>
      </div>

      <a href="#about" aria-label={t('Scroll to About section')} className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 text-white/60 transition hover:text-white lg:block">
        <ChevronDown aria-hidden />
      </a>
      <WaveDivider className="text-white" />
    </section>
  )
}
