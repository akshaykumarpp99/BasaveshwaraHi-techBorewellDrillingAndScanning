import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Droplets, Menu, Phone, X } from 'lucide-react'
import { phoneHref, site } from '../../config/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import HashLink from '../ui/HashLink'
import Button from '../ui/Button'
import { useT } from '../../i18n/LanguageContext'
import LanguageSwitcher from '../../i18n/LanguageSwitcher'

const links = [
  { label: 'About', to: '/#about', id: 'about' },
  { label: 'Services', to: '/#services', id: 'services' },
  { label: 'Projects', to: '/#projects', id: 'projects' },
  { label: 'Process', to: '/#process', id: 'process' },
  { label: 'FAQ', to: '/#faq', id: 'faq' },
  { label: 'Contact', to: '/#contact', id: 'contact' },
]
const ids = links.map((l) => l.id)

export default function Navbar() {
  const t = useT()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const active = useActiveSection(ids, isHome)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useLockBodyScroll(open)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(false), toggleRef.current?.focus())
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const linkCls = (on: boolean) =>
    `relative rounded-full px-3.5 py-2 text-sm font-medium transition ${on ? 'text-white' : 'text-white/75 hover:text-white'}`

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scrolled || open ? 'bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 text-white" aria-label={t('{name} – home', { name: t(site.name) })}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-lg shadow-gold-600/30">
            <Droplets size={22} aria-hidden />
          </span>
          <span className="min-w-0 font-display text-[17px] font-bold leading-none tracking-tight">
            <span className="block truncate">{t(site.name)}</span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[.2em] text-gold-300 sm:block">{t('Borewell Drilling')}</span>
          </span>
        </Link>

        <nav aria-label={t('Main')} className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <HashLink key={l.to} to={l.to} className={linkCls(active === l.id)} aria-current={active === l.id ? 'location' : undefined}>
              {t(l.label)}
              {active === l.id && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            </HashLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href={phoneHref} className="hidden items-center gap-2 text-sm font-semibold text-white xl:flex">
            <Phone size={16} className="text-gold-300" aria-hidden /> {site.phone}
          </a>
          <Button to="/#contact" className="hidden sm:inline-flex">{t('Get a Free Quote')}</Button>
          <LanguageSwitcher />
          <button
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white lg:hidden"
            aria-label={open ? t('Close menu') : t('Open menu')}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label={t('Mobile')}
            className="container-x overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <ul className="flex flex-col gap-1 pb-6 pt-2">
              {[{ label: 'Home', to: '/', id: '' }, ...links].map((l) => (
                <li key={l.to}>
                  <HashLink to={l.to} className="block rounded-xl px-4 py-3.5 text-lg font-medium text-white/90 transition hover:bg-white/10">{t(l.label)}</HashLink>
                </li>
              ))}
              <li className="mt-3 grid grid-cols-2 gap-3">
                <Button to="/#contact" className="w-full">{t('Free Quote')}</Button>
                <Button href={phoneHref} variant="outline" className="w-full" icon={<Phone size={16} aria-hidden />}>{t('Call')}</Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
