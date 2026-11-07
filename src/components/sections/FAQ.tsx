import { MessageCircle, Phone } from 'lucide-react'
import { phoneHref, whatsappLink } from '../../config/site'
import { faqs } from '../../data/content'
import Accordion from '../ui/Accordion'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

export default function FAQ() {
  const t = useT()
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="faq-title" align="left" compact eyebrow={t('FAQ')} title={t('Questions we hear most')} />
          <Reveal>
            <p className="text-lg leading-relaxed text-navy-900/65">{t('Can’t find your answer? Talk to our team and we’ll guide you.')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={phoneHref} variant="secondary" icon={<Phone size={16} aria-hidden />}>{t('Call Us')}</Button>
              <Button href={whatsappLink()} variant="primary" icon={<MessageCircle size={16} aria-hidden />}>{t('WhatsApp')}</Button>
            </div>
          </Reveal>
        </div>
        <Reveal><Accordion items={faqs.map((f) => ({ q: t(f.q), a: t(f.a) }))} /></Reveal>
      </div>
    </section>
  )
}
