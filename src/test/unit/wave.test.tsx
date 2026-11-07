import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WAVE_PERIOD, WAVE_WIDTH, wavePath } from '../../lib/wave'
import WaveDivider from '../../components/ui/WaveDivider'

type Seg = { c1: [number, number]; c2: [number, number]; end: [number, number] }
const parse = (d: string): { start: [number, number]; segs: Seg[] } => {
  const start = d.match(/^M([\d.]+) ([\d.]+)/)!.slice(1).map(Number) as [number, number]
  const segs = [...d.matchAll(/C([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)/g)].map((m) => {
    const n = m.slice(1).map(Number)
    return { c1: [n[0], n[1]], c2: [n[2], n[3]], end: [n[4], n[5]] } as Seg
  })
  return { start, segs }
}
const bezierY = (y0: number, y1: number, y2: number, y3: number, t: number) => (1 - t) ** 3 * y0 + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3

describe('wavePath', () => {
  const { start, segs } = parse(wavePath())

  it('spans the full width and closes the shape below the viewBox (no gaps at the bottom)', () => {
    expect(segs.at(-1)!.end[0]).toBe(WAVE_WIDTH)
    expect(wavePath()).toMatch(/V101 H0Z$/)
  })
  it('starts and ends at the same height, so the loop restarts without a jump', () => {
    expect(segs.at(-1)!.end[1]).toBe(start[1])
  })
  it('repeats exactly every period: every point in the next period is the same shifted by one period', () => {
    const perPeriod = 2
    for (let i = 0; i + perPeriod < segs.length; i++) {
      const a = segs[i], b = segs[i + perPeriod]
      for (const k of ['c1', 'c2', 'end'] as const) {
        expect(b[k][0]).toBeCloseTo(a[k][0] + WAVE_PERIOD)
        expect(b[k][1]).toBeCloseTo(a[k][1])
      }
    }
  })
  it('is seamless when slid by half the width (the CSS loop): window [0,W/2] equals window [W/2,W]', () => {
    const half = segs.length / 2
    for (let i = 0; i < half; i++) {
      for (const k of ['c1', 'c2', 'end'] as const) {
        expect(segs[i + half][k][0]).toBeCloseTo(segs[i][k][0] + WAVE_WIDTH / 2)
        expect(segs[i + half][k][1]).toBeCloseTo(segs[i][k][1])
      }
    }
  })
  it('has no kinks: the slope is continuous at every join (including across the loop seam)', () => {
    const dir = (from: [number, number], to: [number, number]) => { const dx = to[0] - from[0], dy = to[1] - from[1]; return dy / dx }
    let prevEnd = start
    let prev: Seg | null = null
    for (const seg of segs) {
      if (prev) expect(dir(prev.c2, prevEnd)).toBeCloseTo(dir(prevEnd, seg.c1))
      prevEnd = seg.end
      prev = seg
    }
    // loop seam: slope arriving at the last point equals the slope leaving the first point
    const last = segs.at(-1)!
    expect(dir(last.c2, last.end)).toBeCloseTo(dir(start, segs[0].c1))
  })
  it('stays inside the 0–100 viewBox so nothing is clipped at the peaks or troughs', () => {
    for (const s of segs) {
      const prev = segs[segs.indexOf(s) - 1]?.end ?? start
      for (let t = 0; t <= 1; t += 0.05) {
        const y = bezierY(prev[1], s.c1[1], s.c2[1], s.end[1], t)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(100)
      }
    }
  })
  it('supports other sizes and keeps the periodic property', () => {
    const p = parse(wavePath(1200, 300, 50, 20))
    expect(p.segs.at(-1)!.end).toEqual([1200, 50])
    expect(p.segs).toHaveLength(8)
  })
})

describe('WaveDivider rendering', () => {
  const layers = () => {
    const { container } = render(<WaveDivider />)
    return { container, front: container.querySelector('svg[data-layer="front"]')!, back: container.querySelector('svg[data-layer="back"]')! }
  }
  it('has a front and a back layer using seamless paths in a matching viewBox', () => {
    const { front, back } = layers()
    for (const svg of [front, back]) expect(svg.getAttribute('viewBox')).toBe(`0 0 ${WAVE_WIDTH} 100`)
    expect(front.querySelector('path')!.getAttribute('d')).toBe(wavePath())
    expect(back.querySelector('path')!.getAttribute('d')).toBe(wavePath(WAVE_WIDTH, 400, 64, 24))
  })
  it('both layers actually animate, at different speeds and in opposite directions', () => {
    const { front, back } = layers()
    expect(front).toHaveClass('animate-wave')
    expect(back).toHaveClass('animate-wave-slow')
    expect(back).toHaveClass('opacity-40')
  })
  it('the back layer repeats seamlessly over the half-width slide too', () => {
    const { segs } = parse(wavePath(WAVE_WIDTH, 400, 64, 24))
    const half = segs.length / 2
    for (let i = 0; i < half; i++) expect(segs[i + half].end[0]).toBeCloseTo(segs[i].end[0] + WAVE_WIDTH / 2)
  })
  it('overlaps the neighbouring section by 1px so no hairline shows', () => {
    const { container } = layers()
    expect(container.firstElementChild).toHaveClass('-bottom-px')
  })
  it('each layer is twice the container width so a half-width slide is exactly one loop', () => {
    const { front, back } = layers()
    expect(front).toHaveClass('w-[200%]')
    expect(back).toHaveClass('w-[200%]')
  })
  it('is decorative', () => {
    const { container } = layers()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
