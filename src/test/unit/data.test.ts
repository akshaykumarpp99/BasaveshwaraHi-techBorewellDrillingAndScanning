import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getService, services } from '../../data/services'
import { equipment } from '../../data/equipment'
import { projectCategories, projects } from '../../data/projects'
import { cities, getCity } from '../../data/cities'
import { faqs, processSteps, testimonials, whyUs } from '../../data/content'
import { images } from '../../data/images'

const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('images map', () => {
  it('points every key at a file that exists in public/', () => {
    for (const [key, path] of Object.entries(images)) {
      expect(existsSync(join(process.cwd(), 'public', path)), `${key} -> ${path}`).toBe(true)
    }
  })
  it('only references web formats', () => {
    for (const p of Object.values(images)) expect(p).toMatch(/\.(webp|jpe?g|png|avif)$/)
  })
  it('has a placeholder for every importable photo slot', () => {
    const slots = readdirSync(join(process.cwd(), 'public', 'images')).filter((f) => f.endsWith('.webp')).length
    expect(slots).toBeGreaterThanOrEqual(18)
  })
})

describe('services', () => {
  it('lists the 8 required services in order', () => {
    expect(services.map((s) => s.title)).toEqual([
      'Borewell Drilling', 'Openwell Drilling', 'Borewell Cleaning', 'Borewell Flushing',
      'Submersible Pump Installation', 'Groundwater Survey', 'Drilling Rig Services', 'Borewell Maintenance',
    ])
  })
  it('has unique URL-safe slugs', () => {
    expect(unique(services.map((s) => s.slug))).toBe(true)
    for (const s of services) expect(s.slug).toMatch(/^[a-z]+(-[a-z]+)*$/)
  })
  it('gives every service an icon, valid image, description and detail lists', () => {
    for (const s of services) {
      expect(s.icon, s.slug).toBeTruthy()
      expect(images[s.image], s.slug).toBeTruthy()
      expect(s.short.length).toBeGreaterThan(20)
      expect(s.overview.length).toBeGreaterThan(40)
      expect(s.included.length).toBeGreaterThan(0)
      expect(s.whenYouNeedIt.length).toBeGreaterThan(0)
    }
  })
  it('getService finds by slug and returns undefined otherwise', () => {
    expect(getService('borewell-cleaning')?.title).toBe('Borewell Cleaning')
    expect(getService('nope')).toBeUndefined()
    expect(getService(undefined)).toBeUndefined()
  })
})

describe('equipment', () => {
  it('covers the 5 requested categories with valid images', () => {
    expect(equipment).toHaveLength(5)
    expect(unique(equipment.map((e) => e.id))).toBe(true)
    for (const e of equipment) expect(images[e.image]).toBeTruthy()
    expect(equipment.map((e) => e.title)).toEqual(['Borewell Drilling Rigs', 'Hydraulic Drilling Machines', 'Compressor Machines', 'Water Tankers', 'Drilling Accessories'])
  })
})

describe('projects', () => {
  it('offers the four filter categories', () => expect(projectCategories).toEqual(['Residential', 'Agricultural', 'Commercial', 'Industrial']))
  it('has unique ids, valid categories and images, and every category is represented', () => {
    expect(unique(projects.map((p) => p.id))).toBe(true)
    for (const p of projects) {
      expect(projectCategories).toContain(p.category)
      expect(images[p.image]).toBeTruthy()
      for (const f of ['title', 'location', 'depth', 'drillingType', 'description'] as const) expect(p[f], `${p.id}.${f}`).toBeTruthy()
    }
    for (const c of projectCategories) expect(projects.some((p) => p.category === c), c).toBe(true)
  })
  it('flags placeholder projects as samples (no invented achievements)', () => {
    for (const p of projects) expect(p.isSample).toBe(true)
  })
})

describe('cities', () => {
  it('has unique URL-safe slugs and getCity works', () => {
    expect(unique(cities.map((c) => c.slug))).toBe(true)
    for (const c of cities) {
      expect(c.slug).toMatch(/^[a-z]+(-[a-z]+)*$/)
      expect(getCity(c.slug)).toBe(c)
    }
    expect(getCity('atlantis')).toBeUndefined()
    expect(getCity(undefined)).toBeUndefined()
  })
})

describe('content', () => {
  it('has the 7 "why choose us" strengths with icons', () => {
    expect(whyUs).toHaveLength(7)
    for (const w of whyUs) { expect(w.icon).toBeTruthy(); expect(w.title).toBeTruthy(); expect(w.text).toBeTruthy() }
  })
  it('has the 6 process steps in the requested order', () => {
    expect(processSteps.map((s) => s.title)).toEqual(['Customer Enquiry', 'Site Inspection', 'Groundwater Assessment', 'Drilling Planning', 'Borewell Drilling', 'Completion & Testing'])
  })
  it('has the 6 requested FAQs with answers', () => {
    expect(faqs.map((f) => f.q)).toEqual([
      'How much does borewell drilling cost?', 'How long does borewell drilling take?', 'How do you determine the drilling location?',
      'What is the maximum borewell depth?', 'Do you provide pump installation?', 'Do you offer borewell cleaning services?',
    ])
    for (const f of faqs) expect(f.a.length).toBeGreaterThan(30)
  })
  it('keeps testimonials as clearly flagged samples with valid ratings', () => {
    expect(testimonials.length).toBeGreaterThan(0)
    for (const t of testimonials) {
      expect(t.isSample).toBe(true)
      expect(t.rating).toBeGreaterThanOrEqual(1)
      expect(t.rating).toBeLessThanOrEqual(5)
    }
  })
  it('never promises a guaranteed water result', () => {
    const all = [...faqs.map((f) => f.a), ...services.map((s) => s.overview)].join(' ')
    expect(all).not.toMatch(/(we|will|always)\s+(guarantee|find)\s+(you\s+)?water|100% (water|success)|guaranteed water/i)
    expect(all).toMatch(/no (method|survey)[^.]*guarantee/i) // honest disclaimer present
  })
})
