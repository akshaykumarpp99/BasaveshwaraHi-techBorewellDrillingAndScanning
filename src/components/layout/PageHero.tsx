import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import WaveDivider from '../ui/WaveDivider'
import { useT } from '../../i18n/LanguageContext'

interface Props {
  title: string
  subtitle?: string
  crumbs?: { label: string; to?: string }[]
  children?: ReactNode
}

/** Dark banner used at the top of inner pages. Renders the page's single <h1>. */
export default function PageHero({ title, subtitle, crumbs = [], children }: Props) {
  const t = useT()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 pb-24 pt-36 text-white sm:pb-28 sm:pt-44">
      <div aria-hidden className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-water-500/20 blur-3xl" />
      <div aria-hidden className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
      <div aria-hidden className="gauge absolute bottom-0 right-8 top-28 hidden w-3 text-white/10 lg:block" />
      <div className="container-x relative">
        <nav aria-label={t('Breadcrumb')} className="mb-5 flex flex-wrap items-center gap-1 text-sm text-white/60">
          <Link to="/" className="hover:text-white">{t('Home')}</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight size={14} aria-hidden />
              {c.to ? <Link to={c.to} className="hover:text-white">{t(c.label)}</Link> : <span aria-current="page" className="text-white">{t(c.label)}</span>}
            </span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{t(title)}</h1>
        <span aria-hidden className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-gold-300 to-gold-500" />
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{t(subtitle)}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
      <WaveDivider className="text-white" />
    </section>
  )
}
