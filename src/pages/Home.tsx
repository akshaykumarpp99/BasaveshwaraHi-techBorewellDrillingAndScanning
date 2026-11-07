import Seo from '../seo/Seo'
import { PageMotion } from '../context/pageMotion'
import { site } from '../config/site'
import { faqJsonLd, localBusinessJsonLd } from '../lib/seo'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Services from '../components/sections/Services'
import Machinery from '../components/sections/Machinery'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import Projects from '../components/sections/Projects'
import Process from '../components/sections/Process'
import Testimonials from '../components/sections/Testimonials'
import FAQ from '../components/sections/FAQ'
import Contact from '../components/sections/Contact'
import { useT } from '../i18n/LanguageContext'

export default function Home() {
  const t = useT()
  return (
    <PageMotion.Provider value={false}>
      <Seo
        path="/"
        title={t('Borewell Drilling Services in {city} | {name}', { city: t(site.city), name: t(site.name) })}
        description={t('{name}: borewell drilling company in {city}. Borewell drilling, cleaning, flushing, submersible pump installation and groundwater survey. Get a free quote.', { name: t(site.name), city: t(site.city) })}
        jsonLd={[localBusinessJsonLd(), faqJsonLd()]}
      />
      <Hero />
      <About />
      <Services />
      <Machinery />
      <WhyChooseUs />
      <Projects />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
    </PageMotion.Provider>
  )
}
