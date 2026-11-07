import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd, localBusinessJsonLd } from '../lib/seo'
import PageHero from '../components/layout/PageHero'
import AboutSection from '../components/sections/About'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import Process from '../components/sections/Process'
import Machinery from '../components/sections/Machinery'
import CTABanner from '../components/sections/CTABanner'
import { useT } from '../i18n/LanguageContext'

export default function AboutPage() {
  const t = useT()
  const name = t(site.name)
  return (
    <>
      <Seo
        path="/about"
        title={t('About {name} | Borewell Drilling Company in {city}', { name, city: t(site.city) })}
        description={t('Learn about {name}, our experience, drilling equipment, technical team and commitment to quality and safety in borewell drilling.', { name })}
        jsonLd={[localBusinessJsonLd(), breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('About'), path: '/about' }])]}
      />
      <PageHero title={t('About {name}', { name })} subtitle="Borewell drilling and water solutions built on careful assessment, modern equipment and honest pricing." crumbs={[{ label: 'About' }]} />
      <AboutSection />
      <Machinery />
      <WhyChooseUs />
      <Process />
      <CTABanner />
    </>
  )
}
