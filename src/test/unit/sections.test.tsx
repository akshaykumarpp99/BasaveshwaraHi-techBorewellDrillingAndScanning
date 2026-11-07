import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Hero from '../../components/sections/Hero'
import About from '../../components/sections/About'
import Services from '../../components/sections/Services'
import Machinery from '../../components/sections/Machinery'
import WhyChooseUs from '../../components/sections/WhyChooseUs'
import Projects from '../../components/sections/Projects'
import Process from '../../components/sections/Process'
import Testimonials from '../../components/sections/Testimonials'
import FAQ from '../../components/sections/FAQ'
import Contact from '../../components/sections/Contact'
import CTABanner from '../../components/sections/CTABanner'
import { phoneHref, site } from '../../config/site'
import { services } from '../../data/services'
import { equipment } from '../../data/equipment'
import { projectCategories, projects } from '../../data/projects'
import { faqs, processSteps, testimonials, whyUs } from '../../data/content'
import { images } from '../../data/images'

const at = (ui: React.ReactElement, path = '/') => render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)

describe('Hero', () => {
  beforeEach(() => at(<Hero />))
  it('has the single h1 headline and supporting text from the brief', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Delivering Reliable Water Solutions Through Advanced Borewell Technology.')
    expect(screen.getByText('Your trusted partner for borewell drilling, groundwater solutions, and professional drilling services.')).toBeInTheDocument()
  })
  it('has the three CTAs, each wired to a real target', () => {
    expect(screen.getByRole('link', { name: 'Get a Free Quote' })).toHaveAttribute('href', '/#contact')
    expect(screen.getByRole('link', { name: 'Explore Our Services' })).toHaveAttribute('href', '/#services')
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', phoneHref)
  })
  it('shows the four animated stats with accessible values', () => {
    for (const s of site.stats) {
      expect(screen.getByText(s.label)).toBeInTheDocument()
      expect(screen.getByLabelText(`${s.value}${s.suffix}`)).toBeInTheDocument()
    }
  })
  it('loads the hero image eagerly with an alt text', () => {
    const img = screen.getByAltText(/drilling rig/i)
    expect(img).toHaveAttribute('src', images.hero)
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })
  it('is a labelled landmark region', () => expect(document.getElementById('hero')).toHaveAttribute('aria-labelledby', 'hero-title'))
})

describe('About', () => {
  beforeEach(() => at(<About />))
  it('covers overview, mission, vision, quality & safety, equipment and team', () => {
    expect(screen.getByRole('heading', { level: 2, name: /engineering, not guesswork/i })).toBeInTheDocument()
    for (const h of ['Our Mission', 'Our Vision', 'Quality & Safety', 'Advanced Equipment', 'Experienced Technical Team'])
      expect(screen.getByRole('heading', { name: h })).toBeInTheDocument()
  })
  it('shows the configured years of experience', () => {
    const years = site.stats.find((s) => /year/i.test(s.label))!
    expect(screen.getAllByText(new RegExp(`${years.value}\\${years.suffix}`)).length).toBeGreaterThan(0)
  })
  it('has descriptive alt text on both photos', () => {
    expect(screen.getByAltText(new RegExp(site.name))).toHaveAttribute('src', images.aboutMain)
    expect(screen.getByAltText('Technical drilling team')).toHaveAttribute('src', images.aboutTeam)
  })
})

describe('Services', () => {
  it('renders a card for each of the 8 services with image, title, description and Learn More', () => {
    at(<Services />)
    expect(screen.getAllByRole('article')).toHaveLength(8)
    for (const s of services) {
      const card = screen.getByRole('heading', { level: 3, name: s.title }).closest('article')!
      expect(within(card).getByText(s.short)).toBeInTheDocument()
      expect(within(card).getByRole('img')).toHaveAttribute('src', images[s.image])
      expect(within(card).getByRole('link', { name: `Learn more about ${s.title}` })).toHaveAttribute('href', `/services/${s.slug}`)
    }
  })
  it('has a section heading when standalone', () => {
    at(<Services />)
    expect(screen.getByRole('heading', { level: 2, name: /complete borewell/i })).toBeInTheDocument()
  })
  it('uses an sr-only heading (no visible duplicate) when embedded in a page', () => {
    at(<Services asPageContent />)
    expect(screen.getByRole('heading', { level: 2, name: 'All services' })).toHaveClass('sr-only')
    expect(screen.queryByText('Our Services')).toBeNull()
  })
})

describe('Machinery', () => {
  it('shows all 5 equipment categories', () => {
    at(<Machinery />)
    for (const e of equipment) expect(screen.getByRole('button', { name: `Preview ${e.title}` })).toBeInTheDocument()
  })
  it('opens a preview for the clicked item, navigates, and closes', async () => {
    const user = userEvent.setup()
    at(<Machinery />)
    await user.click(screen.getByRole('button', { name: 'Preview Compressor Machines' }))
    expect(await screen.findByRole('dialog', { name: 'Compressor Machines' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('dialog', { name: 'Water Tankers' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

describe('WhyChooseUs', () => {
  it('lists the 7 strengths plus a quote CTA', () => {
    at(<WhyChooseUs />)
    for (const w of whyUs) expect(screen.getByRole('heading', { level: 3, name: w.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get a Free Quote' })).toHaveAttribute('href', '/#contact')
  })
})

describe('Projects', () => {
  const cards = () => document.querySelectorAll('#projects article')
  const filterBtn = (name: string) => within(screen.getByRole('group', { name: /filter projects/i })).getByRole('button', { name })

  it('shows every project with location, depth, drilling type and description', () => {
    at(<Projects />)
    expect(cards()).toHaveLength(projects.length)
    const p = projects[0]
    const card = screen.getAllByRole('heading', { level: 3, name: p.title })[0].closest('article')!
    expect(card).toHaveTextContent(p.location)
    expect(card).toHaveTextContent(`Depth: ${p.depth}`)
    expect(card).toHaveTextContent(p.drillingType)
    expect(card).toHaveTextContent(p.description)
  })
  it('offers All + the four category filters with All pressed initially', () => {
    at(<Projects />)
    expect(filterBtn('All')).toHaveAttribute('aria-pressed', 'true')
    for (const c of projectCategories) expect(filterBtn(c)).toHaveAttribute('aria-pressed', 'false')
  })
  it.each(projectCategories)('filters to only %s projects and updates the live region', async (cat) => {
    at(<Projects />)
    await userEvent.click(filterBtn(cat))
    const expected = projects.filter((p) => p.category === cat)
    await waitFor(() => expect(cards()).toHaveLength(expected.length))
    expect(filterBtn(cat)).toHaveAttribute('aria-pressed', 'true')
    expect(filterBtn('All')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText(`${expected.length} projects shown`)).toBeInTheDocument()
    for (const a of cards()) expect(a).toHaveTextContent(cat)
  })
  it('marks sample projects visibly', () => {
    at(<Projects />)
    expect(screen.getAllByText('Sample')).toHaveLength(projects.filter((p) => p.isSample).length)
  })
  it('opens a lightbox of the filtered list, starting at the clicked project', async () => {
    const user = userEvent.setup()
    at(<Projects />)
    await user.click(filterBtn('Agricultural'))
    const ag = projects.filter((p) => p.category === 'Agricultural')
    await waitFor(() => expect(cards()).toHaveLength(ag.length))
    await user.click(screen.getAllByRole('button', { name: /^Open image:/ })[1])
    expect(await screen.findByRole('dialog', { name: ag[1].title })).toBeInTheDocument()
    expect(screen.getByText(`2 / ${ag.length}`)).toBeInTheDocument()
  })
  it('links to the full projects page only when embedded on the home page', () => {
    const { unmount } = at(<Projects />)
    expect(screen.getByRole('link', { name: /View All Projects/ })).toHaveAttribute('href', '/projects')
    unmount()
    at(<Projects asPageContent />)
    expect(screen.queryByRole('link', { name: /View All Projects/ })).toBeNull()
  })
})

describe('Process', () => {
  it('shows the 6 steps in order, numbered 1–6', () => {
    at(<Process />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(6)
    processSteps.forEach((s, i) => {
      expect(items[i]).toHaveTextContent(s.title)
      expect(items[i]).toHaveTextContent(s.text)
      expect(items[i]).toHaveTextContent(String(i + 1))
    })
  })
  it('is an ordered list (semantic timeline)', () => {
    at(<Process />)
    expect(document.querySelector('ol')).not.toBeNull()
  })
})

describe('Testimonials', () => {
  afterEach(() => vi.useRealTimers())
  const slideLabel = () => screen.getByRole('group', { name: /\d of \d/ }).getAttribute('aria-label')

  it('shows the first testimonial with name, location, text, stars and a Sample badge', () => {
    render(<Testimonials />)
    const t = testimonials[0]
    expect(screen.getByText(`“${t.text}”`)).toBeInTheDocument()
    expect(screen.getByText(t.location)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: `${t.rating} out of 5 stars` })).toBeInTheDocument()
    expect(screen.getByText('Sample')).toBeInTheDocument()
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`)
  })
  it('next and previous buttons move through slides and wrap', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)
    await user.click(screen.getByRole('button', { name: 'Next testimonial' }))
    await waitFor(() => expect(slideLabel()).toBe(`2 of ${testimonials.length}`))
    await user.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    await waitFor(() => expect(slideLabel()).toBe(`1 of ${testimonials.length}`))
    await user.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    await waitFor(() => expect(slideLabel()).toBe(`${testimonials.length} of ${testimonials.length}`))
  })
  it('dots jump to a slide and reflect selection', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)
    await user.click(screen.getByRole('tab', { name: 'Show testimonial 3' }))
    await waitFor(() => expect(slideLabel()).toBe(`3 of ${testimonials.length}`))
    expect(screen.getByRole('tab', { name: 'Show testimonial 3' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Show testimonial 1' })).toHaveAttribute('aria-selected', 'false')
  })
  it('has a pause/resume control for automatic sliding', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)
    await user.click(screen.getByRole('button', { name: 'Pause automatic sliding' }))
    expect(screen.getByRole('button', { name: 'Resume automatic sliding' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Resume automatic sliding' }))
    expect(screen.getByRole('button', { name: 'Pause automatic sliding' })).toBeInTheDocument()
  })
  it('slides automatically after a few seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<Testimonials />)
    await act(async () => { await vi.advanceTimersByTimeAsync(6500) })
    await waitFor(() => expect(slideLabel()).toBe(`2 of ${testimonials.length}`))
  })
  it('does not slide while hovered, and sliding resumes when the pointer leaves', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<Testimonials />)
    const carousel = screen.getByRole('group', { name: 'Customer testimonials' })
    fireEvent.mouseEnter(carousel)
    await act(async () => { await vi.advanceTimersByTimeAsync(20000) })
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`)
    fireEvent.mouseLeave(carousel)
    // step through fake time until the slide changes (6s interval + exit animation), up to 15s
    for (let waited = 0; waited < 15000 && slideLabel() === `1 of ${testimonials.length}`; waited += 500) {
      await act(async () => { await vi.advanceTimersByTimeAsync(500) })
    }
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`)
  })
  it('is exposed as a labelled carousel', () => {
    render(<Testimonials />)
    expect(screen.getByRole('group', { name: 'Customer testimonials' })).toHaveAttribute('aria-roledescription', 'carousel')
  })
})

describe('FAQ', () => {
  it('shows all questions in an accordion plus call and WhatsApp shortcuts', () => {
    render(<FAQ />)
    for (const f of faqs) expect(screen.getByRole('button', { name: f.q })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Call Us' })).toHaveAttribute('href', phoneHref)
    expect(screen.getByRole('link', { name: 'WhatsApp' }).getAttribute('href')).toContain('wa.me')
  })
})

describe('Contact', () => {
  it('shows every way to reach the company', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: new RegExp(site.phone.replace('+', '\\+')) })).toHaveAttribute('href', phoneHref)
    expect(screen.getByRole('link', { name: /Chat with us/ }).getAttribute('href')).toContain('wa.me')
    expect(screen.getByRole('link', { name: new RegExp(site.email) })).toHaveAttribute('href', `mailto:${site.email}`)
    expect(screen.getByText(site.hours)).toBeInTheDocument()
  })
  it('embeds an accessible Google Map and an Open-in-Maps link', () => {
    render(<Contact />)
    const map = screen.getByTitle(new RegExp(`Map showing ${site.name}`))
    expect(map).toHaveAttribute('src', site.mapEmbedUrl)
    expect(map).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('link', { name: /Open in Google Maps/ })).toHaveAttribute('href', site.mapLinkUrl)
  })
  it('includes the enquiry form and can pre-select a service', () => {
    render(<Contact defaultService="Groundwater Survey" />)
    expect((screen.getByLabelText(/required service/i) as HTMLSelectElement).value).toBe('Groundwater Survey')
  })
  it('hides the visual heading (keeps an sr-only one) when embedded in a page', () => {
    render(<Contact asPageContent />)
    expect(screen.getByRole('heading', { level: 2, name: /enquiry form and contact details/i })).toHaveClass('sr-only')
    expect(screen.queryByText('Get your free borewell quote')).toBeNull()
  })
})

describe('CTABanner', () => {
  it('has default copy and links to the contact page and phone', () => {
    at(<CTABanner />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Need water?')
    expect(screen.getByRole('link', { name: 'Get a Free Quote' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: site.phone })).toHaveAttribute('href', phoneHref)
  })
  it('accepts custom title and text', () => {
    at(<CTABanner title="Custom title" text="Custom text" />)
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeInTheDocument()
    expect(screen.getByText('Custom text')).toBeInTheDocument()
  })
})
