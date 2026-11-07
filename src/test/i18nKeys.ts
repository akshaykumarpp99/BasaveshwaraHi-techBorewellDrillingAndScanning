// Collects every string that should have a Kannada translation. Used by the completeness test.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { services } from '../data/services'
import { equipment } from '../data/equipment'
import { projects, projectCategories } from '../data/projects'
import { cities } from '../data/cities'
import { faqs, processSteps, testimonials, whyUs } from '../data/content'
import { site } from '../config/site'
import { serviceOptions } from '../lib/validation'

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? (f === 'test' ? [] : walk(p)) : /\.(ts|tsx)$/.test(p) ? [p] : []
  })

const unescape = (s: string) => s.replace(/\\'/g, "'").replace(/\\"/g, '"')

/** Literal keys passed to t()/tr() plus the props/objects that feed t() indirectly. */
export function sourceKeys(): Set<string> {
  const keys = new Set<string>()
  const files = walk(join(process.cwd(), 'src')).filter((f) => !/i18n[\\/]kn/.test(f))
  const direct = /\btr?\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g
  const indirect = [
    /\blabel:\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g, // nav links, crumbs
    /\b(?:title|subtitle|text|helpText):\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g, // small inline data (About pillars)
    /\b(?:title|subtitle)=(['"])((?:\\.|(?!\1)[^\\])*)\1/g, // <PageHero title="..." subtitle="...">
    /\b(?:title|text)\s=\s(['"])((?:\\.|(?!\1)[^\\])*)\1/g, // default props (CTABanner)
  ]
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    for (const m of src.matchAll(direct)) keys.add(unescape(m[2]))
    if (/components|pages/.test(f)) for (const re of indirect) for (const m of src.matchAll(re)) keys.add(unescape(m[2]))
  }
  // zod validation messages (shown through <Field error>)
  const v = readFileSync(join(process.cwd(), 'src/lib/validation.ts'), 'utf8')
  for (const m of v.matchAll(/'((?:[^'\\]|\\.)*)'/g)) if (/^[A-Z]/.test(m[1]) && m[1].includes(' ')) keys.add(unescape(m[1]))
  // thrown / fallback messages shown in the form
  const e = readFileSync(join(process.cwd(), 'src/lib/enquiry.ts'), 'utf8')
  for (const m of e.matchAll(/Error\('((?:[^'\\]|\\.)*)'/g)) keys.add(unescape(m[1]))
  const form = readFileSync(join(process.cwd(), 'src/components/sections/EnquiryForm.tsx'), 'utf8')
  for (const m of form.matchAll(/: '(Something went wrong[^']*)'/g)) keys.add(m[1])
  // Field label/hint props are translated inside <Field>
  for (const m of form.matchAll(/<Field[^>]*?\blabel="([^"]+)"/g)) keys.add(m[1])
  for (const m of form.matchAll(/\bhint="([^"]+)"/g)) keys.add(m[1])
  return keys
}

/** Every user-visible string in the data files and config. */
export function dataKeys(): Set<string> {
  const keys = new Set<string>()
  const add = (...xs: (string | undefined)[]) => xs.forEach((x) => x && keys.add(x))
  for (const s of services) add(s.title, s.short, s.overview, ...s.included, ...s.whenYouNeedIt)
  for (const e of equipment) add(e.title, e.category, e.description)
  for (const p of projects) add(p.title, p.location, p.drillingType, p.description, p.depth === '—' ? undefined : p.depth)
  add(...projectCategories, 'All')
  for (const c of cities) add(c.name, c.region, c.blurb)
  for (const f of faqs) add(f.q, f.a)
  for (const p of processSteps) add(p.title, p.text)
  for (const w of whyUs) add(w.title, w.text)
  for (const t of testimonials) add(t.text, t.name, t.location)
  add(site.name, site.tagline, site.city, site.hours, site.address.street, site.address.locality, site.address.region)
  for (const s of site.stats) add(s.label)
  add(...serviceOptions)
  return keys
}
