import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/layout/Loader'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollManager from './components/layout/ScrollManager'
import RouteCurtain from './components/layout/RouteCurtain'
import ScrollProgress from './components/layout/ScrollProgress'
import PageTransition from './components/layout/PageTransition'
import FloatingActions from './components/floating/FloatingActions'
import Home from './pages/Home'
import { useT } from './i18n/LanguageContext'

const AboutPage = lazy(() => import('./pages/About'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CityLanding = lazy(() => import('./pages/CityLanding'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const t = useT()
  const location = useLocation()
  return (
    <>
      <a href="#main" className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-white px-5 py-3 font-semibold text-navy-900 shadow-lg transition focus:translate-y-0">{t('Skip to content')}</a>
      <ScrollManager />
      <Loader />
      <ScrollProgress />
      <RouteCurtain />
      <Navbar />
      <main id="main">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<div className="min-h-screen bg-navy-950" aria-hidden />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/borewell-drilling-in/:city" element={<CityLanding />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
