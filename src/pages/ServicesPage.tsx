import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd } from '../lib/seo'
import PageHero from '../components/layout/PageHero'
import Services from '../components/sections/Services'
import CTABanner from '../components/sections/CTABanner'
import { useT } from '../i18n/LanguageContext'

export default function ServicesPage() {
  const t = useT()
  return (
    <>
      <Seo
        path="/services"
        title={t('Borewell Services: Drilling, Cleaning, Flushing & Pumps | {name}', { name: t(site.name) })}
        description={t('Borewell drilling, openwell drilling, borewell cleaning and flushing, submersible pump installation, groundwater survey and maintenance in {city}.', { city: t(site.city) })}
        jsonLd={breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('Services'), path: '/services' }])}
      />
      <PageHero title="Our Borewell & Water Services" subtitle="Everything from groundwater survey to drilling, pump installation and maintenance." crumbs={[{ label: 'Services' }]} />
      <Services asPageContent />
      <CTABanner />
    </>
  )
}
