import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from './helpers'
import { services } from '../data/services'
import { cities } from '../data/cities'
import { projects } from '../data/projects'
import { faqs } from '../data/content'

const routes = [
  '/', '/about', '/services', '/projects', '/contact',
  ...services.map((s) => `/services/${s.slug}`),
  ...cities.map((c) => `/borewell-drilling-in/${c.slug}`),
  '/this-page-does-not-exist',
]

describe('routes', () => {
  it.each(routes)('%s renders exactly one h1', async (path) => {
    const { container } = renderAt(path)
    await waitFor(() => expect(container.querySelectorAll('h1').length).toBe(1))
    expect(container.querySelector('h1')?.textContent?.trim().length).toBeGreaterThan(3)
  })

  it('unknown service and city slugs show the 404 page', async () => {
    renderAt('/services/nope')
    expect(await screen.findByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
  })
})

describe('home page', () => {
  it('renders every required section with the requested hero copy and CTAs', async () => {
    const { container } = renderAt('/')
    for (const id of ['hero', 'about', 'services', 'machinery', 'why-us', 'projects', 'process', 'testimonials', 'faq', 'contact'])
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Delivering Reliable Water Solutions Through Advanced Borewell Technology\./)
    for (const t of ['Get a Free Quote', 'Explore Our Services', 'Contact Us'])
      expect(screen.getAllByText(t).length).toBeGreaterThan(0)
    for (const s of services) expect(screen.getAllByText(s.title).length).toBeGreaterThan(0)
  })

  it('every internal link points at a real route or an existing section id', async () => {
    const { container } = renderAt('/')
    const valid = [/^\/$/, /^\/(about|services|projects|contact)$/, /^\/services\/[a-z-]+$/, /^\/borewell-drilling-in\/[a-z-]+$/]
    const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')!).filter((h) => h.startsWith('/') || h.startsWith('#'))
    expect(hrefs.length).toBeGreaterThan(30)
    for (const h of hrefs) {
      const [path, hash] = h.split('#')
      if (path) {
        expect(valid.some((r) => r.test(path)), `bad route ${h}`).toBe(true)
        if (/^\/services\//.test(path)) expect(services.some((s) => path.endsWith(s.slug))).toBe(true)
        if (/^\/borewell-drilling-in\//.test(path)) expect(cities.some((c) => path.endsWith(c.slug))).toBe(true)
      }
      if (hash && (!path || path === '/')) expect(container.querySelector(`#${hash}`), `missing #${hash}`).not.toBeNull()
    }
  })

  it('click-to-call and WhatsApp links are well-formed', () => {
    const { container } = renderAt('/')
    expect(container.querySelector('a[href^="tel:+"]')).not.toBeNull()
    expect(container.querySelector('a[href^="https://wa.me/"]')).not.toBeNull()
  })

  it('FAQ accordion toggles', async () => {
    renderAt('/')
    const user = userEvent.setup()
    const q = screen.getByRole('button', { name: faqs[1].q })
    expect(q).toHaveAttribute('aria-expanded', 'false')
    await user.click(q)
    expect(q).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(faqs[1].a)).toBeInTheDocument()
    await user.click(q)
    await waitFor(() => expect(screen.queryByText(faqs[1].a)).toBeNull())
  })

  it('project category filter narrows the list', async () => {
    renderAt('/')
    const user = userEvent.setup()
    const group = screen.getByRole('group', { name: /filter projects/i })
    const count = () => document.querySelectorAll('#projects article').length
    expect(count()).toBe(projects.length)
    await user.click(Array.from(group.querySelectorAll('button')).find((b) => b.textContent === 'Agricultural')!)
    await waitFor(() => expect(count()).toBe(projects.filter((p) => p.category === 'Agricultural').length))
    await user.click(Array.from(group.querySelectorAll('button')).find((b) => b.textContent === 'All')!)
    await waitFor(() => expect(count()).toBe(projects.length))
  })

  it('project image opens a lightbox that closes on Escape', async () => {
    renderAt('/')
    const user = userEvent.setup()
    await user.click(screen.getAllByRole('button', { name: /^Open image:/ })[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('machinery gallery opens a preview', async () => {
    renderAt('/')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Preview Borewell Drilling Rigs/ }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})

describe('enquiry form', () => {
  const fill = async (user: ReturnType<typeof userEvent.setup>, o: Record<string, string>) => {
    for (const [label, v] of Object.entries(o)) {
      const el = screen.getByLabelText(new RegExp(label, 'i'))
      if (el.tagName === 'SELECT') await user.selectOptions(el, v)
      else await user.type(el, v)
    }
  }

  it('shows validation errors for an empty submit and does not send', async () => {
    renderAt('/')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))
    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument()
    expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/^please tell us your location$/i)).toBeInTheDocument()
    expect(screen.getByText(/please choose a service/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects a bad phone, email and depth', async () => {
    renderAt('/')
    const user = userEvent.setup()
    await fill(user, { 'full name': 'Asha Rao', 'mobile number': '12345', 'email address': 'nope', location: 'Pune', 'expected borewell depth': 'abc' })
    await user.selectOptions(screen.getByLabelText(/required service/i), 'Borewell Drilling')
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))
    expect(await screen.findByText(/valid 10-digit mobile/i)).toBeInTheDocument()
    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/depth in feet/i)).toBeInTheDocument()
  })

  it('accepts a valid enquiry and, with no backend configured, offers WhatsApp/email hand-off', async () => {
    renderAt('/')
    const user = userEvent.setup()
    await fill(user, { 'full name': 'Asha Rao', 'mobile number': '+91 98765 43210', location: 'Pune', 'expected borewell depth': '300' })
    await user.selectOptions(screen.getByLabelText(/required service/i), 'Borewell Drilling')
    await user.click(screen.getByRole('button', { name: /submit enquiry/i }))
    expect(await screen.findByText(/details ready/i)).toBeInTheDocument()
    const wa = screen.getByRole('link', { name: /send on whatsapp/i })
    expect(decodeURIComponent(wa.getAttribute('href')!)).toContain('Name: Asha Rao')
  })

  it('service detail page pre-selects its service in the form', async () => {
    renderAt('/services/borewell-cleaning')
    const select = (await screen.findByLabelText(/required service/i)) as HTMLSelectElement
    expect(select.value).toBe('Borewell Cleaning')
  })
})

describe('seo', () => {
  it('home sets title, canonical and LocalBusiness + FAQ structured data', async () => {
    renderAt('/')
    await waitFor(() => expect(document.title).toMatch(/Borewell Drilling Services in .* \| /))
    expect(document.querySelector('link[rel="canonical"]')).not.toBeNull()
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent!))
    expect(ld.some((j) => [j['@type']].flat().includes('LocalBusiness'))).toBe(true)
    expect(ld.some((j) => j['@type'] === 'FAQPage')).toBe(true)
  })

  it('city landing page targets the city in its title', async () => {
    renderAt(`/borewell-drilling-in/${cities[1].slug}`)
    await waitFor(() => expect(document.title).toContain(`Borewell Drilling Services in ${cities[1].name}`))
  })
})
