import { ArrowRight, Phone } from 'lucide-react'
import { phoneHref, site } from '../../config/site'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import { useT } from '../../i18n/LanguageContext'

export default function CTABanner({ title = 'Need water? Let’s find the right spot.', text = 'Talk to our team about your borewell project and get a clear, written quote.' }: { title?: string; text?: string }) {
  const t = useT()
  return (
    <section aria-label={t('Get a quote')} className="bg-white pb-20 sm:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-800 to-water-700 px-8 py-14 text-center text-white shadow-card sm:px-16">
            <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-water-400/25 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold-400/15 blur-3xl" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">{t(title)}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/75">{t(text)}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/contact" size="lg" icon={<ArrowRight size={18} aria-hidden />}>{t('Get a Free Quote')}</Button>
              <Button href={phoneHref} size="lg" variant="outline" icon={<Phone size={16} aria-hidden />}>{site.phone}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
