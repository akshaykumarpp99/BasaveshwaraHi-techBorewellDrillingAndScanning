import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd } from '../lib/seo'
import PageHero from '../components/layout/PageHero'
import Contact from '../components/sections/Contact'
import FAQ from '../components/sections/FAQ'
import { useT } from '../i18n/LanguageContext'

export default function ContactPage() {
  const t = useT()
  return (
    <>
      <Seo
        path="/contact"
        title={t('Contact {name} | Free Borewell Quote in {city}', { name: t(site.name), city: t(site.city) })}
        description={t('Request a free borewell drilling quote from {name}. Call, WhatsApp or send an enquiry. Located in {city}.', { name: t(site.name), city: t(site.city) })}
        jsonLd={[localBusinessJsonLd(), faqJsonLd(), breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('Contact'), path: '/contact' }])]}
      />
      <PageHero title="Contact Us" subtitle="Tell us about your site and water requirement. We’ll reply with next steps and a clear quote." crumbs={[{ label: 'Contact' }]} />
      <Contact asPageContent />
      <FAQ />
    </>
  )
}
