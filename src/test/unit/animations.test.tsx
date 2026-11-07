import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const motion = vi.hoisted(() => ({ reduce: false }))
vi.mock('framer-motion', async (orig) => ({ ...(await orig<typeof import('framer-motion')>()), useReducedMotion: () => motion.reduce }))

import About from '../../components/sections/About'
import RouteCurtain from '../../components/layout/RouteCurtain'
import ScrollProgress from '../../components/layout/ScrollProgress'
import Lightbox from '../../components/ui/Lightbox'
import { images } from '../../data/images'

beforeEach(() => { motion.reduce = false })

describe('RouteCurtain', () => {
  const setup = () => render(
    <MemoryRouter>
      <RouteCurtain />
      <Link to="/a">go a</Link><Link to="/b">go b</Link>
    </MemoryRouter>
  )
  it('is not shown on the first page load', () => {
    setup()
    expect(screen.queryByTestId('route-curtain')).toBeNull()
  })
  it('sweeps across on navigation and is purely decorative', async () => {
    setup()
    await userEvent.click(screen.getByRole('link', { name: 'go a' }))
    const curtain = await screen.findByTestId('route-curtain')
    expect(curtain).toHaveAttribute('aria-hidden', 'true')
    expect(curtain.className).toContain('pointer-events-none')
  })
  it('replays for each further navigation (new instance every time)', async () => {
    setup()
    await userEvent.click(screen.getByRole('link', { name: 'go a' }))
    const first = await screen.findByTestId('route-curtain')
    await userEvent.click(screen.getByRole('link', { name: 'go b' }))
    await waitFor(() => expect(screen.getByTestId('route-curtain')).not.toBe(first))
  })
  it('is skipped entirely for reduced motion', async () => {
    motion.reduce = true
    setup()
    await userEvent.click(screen.getByRole('link', { name: 'go a' }))
    expect(screen.queryByTestId('route-curtain')).toBeNull()
  })
})

describe('ScrollProgress', () => {
  it('renders a decorative bar fixed to the top of the viewport', () => {
    render(<ScrollProgress />)
    const bar = screen.getByTestId('scroll-progress')
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar.className).toContain('fixed')
    expect(bar.className).toContain('top-0')
  })
})

describe('About parallax photo', () => {
  it('still shows the photo with its alt text (motion is decorative)', () => {
    render(<MemoryRouter><About /></MemoryRouter>)
    expect(screen.getAllByRole('img').some((i) => i.getAttribute('src') === images.aboutMain)).toBe(true)
  })
  it('does not zoom or shift for reduced motion', () => {
    motion.reduce = true
    render(<MemoryRouter><About /></MemoryRouter>)
    const img = screen.getAllByRole('img').find((i) => i.getAttribute('src') === images.aboutMain) as HTMLElement
    expect(img.style.transform).not.toMatch(/scale\(1\.18\)/)
  })
})

describe('Lightbox frame shifting', () => {
  const items = [
    { src: '/a.webp', alt: 'A', title: 'Alpha' },
    { src: '/b.webp', alt: 'B', title: 'Beta' },
    { src: '/c.webp', alt: 'C', title: 'Gamma' },
  ]
  const ui = (index: number) => <Lightbox items={items} index={index} onIndex={() => {}} onClose={() => {}} />

  it('swaps the displayed frame when the index changes forward, backward and across the wrap-around', async () => {
    const { rerender } = render(ui(0))
    expect(screen.getByRole('img', { name: 'A' })).toBeInTheDocument()
    rerender(ui(1)); await waitFor(() => expect(screen.getByRole('img', { name: 'B' })).toBeInTheDocument())
    rerender(ui(2)); await waitFor(() => expect(screen.getByRole('img', { name: 'C' })).toBeInTheDocument())
    rerender(ui(0)); await waitFor(() => expect(screen.getByRole('img', { name: 'A' })).toBeInTheDocument()) // wrap forward
    rerender(ui(2)); await waitFor(() => expect(screen.getByRole('img', { name: 'C' })).toBeInTheDocument()) // wrap backward
    rerender(ui(1)); await waitFor(() => expect(screen.getByRole('img', { name: 'B' })).toBeInTheDocument())
  })
  it('only ever shows one frame at a time while shifting', async () => {
    const { rerender } = render(ui(0))
    rerender(ui(1))
    await waitFor(() => expect(screen.getAllByRole('img')).toHaveLength(1))
  })
})
