import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { fullAddress, mailHref, phoneHref, site, whatsappLink } from '../../config/site'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import EnquiryForm from './EnquiryForm'
import { useT } from '../../i18n/LanguageContext'

const row = 'flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-navy-900/5 transition hover:ring-water-300'
const ico = 'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300'

export default function Contact({ defaultService, asPageContent = false }: { defaultService?: string; asPageContent?: boolean }) {
  const t = useT()
  return (
    <section id="contact" aria-labelledby={asPageContent ? undefined : 'contact-title'} aria-label={asPageContent ? t('Contact and enquiry') : undefined} className={`relative bg-gradient-to-b from-water-50 to-earth-50 ${asPageContent ? 'pb-20 pt-6 sm:pb-28' : 'section-y'}`}>
      <div className="container-x">
        {asPageContent ? <h2 className="sr-only">{t('Enquiry form and contact details')}</h2> : (
          <SectionHeading id="contact-title" eyebrow={t('Contact Us')} title={t('Get your free borewell quote')} subtitle={t('Share a few details and we’ll get back to you. Prefer to talk? Call or message us directly.')} />
        )}

        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <Reveal direction="left"><EnquiryForm defaultService={defaultService} /></Reveal>

          <Reveal direction="right" className="space-y-4">
            <a href={phoneHref} className={row}>
              <span className={ico}><Phone size={20} aria-hidden /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/50">{t('Call us')}</span><span className="font-display text-lg font-semibold">{site.phone}</span></span>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={row}>
              <span className={`${ico} !bg-[#25D366] !text-white`}><MessageCircle size={20} aria-hidden /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/50">WhatsApp</span><span className="font-display text-lg font-semibold">{t('Chat with us')}</span></span>
            </a>
            <a href={mailHref} className={row}>
              <span className={ico}><Mail size={20} aria-hidden /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/50">{t('Email')}</span><span className="block break-all font-display text-lg font-semibold">{site.email}</span></span>
            </a>
            <div className={row}>
              <span className={ico}><MapPin size={20} aria-hidden /></span>
              <address className="not-italic"><span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/50">{t('Office')}</span><span className="font-medium">{fullAddress(t)}</span></address>
            </div>
            <div className={row}>
              <span className={ico}><Clock size={20} aria-hidden /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-wider text-navy-900/50">{t('Working hours')}</span><span className="font-medium">{t(site.hours)}</span></span>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-navy-900/5">
              <iframe
                title={t('Map showing {name} location', { name: t(site.name) })}
                src={site.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-64 w-full border-0"
              />
              <div className="bg-white p-3">
                <Button href={site.mapLinkUrl} variant="secondary" className="w-full" icon={<ExternalLink size={15} aria-hidden />}>{t('Open in Google Maps')}</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
