import { StrictMode } from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Loader from '../../components/layout/Loader'
import ScrollManager from '../../components/layout/ScrollManager'
import PageHero from '../../components/layout/PageHero'
import PageTransition from '../../components/layout/PageTransition'
import FloatingActions from '../../components/floating/FloatingActions'
import { fullAddress, phoneHref, site } from '../../config/site'
import { services } from '../../data/services'
import { cities } from '../../data/cities'

const at = (ui: React.ReactElement, path = '/') => render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
const setScrollY = (y: number) => { Object.defineProperty(window, 'scrollY', { value: y, configurable: true }); fireEvent.scroll(window) }
afterEach(() => { setScrollY(0); document.body.innerHTML = ''; document.body.style.overflow = '' })

describe('Navbar', () => {
  it('shows the brand, six section links, a quote CTA and the phone number', () => {
    at(<Navbar />)
    expect(screen.getByRole('link', { name: `${site.name} – home` })).toHaveAttribute('href', '/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    const hrefs = within(nav).getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])
    expect(hrefs).toEqual([['About', '/#about'], ['Services', '/#services'], ['Projects', '/#projects'], ['Process', '/#process'], ['FAQ', '/#faq'], ['Contact', '/#contact']])
    expect(screen.getByRole('link', { name: 'Get a Free Quote' })).toHaveAttribute('href', '/#contact')
    expect(screen.getByRole('link', { name: new RegExp(site.phone.replace('+', '\\+')) })).toHaveAttribute('href', phoneHref)
  })

  it('is transparent at the top and gains a solid background once scrolled', () => {
    at(<Navbar />)
    const header = screen.getByRole('banner')
    expect(header.className).toContain('bg-transparent')
    setScrollY(120)
    expect(header.className).toContain('bg-navy-900/95')
    setScrollY(0)
    expect(header.className).toContain('bg-transparent')
  })

  describe('mobile menu', () => {
    it('toggles open and closed with correct aria state and label', async () => {
      at(<Navbar />)
      const toggle = screen.getByRole('button', { name: 'Open menu' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull()
      await userEvent.click(toggle)
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
      const mobile = screen.getByRole('navigation', { name: 'Mobile' })
      expect(within(mobile).getAllByRole('link').map((a) => a.textContent)).toEqual(['Home', 'About', 'Services', 'Projects', 'Process', 'FAQ', 'Contact', 'Free Quote', 'Call'])
      await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
      await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull())
    })
    it('locks page scroll while open', async () => {
      at(<Navbar />)
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
      expect(document.body.style.overflow).toBe('hidden')
      await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
      expect(document.body.style.overflow).toBe('')
    })
    it('closes on Escape and returns focus to the toggle', async () => {
      at(<Navbar />)
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull())
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
    })
    it('closes when the route changes', async () => {
      at(<><Navbar /><Link to="/about">elsewhere</Link></>)
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
      expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()
      await userEvent.click(screen.getByRole('link', { name: 'elsewhere' }))
      await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull())
    })
  })

  describe('active section highlight', () => {
    const sections = () => document.body.insertAdjacentHTML('beforeend', ['about', 'services', 'projects', 'process', 'faq', 'contact'].map((i) => `<section id="${i}"></section>`).join(''))
    it('marks the section under the header on the home page', () => {
      sections()
      at(<Navbar />)
      const current = within(screen.getByRole('navigation', { name: 'Main' })).getAllByRole('link').filter((a) => a.getAttribute('aria-current') === 'location')
      expect(current).toHaveLength(1)
      expect(current[0]).toHaveTextContent('Contact') // test observer reports the last section as visible
    })
    it('marks nothing on other pages', () => {
      sections()
      at(<Navbar />, '/about')
      expect(within(screen.getByRole('navigation', { name: 'Main' })).queryAllByRole('link').some((a) => a.hasAttribute('aria-current'))).toBe(false)
    })
  })
})

describe('Footer', () => {
  beforeEach(() => at(<Footer />))
  it('links to every service', () => {
    for (const s of services) expect(screen.getByRole('link', { name: s.title })).toHaveAttribute('href', `/services/${s.slug}`)
  })
  it('links to every service-area page', () => {
    for (const c of cities) expect(screen.getByRole('link', { name: `Borewell Drilling in ${c.name}` })).toHaveAttribute('href', `/borewell-drilling-in/${c.slug}`)
  })
  it('links to company pages and in-page sections', () => {
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'All Services' })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Work Process' })).toHaveAttribute('href', '/#process')
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/#faq')
  })
  it('shows contact details with working tel/mailto links', () => {
    expect(screen.getByRole('link', { name: site.phone })).toHaveAttribute('href', phoneHref)
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`)
    expect(screen.getByText(fullAddress())).toBeInTheDocument()
    expect(screen.getByText(site.hours)).toBeInTheDocument()
  })
  it('shows the current-year copyright and the no-guarantee disclaimer', () => {
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} ${site.name}`))).toBeInTheDocument()
    expect(screen.getByText(/no driller can guarantee water/i)).toBeInTheDocument()
  })
})

describe('Loader', () => {
  beforeEach(() => sessionStorage.clear())
  it('shows a status screen with the company name on the first visit, then dismisses itself', async () => {
    render(<Loader />)
    expect(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent(site.name)
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull(), { timeout: 4000 })
    expect(sessionStorage.getItem('loader:seen')).toBe('1')
  })
  it('does not show again in the same session', () => {
    sessionStorage.setItem('loader:seen', '1')
    render(<Loader />)
    expect(screen.queryByRole('status')).toBeNull()
  })
})

describe('ScrollManager', () => {
  const markReload = (on: boolean) =>
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue(on ? ([{ type: 'reload' }] as any) : [])
  const withTarget = (id: string) => {
    const scroll = vi.fn()
    document.body.insertAdjacentHTML('beforeend', `<div id="${id}"></div>`)
    document.getElementById(id)!.scrollIntoView = scroll
    return scroll
  }
  afterEach(() => { vi.restoreAllMocks(); history.replaceState(null, '', '/') })

  it('scrolls to the top on a route without a hash', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    at(<ScrollManager />, '/about')
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  })

  it("turns the browser's own scroll restoration off so it can't fight the app", () => {
    Object.defineProperty(history, 'scrollRestoration', { value: 'auto', writable: true, configurable: true })
    at(<ScrollManager />)
    expect(history.scrollRestoration).toBe('manual')
  })

  describe('fresh visit to a link with a #section (shared link)', () => {
    it('jumps straight to the section, without a long smooth scroll', async () => {
      markReload(false)
      const scroll = withTarget('faq')
      at(<ScrollManager />, '/#faq')
      await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' }))
    })
    it('re-aligns after the page finishes loading (images/fonts shift the layout)', async () => {
      markReload(false)
      Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true })
      const scroll = withTarget('about')
      at(<ScrollManager />, '/#about')
      await waitFor(() => expect(scroll).toHaveBeenCalled())
      scroll.mockClear()
      window.dispatchEvent(new Event('load'))
      expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
      Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true })
    })
    it('keeps retrying until a lazily-rendered target appears', async () => {
      markReload(false)
      const scroll = vi.fn()
      at(<ScrollManager />, '/#late')
      setTimeout(() => {
        document.body.insertAdjacentHTML('beforeend', '<div id="late"></div>')
        document.getElementById('late')!.scrollIntoView = scroll
      }, 200)
      await waitFor(() => expect(scroll).toHaveBeenCalled(), { timeout: 2000 })
    })
  })

  describe('page refresh', () => {
    it('lands at the top and does NOT jump to the old #section', async () => {
      markReload(true)
      const top = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const scroll = withTarget('services')
      history.replaceState(null, '', '/#services')
      at(<ScrollManager />, '/#services')
      expect(top).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 250))
      expect(scroll).not.toHaveBeenCalled()
    })
    it('removes the #section from the address bar so another refresh also starts at the top', () => {
      markReload(true)
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      history.replaceState(null, '', '/#services')
      at(<ScrollManager />, '/?x=1#services')
      expect(window.location.hash).toBe('')
    })
    it('survives React StrictMode double-running effects (dev)', async () => {
      markReload(true)
      const top = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const scroll = withTarget('services')
      render(<StrictMode><MemoryRouter initialEntries={['/#services']}><ScrollManager /></MemoryRouter></StrictMode>)
      await new Promise((r) => setTimeout(r, 250))
      expect(top).toHaveBeenCalled()
      expect(scroll).not.toHaveBeenCalled()
    })
    it('still scrolls to a section when you navigate to one afterwards (smoothly)', async () => {
      markReload(true)
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const scroll = withTarget('contact')
      at(<><ScrollManager /><Link to="/#contact">to contact</Link></>, '/')
      await userEvent.click(screen.getByRole('link', { name: 'to contact' }))
      await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' }))
    })
  })
})

describe('PageHero', () => {
  it('renders the page h1, subtitle and children', () => {
    at(<PageHero title="Our Services" subtitle="Everything you need"><button>CTA</button></PageHero>)
    expect(screen.getByRole('heading', { level: 1, name: 'Our Services' })).toBeInTheDocument()
    expect(screen.getByText('Everything you need')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'CTA' })).toBeInTheDocument()
  })
  it('builds a breadcrumb trail ending in the current page', () => {
    at(<PageHero title="X" crumbs={[{ label: 'Services', to: '/services' }, { label: 'Cleaning' }]} />)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(within(nav).getByText('Cleaning')).toHaveAttribute('aria-current', 'page')
    expect(within(nav).queryByRole('link', { name: 'Cleaning' })).toBeNull()
  })
  it('omits optional parts when not provided', () => {
    at(<PageHero title="X" />)
    expect(document.querySelectorAll('p')).toHaveLength(0)
  })
})

describe('PageTransition', () => {
  it('renders its children', () => {
    render(<PageTransition><p>page body</p></PageTransition>)
    expect(screen.getByText('page body')).toBeInTheDocument()
  })
})

describe('FloatingActions', () => {
  it('has a mobile Call Now link and a WhatsApp link', () => {
    render(<FloatingActions />)
    expect(screen.getByRole('link', { name: 'Call now' })).toHaveAttribute('href', phoneHref)
    const wa = screen.getByRole('link', { name: 'Chat on WhatsApp' })
    expect(wa.getAttribute('href')).toMatch(new RegExp(`^https://wa\\.me/${site.whatsappRaw}\\?text=`))
    expect(wa).toHaveAttribute('target', '_blank')
    expect(wa).toHaveAttribute('rel', 'noopener noreferrer')
  })
  it('shows the Call Now button on mobile only', () => {
    render(<FloatingActions />)
    expect(screen.getByRole('link', { name: 'Call now' }).className).toContain('md:hidden')
  })
  it('shows back-to-top only after scrolling and scrolls smoothly to the top', async () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(<FloatingActions />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull()
    act(() => setScrollY(800))
    const btn = await screen.findByRole('button', { name: 'Back to top' })
    await userEvent.click(btn)
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    act(() => setScrollY(100))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull())
  })
})
