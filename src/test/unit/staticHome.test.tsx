import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it } from 'vitest'
import { renderAt } from '../helpers'
import Reveal from '../../components/ui/Reveal'
import WaveDivider from '../../components/ui/WaveDivider'
import Process from '../../components/sections/Process'
import Hero from '../../components/sections/Hero'
import { PageMotion } from '../../context/pageMotion'

// framer-motion creates (and caches) its scroll observer on first use, so install ours before anything renders.
beforeAll(() => {
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } } as never
})

const hiddenByAnimation = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLElement>('[style]')].filter((el) => /opacity:\s*0(;|$|\s)/.test(el.getAttribute('style') ?? ''))

describe('home page is motion-free', () => {
  it('has a still hero: one background image, no slideshow controls, no entrance animation', async () => {
    const { container } = renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    const hero = container.querySelector('#hero')!
    expect(hero.querySelectorAll('img')).toHaveLength(1)
    expect(screen.queryByRole('group', { name: 'Featured work' })).toBeNull()
    expect(screen.queryByRole('button', { name: /pause slideshow|play slideshow/i })).toBeNull()
    expect(hiddenByAnimation(hero)).toHaveLength(0)
    expect(hero.querySelector('.animate-float-y, .animate-ping')).toBeNull()
  })
  it('renders every section visible straight away (no scroll-reveal hidden states)', async () => {
    // (the observer below never reports "in view", so any leftover scroll-reveal would stay stuck at opacity 0)
    const { container } = renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    expect(hiddenByAnimation(container.querySelector('main')!)).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 2, name: /engineering, not guesswork/i })).toBeVisible()
  })
  it('control: the same check does catch reveal animations on a page that has them', async () => {
    const { container } = renderAt('/about')
    await screen.findByRole('heading', { level: 1 })
    expect(hiddenByAnimation(container.querySelector('main')!).length).toBeGreaterThan(0)
  })
  it('keeps the water waves moving (the one thing that still animates on Home)', async () => {
    const { container } = renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelectorAll('main svg.animate-wave').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('main svg.animate-wave-slow').length).toBeGreaterThan(0)
  })
  it('still has the working interactive pieces (counters, accordion, testimonial controls)', async () => {
    renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.getByLabelText('1000+')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /how much does borewell drilling cost/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Next testimonial' })).toBeInTheDocument()
  })
})

describe('other pages keep their scroll animation', () => {
  it('Reveal animates by default (starts hidden) but is static inside a motion-off page', () => {
    const { rerender, container } = render(<Reveal>content</Reveal>)
    expect(hiddenByAnimation(container).length).toBeGreaterThan(0)
    rerender(<PageMotion.Provider value={false}><Reveal>content</Reveal></PageMotion.Provider>)
    expect(hiddenByAnimation(container)).toHaveLength(0)
    expect(screen.getByText('content')).toBeInTheDocument()
  })
  it.each(['div', 'li'] as const)('static Reveal keeps its element type and classes (%s)', (tag) => {
    const { container } = render(<PageMotion.Provider value={false}>{tag === 'li' ? <ul><Reveal as="li" className="k">x</Reveal></ul> : <Reveal as={tag} className="k">x</Reveal>}</PageMotion.Provider>)
    expect(container.querySelector(`${tag}.k`)).not.toBeNull()
  })
  it('WaveDivider keeps waving even inside a motion-off page', () => {
    const { container } = render(<PageMotion.Provider value={false}><WaveDivider /></PageMotion.Provider>)
    expect(container.querySelector('svg.animate-wave')).not.toBeNull()
  })
  it('Process timeline renders fully drawn when motion is off', () => {
    const { container } = render(<PageMotion.Provider value={false}><MemoryRouter><Process /></MemoryRouter></PageMotion.Provider>)
    expect(container.querySelectorAll('li')).toHaveLength(6)
  })
  it('the /about page still reveals on scroll (its sections are not forced static)', async () => {
    const { container } = renderAt('/about')
    await screen.findByRole('heading', { level: 1 })
    expect(container.querySelector('.animate-wave')).not.toBeNull()
  })
  it('standalone Hero is also still (no animation dependencies)', () => {
    const { container } = render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(hiddenByAnimation(container)).toHaveLength(0)
  })
})
