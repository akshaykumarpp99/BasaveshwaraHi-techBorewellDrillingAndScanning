import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const motion = vi.hoisted(() => ({ reduce: false }))
vi.mock('framer-motion', async (orig) => ({ ...(await orig<typeof import('framer-motion')>()), useReducedMotion: () => motion.reduce }))

import { useCountUp } from '../../hooks/useCountUp'
import { useCarousel } from '../../hooks/useCarousel'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useActiveSection } from '../../hooks/useActiveSection'

describe('useCountUp', () => {
  beforeEach(() => {
    motion.reduce = false
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
  })
  afterEach(() => vi.useRealTimers())

  it('stays at 0 until started', () => {
    const { result } = renderHook(() => useCountUp(1000, false))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBe(0)
  })
  it('counts up monotonically and ends exactly on the target', () => {
    const { result } = renderHook(() => useCountUp(1000, true, 1000))
    const seen: number[] = []
    for (let i = 0; i < 12; i++) { act(() => { vi.advanceTimersByTime(100) }); seen.push(result.current) }
    expect(seen[0]).toBeGreaterThan(0)
    expect(seen[0]).toBeLessThan(1000)
    expect([...seen].sort((a, b) => a - b)).toEqual(seen)
    expect(result.current).toBe(1000)
  })
  it('eases out (first half covers more than half the distance)', () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000))
    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current).toBeGreaterThan(50)
  })
  it('starts when `start` flips to true', () => {
    const { result, rerender } = renderHook(({ s }) => useCountUp(50, s, 500), { initialProps: { s: false } })
    expect(result.current).toBe(0)
    rerender({ s: true })
    act(() => { vi.advanceTimersByTime(700) })
    expect(result.current).toBe(50)
  })
  it('jumps straight to the target when the user prefers reduced motion', () => {
    motion.reduce = true
    const { result } = renderHook(() => useCountUp(500, true))
    expect(result.current).toBe(500)
  })
  it('cancels its animation frame on unmount', () => {
    const spy = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount } = renderHook(() => useCountUp(10, true))
    unmount()
    expect(spy).toHaveBeenCalled()
  })
})

describe('useCarousel', () => {
  beforeEach(() => { motion.reduce = false; vi.useFakeTimers() })
  afterEach(() => vi.useRealTimers())

  it('starts at 0 and moves with next/prev, wrapping at both ends', () => {
    const { result } = renderHook(() => useCarousel(3, { paused: true }))
    expect(result.current.index).toBe(0)
    act(() => result.current.next()); expect(result.current.index).toBe(1)
    act(() => result.current.next()); act(() => result.current.next()); expect(result.current.index).toBe(0)
    act(() => result.current.prev()); expect(result.current.index).toBe(2)
  })
  it('go() jumps to an index, wrapping out-of-range values', () => {
    const { result } = renderHook(() => useCarousel(4, { paused: true }))
    act(() => result.current.go(3)); expect(result.current.index).toBe(3)
    act(() => result.current.go(5)); expect(result.current.index).toBe(1)
    act(() => result.current.go(-1)); expect(result.current.index).toBe(3)
  })
  it('tracks direction for slide animations', () => {
    const { result } = renderHook(() => useCarousel(3, { paused: true }))
    act(() => result.current.next()); expect(result.current.dir).toBe(1)
    act(() => result.current.prev()); expect(result.current.dir).toBe(-1)
  })
  it('auto-advances after the interval', () => {
    const { result } = renderHook(() => useCarousel(3, { interval: 1000 }))
    act(() => { vi.advanceTimersByTime(999) }); expect(result.current.index).toBe(0)
    act(() => { vi.advanceTimersByTime(2) }); expect(result.current.index).toBe(1)
    act(() => { vi.advanceTimersByTime(1000) }); expect(result.current.index).toBe(2)
  })
  it('does not auto-advance while paused, and resumes afterwards', () => {
    const { result, rerender } = renderHook(({ p }) => useCarousel(3, { interval: 500, paused: p }), { initialProps: { p: true } })
    act(() => { vi.advanceTimersByTime(5000) }); expect(result.current.index).toBe(0)
    rerender({ p: false })
    act(() => { vi.advanceTimersByTime(600) }); expect(result.current.index).toBe(1)
  })
  it('never auto-advances a single slide', () => {
    const { result } = renderHook(() => useCarousel(1, { interval: 100 }))
    act(() => { vi.advanceTimersByTime(1000) }); expect(result.current.index).toBe(0)
  })
  it('restarts the timer after a manual change instead of double-advancing', () => {
    const { result } = renderHook(() => useCarousel(5, { interval: 1000 }))
    act(() => { vi.advanceTimersByTime(900) })
    act(() => result.current.next())
    act(() => { vi.advanceTimersByTime(900) })
    expect(result.current.index).toBe(1)
  })
})

describe('useLockBodyScroll', () => {
  afterEach(() => { document.body.style.overflow = '' })
  it('hides body overflow while locked and restores it on unmount', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = renderHook(() => useLockBodyScroll(true))
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })
  it('does nothing when not locked', () => {
    renderHook(() => useLockBodyScroll(false))
    expect(document.body.style.overflow).toBe('')
  })
  it('reacts to the flag changing', () => {
    const { rerender } = renderHook(({ l }) => useLockBodyScroll(l), { initialProps: { l: false } })
    rerender({ l: true }); expect(document.body.style.overflow).toBe('hidden')
    rerender({ l: false }); expect(document.body.style.overflow).toBe('')
  })
})

describe('useActiveSection', () => {
  afterEach(() => { document.body.innerHTML = '' })
  const mount = (...ids: string[]) => { document.body.innerHTML = ids.map((i) => `<section id="${i}"></section>`).join('') }

  it('reports the section the observer says is under the header', () => {
    mount('about', 'services')
    const { result } = renderHook(() => useActiveSection(['about', 'services'], true))
    // the test IntersectionObserver stub reports every observed element as visible in order
    expect(result.current).toBe('services')
  })
  it('returns an empty string when disabled (not on the home page)', () => {
    mount('about')
    const { result } = renderHook(() => useActiveSection(['about'], false))
    expect(result.current).toBe('')
  })
  it('clears the active section when it becomes disabled', () => {
    mount('about')
    const { result, rerender } = renderHook(({ e }) => useActiveSection(['about'], e), { initialProps: { e: true } })
    expect(result.current).toBe('about')
    rerender({ e: false })
    expect(result.current).toBe('')
  })
  it('ignores ids that are not in the document', () => {
    mount('about')
    const { result } = renderHook(() => useActiveSection(['ghost', 'about'], true))
    expect(result.current).toBe('about')
  })
  it('disconnects the observer on unmount', () => {
    mount('about')
    const disconnect = vi.spyOn((window as any).IntersectionObserver.prototype, 'disconnect')
    const { unmount } = renderHook(() => useActiveSection(['about'], true))
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})
