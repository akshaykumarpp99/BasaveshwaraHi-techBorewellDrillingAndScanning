import Seo from '../seo/Seo'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import { useT } from '../i18n/LanguageContext'

export default function NotFound() {
  const t = useT()
  return (
    <>
      <Seo path="/404" title={t('Page not found')} description={t('The page you are looking for does not exist.')} noindex />
      <PageHero title="Page not found" subtitle="The page you’re looking for doesn’t exist or has moved.">
        <div className="flex flex-wrap gap-3">
          <Button to="/" size="lg">{t('Back to Home')}</Button>
          <Button to="/services" size="lg" variant="outline">{t('View Services')}</Button>
        </div>
      </PageHero>
      <div className="h-24 bg-white" />
    </>
  )
}
