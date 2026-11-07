import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const motion = vi.hoisted(() => ({ reduce: false }))
vi.mock('framer-motion', async (orig) => ({ ...(await orig<typeof import('framer-motion')>()), useReducedMotion: () => motion.reduce }))
// only residential projects exist, so other categories are empty
vi.mock('../../data/projects', async (orig) => {
  const real = await orig<typeof import('../../data/projects')>()
  return { ...real, projects: real.projects.filter((p) => p.category === 'Residential') }
})

import Hero from '../../components/sections/Hero'
import Process from '../../components/sections/Process'
import WhyChooseUs from '../../components/sections/WhyChooseUs'
import Testimonials from '../../components/sections/Testimonials'
import Projects from '../../components/sections/Projects'
import Lightbox from '../../components/ui/Lightbox'
import Reveal from '../../components/ui/Reveal'
import { testimonials } from '../../data/content'

const at = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('reduced-motion preference', () => {
  beforeEach(() => { motion.reduce = true })
  afterEach(() => { motion.reduce = false; vi.useRealTimers() })

  it('Hero still renders all content and the final stat values immediately', () => {
    at(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('1,000+')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
  it('Process and WhyChooseUs render without animation', () => {
    at(<Process />)
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    at(<WhyChooseUs />)
    expect(screen.getByText('Quality Workmanship')).toBeInTheDocument()
  })
  it('Reveal skips the slide offset', () => {
    render(<Reveal direction="left">ok</Reveal>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
  it('Testimonials never auto-advance (no motion), but manual controls work', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<Testimonials />)
    await vi.advanceTimersByTimeAsync(30000)
    expect(screen.getByRole('group', { name: `1 of ${testimonials.length}` })).toBeInTheDocument()
    vi.useRealTimers()
    await userEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
    await waitFor(() => expect(screen.getByRole('group', { name: `2 of ${testimonials.length}` })).toBeInTheDocument())
  })
})

describe('Projects with an empty category', () => {
  it('shows a friendly message instead of a blank grid', async () => {
    at(<Projects />)
    await userEvent.click(screen.getByRole('button', { name: 'Industrial' }))
    expect(await screen.findByText('No projects in this category yet.')).toBeInTheDocument()
    expect(screen.getByText('0 projects shown')).toBeInTheDocument()
    expect(document.querySelectorAll('#projects article')).toHaveLength(0)
  })
})

describe('Lightbox focus handling', () => {
  const items = [{ src: '/a.webp', alt: 'a', title: 'A' }, { src: '/b.webp', alt: 'b', title: 'B' }]
  it('lets Tab move normally between the middle controls (only traps at the ends)', () => {
    render(<Lightbox items={items} index={0} onIndex={() => {}} onClose={() => {}} />)
    screen.getByRole('button', { name: 'Previous image' }).focus()
    const notPrevented = fireEvent.keyDown(document, { key: 'Tab' })
    expect(notPrevented).toBe(true)
  })
  it('ignores unrelated keys', () => {
    const onClose = vi.fn(), onIndex = vi.fn()
    render(<Lightbox items={items} index={0} onIndex={onIndex} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'a' })
    expect(onClose).not.toHaveBeenCalled()
    expect(onIndex).not.toHaveBeenCalled()
  })
})

describe('supabase client', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })
  it('is null when the env vars are missing (form falls back to WhatsApp/email)', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    expect((await import('../../lib/supabase')).supabase).toBeNull()
  })
  it('is created when both env vars are present', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_SUPABASE_URL', 'https://abc.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const { supabase } = await import('../../lib/supabase')
    expect(supabase).not.toBeNull()
    expect(typeof supabase!.from).toBe('function')
  })
  it('stays null if only one of the two is set', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_SUPABASE_URL', 'https://abc.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    expect((await import('../../lib/supabase')).supabase).toBeNull()
  })
})
