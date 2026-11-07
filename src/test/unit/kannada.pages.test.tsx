import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderAt } from '../helpers'
import { kn } from '../../i18n/kn'
import { site } from '../../config/site'
import { services } from '../../data/services'
import { cities } from '../../data/cities'
import { faqs } from '../../data/content'

/** Text that is allowed to stay in English/Latin: contact details, units and the language labels. */
const ALLOWED = [site.email, site.phone, 'you@example.com', '98765 43210', 'EN', 'English', 'Google Maps', 'Website']

/** Finds visible text, alt/aria/title/placeholder values and <option>s that still read as English phrases. */
function untranslated(root: ParentNode): string[] {
  const found = new Set<string>()
  const phrase = /[A-Za-z]{3,}\s+[A-Za-z]{3,}/
  const check = (s: string | null | undefined) => {
    let text = (s ?? '').replace(/\s+/g, ' ').trim()
    for (const a of ALLOWED) text = text.split(a).join('')
    if (phrase.test(text)) found.add(text)
  }
  const walker = document.createTreeWalker(root as Node, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const p = (n as Text).parentElement
    if (p && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.tagName)) check(n.textContent)
  }
  for (const el of (root as Element).querySelectorAll('[alt],[aria-label],[title],[placeholder]'))
    for (const a of ['alt', 'aria-label', 'title', 'placeholder']) check(el.getAttribute(a))
  return [...found]
}

const routes = [
  '/', '/about', '/services', '/projects', '/contact',
  ...services.map((s) => `/services/${s.slug}`),
  ...cities.map((c) => `/borewell-drilling-in/${c.slug}`),
  '/not-a-page',
]

describe('Kannada mode: every page is fully translated', () => {
  it.each(routes)('%s has no leftover English phrases', async (path) => {
    const { container } = renderAt(path, 'kn')
    await screen.findByRole('heading', { level: 1 })
    expect(untranslated(container)).toEqual([])
  })

  it('the home page headline reads in Kannada, with the right word order', async () => {
    renderAt('/', 'kn')
    const h1 = await screen.findByRole('heading', { level: 1 })
    expect(h1.textContent).toBe(`${kn['Delivering Reliable']} ${kn['Water Solutions']} ${kn['Through Advanced Borewell Technology.']}`)
    expect(h1.textContent).toMatch(/[ಀ-೿]/)
  })

  it('the document language and title are Kannada', async () => {
    renderAt('/', 'kn')
    await screen.findByRole('heading', { level: 1 })
    expect(document.documentElement.lang).toBe('kn')
    await waitFor(() => expect(document.title).toMatch(/[ಀ-೿]/))
  })

  it('English mode is unchanged (no Kannada leaks into English pages)', async () => {
    const { container } = renderAt('/', 'en')
    await screen.findByRole('heading', { level: 1 })
    expect(/[ಀ-೿]/.test(container.querySelector('main')!.textContent ?? '')).toBe(false)
  })
})

describe('Kannada mode: interactive states are translated too', () => {
  it('form validation errors, success hand-off and placeholders', async () => {
    const user = userEvent.setup()
    const { container } = renderAt('/contact', 'kn')
    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('button', { name: kn['Submit Enquiry'] }))
    expect(await screen.findByText(kn['Please enter your full name'])).toBeInTheDocument()
    expect(screen.getByText(kn['Mobile number is required'])).toBeInTheDocument()
    expect(screen.getByText(kn['Please tell us your location'])).toBeInTheDocument()
    expect(screen.getByText(kn['Please choose a service'])).toBeInTheDocument()
    expect(untranslated(container)).toEqual([])

    await user.type(screen.getByLabelText(new RegExp(kn['Full name'])), 'Asha Rao')
    await user.type(screen.getByLabelText(new RegExp(kn['Mobile number'])), '9876543210')
    await user.type(screen.getByLabelText(new RegExp(kn['Location'])), 'Pune')
    await user.selectOptions(screen.getByLabelText(new RegExp(kn['Required service'])), 'Borewell Drilling')
    await user.click(screen.getByRole('button', { name: kn['Submit Enquiry'] }))
    expect(await screen.findByText(kn['Details ready.'])).toBeInTheDocument()
    expect(untranslated(container)).toEqual([])
  })

  it('service dropdown shows Kannada labels but submits the English service name', async () => {
    renderAt('/contact', 'kn')
    await screen.findByRole('heading', { level: 1 })
    const select = screen.getByLabelText(new RegExp(kn['Required service'])) as HTMLSelectElement
    const labels = Array.from(select.options).map((o) => o.textContent)
    expect(labels).toContain(kn['Borewell Cleaning'])
    expect(Array.from(select.options).map((o) => o.value)).toContain('Borewell Cleaning')
  })

  it('WhatsApp enquiry text sent to the business stays in English (business-facing)', async () => {
    const user = userEvent.setup()
    renderAt('/contact', 'kn')
    await screen.findByRole('heading', { level: 1 })
    await user.type(screen.getByLabelText(new RegExp(kn['Full name'])), 'Ravi')
    const wa = screen.getByRole('link', { name: new RegExp(kn['WhatsApp Enquiry']) })
    expect(decodeURIComponent(wa.getAttribute('href')!)).toContain('Name: Ravi')
  })

  it('FAQ questions and answers are Kannada', async () => {
    const user = userEvent.setup()
    renderAt('/', 'kn')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('button', { name: kn[faqs[0].q] })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: kn[faqs[1].q] }))
    expect(await screen.findByText(kn[faqs[1].a])).toBeInTheDocument()
  })

  it('mobile menu, gallery preview and project filters are Kannada', async () => {
    const user = userEvent.setup()
    const { container } = renderAt('/', 'kn')
    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('button', { name: kn['Open menu'] }))
    expect(screen.getByRole('navigation', { name: kn['Mobile'] })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: kn['Close menu'] }))

    await user.click(screen.getByRole('button', { name: kn['Preview {title}'].replace('{title}', kn['Borewell Drilling Rigs']) }))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: kn['Close preview'] })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    const group = screen.getByRole('group', { name: kn['Filter projects by category'] })
    await user.click(within(group).getByRole('button', { name: kn['Agricultural'] }))
    expect(untranslated(container)).toEqual([])
  })

  it('floating buttons and the footer are Kannada', async () => {
    renderAt('/', 'kn')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByRole('link', { name: kn['Chat on WhatsApp'] })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: kn['Call now'] })).toBeInTheDocument()
    expect(within(screen.getByRole('contentinfo')).getByText(kn['Service Areas'])).toBeInTheDocument()
  })

  it('switching language on the page changes everything live and keeps the route', async () => {
    const user = userEvent.setup()
    renderAt('/services/borewell-cleaning', 'en')
    expect(await screen.findByRole('heading', { level: 1, name: 'Borewell Cleaning' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'ಕನ್ನಡ' })[0])
    expect(await screen.findByRole('heading', { level: 1, name: kn['Borewell Cleaning'] })).toBeInTheDocument()
    expect(screen.getByText(kn[services.find((s) => s.slug === 'borewell-cleaning')!.overview])).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'English' })[0])
    expect(await screen.findByRole('heading', { level: 1, name: 'Borewell Cleaning' })).toBeInTheDocument()
  })
})
