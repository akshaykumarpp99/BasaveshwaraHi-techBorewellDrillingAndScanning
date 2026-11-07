import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
// @ts-ignore untyped build-time script modules
import * as art from '../../../scripts/art.mjs'
// @ts-ignore
import * as art2 from '../../../scripts/art2.mjs'

const parse = (svg: string) => new DOMParser().parseFromString(svg, 'image/svg+xml')
const isValidXml = (svg: string) => parse(svg).getElementsByTagName('parsererror').length === 0
const wrap = (inner: string) => art.frame(800, 600, 'test', inner)

describe('rng', () => {
  it('is deterministic for a seed and varies between seeds', () => {
    const a = art.rng(5), b = art.rng(5), c = art.rng(6)
    const seqA = [a(), a(), a()], seqB = [b(), b(), b()], seqC = [c(), c(), c()]
    expect(seqA).toEqual(seqB)
    expect(seqA).not.toEqual(seqC)
  })
  it('stays within [0, 1)', () => {
    const r = art.rng(42)
    for (let i = 0; i < 1000; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1) }
  })
})

describe('art helpers produce well-formed SVG', () => {
  const cases: Array<[string, () => string]> = [
    ['sky dusk', () => art.sky(800, 600, 'dusk')],
    ['sky day', () => art.sky(800, 600, 'day')],
    ['hills', () => art.hills(800, 400, 30, '#123456', 3)],
    ['grass', () => art.grass(800, 500, 4, '#223344', 40)],
    ['rocks', () => art.rocks(100, 500, 2, 4, 16)],
    ['groundBlock', () => art.groundBlock(800, 450, 600)],
    ['splash', () => art.splash(400, 480, 1)],
    ['worker', () => art.worker(300, 500, 1, -1, '#E5B24E', '#fff')],
    ['wheel', () => art.wheel(100, 38)],
    ['lattice', () => art.lattice(0, 40, -300, 0)],
    ['cab', () => art.cab(0)],
    ['rigTruck', () => art.rigTruck()],
    ['crawlerRig', () => art2.crawlerRig().svg],
    ['compressorUnit', () => art2.compressorUnit()],
    ['tankerTruck', () => art2.tankerTruck()],
    ['strata', () => art2.strata(800, 600, 200).svg],
    ['bore', () => art2.bore(400, 200, 500, { water: 300 })],
    ['depthRuler', () => art2.depthRuler(760, 210, 580, 70)],
    ['house', () => art2.house()],
    ['tree', () => art2.tree(120, 2)],
  ]
  it.each(cases)('%s', (_name, make) => {
    const out = make()
    expect(out.length).toBeGreaterThan(50)
    expect(isValidXml(wrap(out))).toBe(true)
  })
  it('frame() wraps content in an accessible, scalable svg', () => {
    const svg = art.frame(1600, 900, 'My label', '<rect/>')
    const root = parse(svg).documentElement
    expect(root.tagName).toBe('svg')
    expect(root.getAttribute('viewBox')).toBe('0 0 1600 900')
    expect(root.getAttribute('role')).toBe('img')
    expect(root.getAttribute('aria-label')).toBe('My label')
  })
  it('defines every gradient/filter id that the helpers reference', () => {
    const body = [art.rigTruck(), art2.crawlerRig().svg, art2.compressorUnit(), art2.tankerTruck(), art2.strata(800, 600, 200).svg, art2.house(), art.splash(0, 0), art.worker(0, 0)].join('')
    const defined = new Set([...art.defs().matchAll(/id="([^"]+)"/g)].map((m) => m[1]))
    const used = [...body.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1])
    const missing = [...new Set(used)].filter((id) => !defined.has(id))
    expect(missing).toEqual([])
  })
  it('crawlerRig reports a hole position inside its own footprint', () => {
    const { holeX } = art2.crawlerRig()
    expect(holeX).toBeGreaterThan(0)
    expect(holeX).toBeLessThan(320)
  })
})

describe('generated artwork on disk', () => {
  const svgDir = join(process.cwd(), 'scripts', 'generated-svg')
  const files = existsSync(svgDir) ? readdirSync(svgDir).filter((f) => f.endsWith('.svg')) : []
  it('contains all 18 scenes', () => expect(files.length).toBeGreaterThanOrEqual(18))
  it.each(files)('%s is valid XML with a viewBox and no unresolved references', (f) => {
    const svg = readFileSync(join(svgDir, f), 'utf8')
    expect(isValidXml(svg)).toBe(true)
    expect(svg).toContain('viewBox=')
    const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
    for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) expect(ids.has(m[1]), `${f} missing #${m[1]}`).toBe(true)
  })
  it('has a matching optimised WebP for every scene', () => {
    for (const f of files) expect(existsSync(join(process.cwd(), 'public', 'images', f.replace('.svg', '.webp'))), f).toBe(true)
  })
  it('ships a 1200x630-class social image', () => {
    expect(existsSync(join(process.cwd(), 'public', 'images', 'og-image.jpg'))).toBe(true)
  })
})
