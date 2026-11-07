import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from '../../components/ui/Button'
import HashLink from '../../components/ui/HashLink'
import Reveal from '../../components/ui/Reveal'
import SectionHeading from '../../components/ui/SectionHeading'
import Counter from '../../components/ui/Counter'
import Accordion from '../../components/ui/Accordion'
import Lightbox from '../../components/ui/Lightbox'
import WaveDivider from '../../components/ui/WaveDivider'

const inRouter = (ui: React.ReactElement, path = '/') => render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
const Where = () => { const l = useLocation(); return <p data-testid="where">{l.pathname}{l.hash}</p> }

describe('Button', () => {
  it('renders a <button type=button> by default and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    const b = screen.getByRole('button', { name: 'Save' })
    expect(b).toHaveAttribute('type', 'button')
    await userEvent.click(b)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('supports type=submit and disabled', async () => {
    const onClick = vi.fn()
    render(<Button type="submit" disabled onClick={onClick}>Go</Button>)
    const b = screen.getByRole('button', { name: 'Go' })
    expect(b).toHaveAttribute('type', 'submit')
    expect(b).toBeDisabled()
    await userEvent.click(b)
    expect(onClick).not.toHaveBeenCalled()
  })
  it('renders an internal link for `to`', () => {
    inRouter(<Button to="/services">Services</Button>)
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
  })
  it('opens http(s) links in a new tab safely', () => {
    render(<Button href="https://example.com">Out</Button>)
    const a = screen.getByRole('link', { name: 'Out' })
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
  })
  it.each(['tel:+911234567890', 'mailto:a@b.co'])('keeps %s in the same tab', (href) => {
    render(<Button href={href}>X</Button>)
    const a = screen.getByRole('link', { name: 'X' })
    expect(a).toHaveAttribute('href', href)
    expect(a).not.toHaveAttribute('target')
  })
  it('applies variant and size styling and an icon', () => {
    const { rerender } = render(<Button variant="secondary" size="lg" icon={<Plus data-testid="ic" />}>A</Button>)
    const b = screen.getByRole('button')
    expect(b.className).toContain('bg-navy-900')
    expect(b.className).toContain('px-7')
    expect(screen.getByTestId('ic')).toBeInTheDocument()
    rerender(<Button variant="primary">A</Button>)
    expect(screen.getByRole('button').className).toContain('from-gold-300')
    rerender(<Button variant="outline" className="extra">A</Button>)
    expect(screen.getByRole('button').className).toContain('extra')
  })
  it('exposes aria-label', () => {
    render(<Button aria-label="Close">x</Button>)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})

describe('HashLink', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('smooth-scrolls instead of navigating when the target is on the current page', async () => {
    const scroll = vi.fn()
    inRouter(
      <>
        <section id="faq" ref={(el) => { if (el) el.scrollIntoView = scroll }} />
        <HashLink to="/#faq">FAQ</HashLink>
        <Where />
      </>
    )
    await userEvent.click(screen.getByRole('link', { name: 'FAQ' }))
    expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(window.location.hash).toBe('#faq')
    expect(screen.getByTestId('where')).toHaveTextContent('/') // router did not navigate
  })
  it('re-scrolls on a second click of the same anchor', async () => {
    const scroll = vi.fn()
    inRouter(<><section id="a" ref={(el) => { if (el) el.scrollIntoView = scroll }} /><HashLink to="/#a">go</HashLink></>)
    await userEvent.click(screen.getByRole('link'))
    await userEvent.click(screen.getByRole('link'))
    expect(scroll).toHaveBeenCalledTimes(2)
  })
  it('works for hash-only links on a sub-page', async () => {
    const scroll = vi.fn()
    inRouter(<><div id="enquire" ref={(el) => { if (el) el.scrollIntoView = scroll }} /><HashLink to="#enquire">Quote</HashLink></>, '/services/x')
    await userEvent.click(screen.getByRole('link'))
    expect(scroll).toHaveBeenCalled()
  })
  it('navigates normally when the link points to another page', async () => {
    inRouter(
      <Routes>
        <Route path="/" element={<><HashLink to="/about#team">Go</HashLink><Where /></>} />
        <Route path="/about" element={<Where />} />
      </Routes>
    )
    await userEvent.click(screen.getByRole('link', { name: 'Go' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/about#team')
  })
  it('navigates (no scroll) when the anchor does not exist on this page', async () => {
    inRouter(<><HashLink to="/#ghost">Ghost</HashLink><Where /></>)
    await userEvent.click(screen.getByRole('link'))
    expect(screen.getByTestId('where')).toHaveTextContent('/#ghost')
  })
  it('still calls a custom onClick', async () => {
    const onClick = vi.fn()
    inRouter(<HashLink to="/x" onClick={onClick}>x</HashLink>)
    await userEvent.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalled()
  })
})

describe('Reveal', () => {
  it('renders children in a div by default', () => {
    const { container } = render(<Reveal className="c"><span>hi</span></Reveal>)
    expect(screen.getByText('hi')).toBeInTheDocument()
    expect(container.firstElementChild?.tagName).toBe('DIV')
    expect(container.firstElementChild).toHaveClass('c')
  })
  it('can render as a list item', () => {
    const { container } = render(<ul><Reveal as="li">x</Reveal></ul>)
    expect(container.querySelector('li')).not.toBeNull()
  })
  it.each(['up', 'left', 'right'] as const)('accepts direction=%s', (d) => {
    render(<Reveal direction={d} delay={0.2}>ok</Reveal>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})

describe('SectionHeading', () => {
  it('renders eyebrow, title (h2 by default) and subtitle', () => {
    render(<SectionHeading eyebrow="About" title="Big title" subtitle="Sub" id="t" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Big title' })).toHaveAttribute('id', 't')
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })
  it('omits the subtitle when none is given', () => {
    render(<SectionHeading eyebrow="E" title="T" />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(document.querySelectorAll('p')).toHaveLength(0)
  })
  it('supports left alignment, light theme and compact spacing', () => {
    const { container } = render(<SectionHeading eyebrow="E" title="T" align="left" light compact />)
    const wrap = container.firstElementChild!
    expect(wrap.className).toContain('mb-6')
    expect(wrap.className).not.toContain('text-center')
    expect(screen.getByRole('heading').className).toContain('text-white')
  })
  it('centres by default', () => {
    const { container } = render(<SectionHeading eyebrow="E" title="T" />)
    expect(container.firstElementChild!.className).toContain('text-center')
  })
})

describe('Counter', () => {
  it('counts up to its value with a suffix once visible, and labels it accessibly', async () => {
    render(<Counter value={1000} suffix="+" />)
    expect(screen.getByLabelText('1000+')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('1,000+')).toBeInTheDocument(), { timeout: 4000 })
  })
  it('formats with Indian digit grouping', async () => {
    render(<Counter value={150000} />)
    await waitFor(() => expect(screen.getByText('1,50,000')).toBeInTheDocument(), { timeout: 4000 })
  })
  it('passes className through', () => {
    render(<Counter value={1} className="big" />)
    expect(screen.getByLabelText('1')).toHaveClass('big')
  })
})

describe('Accordion', () => {
  const items = [{ q: 'Q1?', a: 'Answer one' }, { q: 'Q2?', a: 'Answer two' }, { q: 'Q3?', a: 'Answer three' }]

  it('opens the first item by default', () => {
    render(<Accordion items={items} />)
    expect(screen.getByRole('button', { name: 'Q1?' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Answer one')).toBeInTheDocument()
    expect(screen.queryByText('Answer two')).toBeNull()
  })
  it('keeps only one item open at a time', async () => {
    render(<Accordion items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Q2?' }))
    expect(screen.getByRole('button', { name: 'Q2?' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Q1?' })).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(screen.queryByText('Answer one')).toBeNull())
    expect(screen.getByText('Answer two')).toBeInTheDocument()
  })
  it('collapses an open item when clicked again', async () => {
    render(<Accordion items={items} />)
    await userEvent.click(screen.getByRole('button', { name: 'Q1?' }))
    await waitFor(() => expect(screen.queryByText('Answer one')).toBeNull())
  })
  it('wires aria-controls to a labelled region', () => {
    render(<Accordion items={items} />)
    const btn = screen.getByRole('button', { name: 'Q1?' })
    const region = document.getElementById(btn.getAttribute('aria-controls')!)!
    expect(region).toHaveAttribute('role', 'region')
    expect(region).toHaveAttribute('aria-labelledby', btn.id)
  })
  it('is keyboard operable', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    await user.tab()
    await user.keyboard('{Tab}{Enter}')
    expect(screen.getByRole('button', { name: 'Q2?' })).toHaveAttribute('aria-expanded', 'true')
  })
  it('renders each question as a heading', () => {
    render(<Accordion items={items} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })
})

describe('Lightbox', () => {
  const items = [
    { src: '/a.webp', alt: 'A alt', title: 'Alpha', caption: 'first' },
    { src: '/b.webp', alt: 'B alt', title: 'Beta' },
    { src: '/c.webp', alt: 'C alt', title: 'Gamma', caption: 'third' },
  ]
  const setup = (index = 0, over: Partial<React.ComponentProps<typeof Lightbox>> = {}) => {
    const onIndex = vi.fn(), onClose = vi.fn()
    render(<Lightbox items={items} index={index} onIndex={onIndex} onClose={onClose} {...over} />)
    return { onIndex, onClose }
  }
  afterEach(() => { document.body.style.overflow = '' })

  it('renders an accessible modal dialog with the current image, title, caption and counter', () => {
    setup(0)
    const dlg = screen.getByRole('dialog', { name: 'Alpha' })
    expect(dlg).toHaveAttribute('aria-modal', 'true')
    expect(within(dlg).getByRole('img', { name: 'A alt' })).toHaveAttribute('src', '/a.webp')
    expect(within(dlg).getByText('first')).toBeInTheDocument()
    expect(within(dlg).getByText('1 / 3')).toBeInTheDocument()
  })
  it('renders into document.body (portal) and locks page scroll', () => {
    const { container } = render(<Lightbox items={items} index={0} onIndex={() => {}} onClose={() => {}} />)
    expect(container.querySelector('[role=dialog]')).toBeNull()
    expect(document.body.querySelector('[role=dialog]')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
  })
  it('moves focus to the close button', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Close preview' })).toHaveFocus()
  })
  it('next/prev buttons wrap around', async () => {
    const a = setup(2)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(a.onIndex).toHaveBeenLastCalledWith(0)
  })
  it('prev button goes back and wraps from the first image', async () => {
    const a = setup(0)
    await userEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(a.onIndex).toHaveBeenLastCalledWith(2)
  })
  it('arrow keys navigate and Escape closes', async () => {
    const a = setup(1)
    await userEvent.keyboard('{ArrowRight}'); expect(a.onIndex).toHaveBeenLastCalledWith(2)
    await userEvent.keyboard('{ArrowLeft}'); expect(a.onIndex).toHaveBeenLastCalledWith(0)
    await userEvent.keyboard('{Escape}'); expect(a.onClose).toHaveBeenCalledTimes(1)
  })
  it('closes via the close button and the backdrop, but not when the content is clicked', async () => {
    const a = setup()
    await userEvent.click(screen.getByText('Alpha'))
    expect(a.onClose).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Close preview' }))
    expect(a.onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('dialog'))
    expect(a.onClose).toHaveBeenCalledTimes(2)
  })
  it('traps Tab focus inside the dialog', async () => {
    setup()
    const user = userEvent.setup()
    const close = screen.getByRole('button', { name: 'Close preview' })
    const next = screen.getByRole('button', { name: 'Next image' })
    next.focus()
    await user.tab()
    expect(close).toHaveFocus() // wrapped from last to first
    await user.tab({ shift: true })
    expect(next).toHaveFocus() // wrapped from first to last
  })
  it('hides navigation for a single image', () => {
    setup(0, { items: [items[0]] })
    expect(screen.queryByRole('button', { name: 'Next image' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Previous image' })).toBeNull()
  })
  it('restores focus to the opener and unlocks scroll on unmount', () => {
    const opener = document.createElement('button'); document.body.appendChild(opener); opener.focus()
    const { unmount } = render(<Lightbox items={items} index={0} onIndex={() => {}} onClose={() => {}} />)
    unmount()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
    opener.remove()
  })
})

describe('WaveDivider', () => {
  it('is decorative (aria-hidden) and uses the provided colour class', () => {
    const { container } = render(<WaveDivider className="text-navy-900" />)
    const el = container.firstElementChild!
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveClass('text-navy-900', '-bottom-px')
  })
})
