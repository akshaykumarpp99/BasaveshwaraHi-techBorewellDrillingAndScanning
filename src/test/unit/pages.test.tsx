import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '../helpers'
import { site } from '../../config/site'
import { services } from '../../data/services'
import { cities } from '../../data/cities'

const h1 = () => screen.findByRole('heading', { level: 1 })

describe('Home page', () => {
  it('renders all ten sections in the requested order', async () => {
    const { container } = renderAt('/')
    await h1()
    const ids = [...container.querySelectorAll('main section[id]')].map((s) => s.id)
    expect(ids).toEqual(['hero', 'about', 'services', 'machinery', 'why-us', 'projects', 'process', 'testimonials', 'faq', 'contact'])
  })
  it('has a proper heading hierarchy (one h1, sections are h2, no skipped levels)', async () => {
    const { container } = renderAt('/')
    await h1()
    const levels = [...container.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]))
    expect(levels.filter((l) => l === 1)).toHaveLength(1)
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `heading #${i}`).toBeLessThanOrEqual(1)
  })
  it('gives every image alt text and explicit dimensions', async () => {
    const { container } = renderAt('/')
    await h1()
    const imgs = [...container.querySelectorAll('img')]
    expect(imgs.length).toBeGreaterThan(15)
    for (const img of imgs) {
      expect(img.getAttribute('alt'), img.src).toBeTruthy()
      expect(img.getAttribute('width'), img.src).toBeTruthy()
      expect(img.getAttribute('height'), img.src).toBeTruthy()
    }
  })
  it('lazy-loads every image except the hero', async () => {
    const { container } = renderAt('/')
    await h1()
    for (const img of container.querySelectorAll('img')) {
      if (img.closest('#hero')) expect(img.getAttribute('loading')).not.toBe('lazy')
      else expect(img.getAttribute('loading'), img.getAttribute('alt') ?? '').toBe('lazy')
    }
  })
  it('exposes landmarks: skip link, nav, main, footer', async () => {
    renderAt('/')
    await h1()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(2)
  })
})

describe('Service detail pages', () => {
  it.each(services)('/services/$slug shows its own content, breadcrumb, sidebar and pre-selected form', async (s) => {
    renderAt(`/services/${s.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: s.title })).toBeInTheDocument()
    expect(screen.getByText(s.overview)).toBeInTheDocument()
    for (const line of [...s.included, ...s.whenYouNeedIt]) expect(screen.getByText(line)).toBeInTheDocument()
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(crumbs).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    const sidebar = screen.getByRole('complementary', { name: 'Other services' })
    expect(within(sidebar).getAllByRole('link')).toHaveLength(services.length - 1)
    expect(within(sidebar).queryByRole('link', { name: s.title })).toBeNull()
    expect((screen.getByLabelText(/required service/i) as HTMLSelectElement).value).toBe(s.title)
  })
  it('sets a service-specific document title', async () => {
    renderAt('/services/borewell-cleaning')
    await waitFor(() => expect(document.title).toBe(`Borewell Cleaning in ${site.city} | ${site.name}`))
  })
  it('shows the 404 page for an unknown service', async () => {
    renderAt('/services/does-not-exist')
    expect(await screen.findByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
  })
})

describe('City landing pages', () => {
  it.each(cities)('/borewell-drilling-in/$slug targets the city and links to services and other areas', async (c) => {
    renderAt(`/borewell-drilling-in/${c.slug}`)
    expect(await screen.findByRole('heading', { level: 1, name: `Borewell Drilling Services in ${c.name}` })).toBeInTheDocument()
    const main = within(screen.getByRole('main'))
    for (const s of services) expect(main.getByRole('link', { name: new RegExp(`${s.title} in ${c.name}`) })).toHaveAttribute('href', `/services/${s.slug}`)
    const others = main.getAllByRole('link', { name: /^Borewell Drilling in / }).filter((a) => a.getAttribute('href')!.startsWith('/borewell-drilling-in/'))
    expect(others.some((a) => a.getAttribute('href') === `/borewell-drilling-in/${c.slug}`)).toBe(false)
    await waitFor(() => expect(document.title).toBe(`Borewell Drilling Services in ${c.name} | ${site.name}`))
  })
  it('shows the 404 page for an unknown city', async () => {
    renderAt('/borewell-drilling-in/atlantis')
    expect(await screen.findByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
  })
})

describe('Inner pages', () => {
  it.each([
    ['/about', `About ${site.name}`],
    ['/services', 'Our Borewell & Water Services'],
    ['/projects', 'Our Completed Projects'],
    ['/contact', 'Contact Us'],
  ])('%s renders its heading and a way to get a quote', async (path, title) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.queryAllByRole('link', { name: /get a free quote/i }).length + screen.queryAllByRole('button', { name: /submit enquiry/i }).length).toBeGreaterThan(0)
  })
  it('/services lists all 8 services as cards', async () => {
    renderAt('/services')
    await h1()
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })
  it('/projects shows the filterable gallery without the home-page "view all" link', async () => {
    renderAt('/projects')
    await h1()
    expect(screen.getByRole('group', { name: /filter projects/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view all projects/i })).toBeNull()
  })
  it('/contact has the form, the map and the FAQ', async () => {
    renderAt('/contact')
    await h1()
    expect(screen.getByRole('form', { name: 'Borewell enquiry form' })).toBeInTheDocument()
    expect(screen.getByTitle(/Map showing/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /how much does borewell drilling cost/i })).toBeInTheDocument()
  })
})

describe('404 page', () => {
  it('offers a way home, is marked noindex and does not claim to be a real page', async () => {
    renderAt('/nope/nothing')
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/')
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex'))
  })
})

describe('end-to-end navigation', () => {
  it('footer links take you to the right pages (client-side routing + page transitions)', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await h1()
    const footer = screen.getByRole('contentinfo')
    await user.click(within(footer).getByRole('link', { name: 'About Us' }))
    expect(await screen.findByRole('heading', { level: 1, name: `About ${site.name}` })).toBeInTheDocument()
    await user.click(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Borewell Cleaning' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Borewell Cleaning' })).toBeInTheDocument()
    await user.click(within(screen.getByRole('contentinfo')).getByRole('link', { name: `Borewell Drilling in ${cities[0].name}` }))
    expect(await screen.findByRole('heading', { level: 1, name: `Borewell Drilling Services in ${cities[0].name}` })).toBeInTheDocument()
  })
  it('a "Learn More" card opens that service page', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await h1()
    await user.click(screen.getByRole('link', { name: 'Learn more about Groundwater Survey' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Groundwater Survey' })).toBeInTheDocument()
  })
  it('the logo returns home from an inner page', async () => {
    const user = userEvent.setup()
    renderAt('/about')
    await screen.findByRole('heading', { level: 1, name: `About ${site.name}` })
    await user.click(within(screen.getByRole('banner')).getByRole('link', { name: `${site.name} – home` }))
    expect(await screen.findByRole('heading', { level: 1, name: /Delivering Reliable Water Solutions/ })).toBeInTheDocument()
  })
})
