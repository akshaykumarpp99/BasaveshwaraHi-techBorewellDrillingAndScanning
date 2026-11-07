import Seo from '../seo/Seo'
import { site } from '../config/site'
import { breadcrumbJsonLd } from '../lib/seo'
import PageHero from '../components/layout/PageHero'
import Projects from '../components/sections/Projects'
import CTABanner from '../components/sections/CTABanner'
import { useT } from '../i18n/LanguageContext'

export default function ProjectsPage() {
  const t = useT()
  return (
    <>
      <Seo
        path="/projects"
        title={t('Completed Borewell Projects | {name}', { name: t(site.name) })}
        description={t('Browse residential, agricultural, commercial and industrial borewell drilling projects completed by {name} in {city}.', { name: t(site.name), city: t(site.city) })}
        jsonLd={breadcrumbJsonLd([{ name: t('Home'), path: '/' }, { name: t('Projects'), path: '/projects' }])}
      />
      <PageHero title="Our Completed Projects" subtitle="Residential, agricultural, commercial and industrial borewells, filter by type and open any image." crumbs={[{ label: 'Projects' }]} />
      <Projects asPageContent />
      <CTABanner />
    </>
  )
}
