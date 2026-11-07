// Converts photos dropped into /photos into optimised WebP files in public/images.
//   1. Name each photo after the slot it replaces (see photos/README.md), e.g. photos/rig.jpg
//   2. npm run photos
// Needs cwebp: brew install webp
import { readdirSync, copyFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, extname, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'photos')
const out = join(root, 'public', 'images')

const slots = {
  'hero-rig': 1920, 'about-rig': 1200, team: 1200, rig: 1200, hydraulic: 1200, compressor: 1200, tanker: 1200,
  accessories: 1200, survey: 1200, pump: 1200, cleaning: 1200, flushing: 1200, openwell: 1200, maintenance: 1200,
  residential: 1200, agricultural: 1200, commercial: 1200, industrial: 1200,
}

let done = 0
for (const file of readdirSync(src)) {
  const ext = extname(file).toLowerCase()
  const name = basename(file, extname(file))
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue
  if (name === 'og-image') {
    if (ext === '.jpg' || ext === '.jpeg') { copyFileSync(join(src, file), join(out, 'og-image.jpg')); console.log('og-image.jpg updated'); done++ }
    else console.warn('og-image must be a .jpg (1200x630)')
    continue
  }
  if (!(name in slots)) { console.warn(`skipped "${file}": not a known slot (see photos/README.md)`); continue }
  try {
    execFileSync('cwebp', ['-quiet', '-q', '85', '-m', '5', '-resize', String(slots[name]), '0', join(src, file), '-o', join(out, `${name}.webp`)])
    console.log(`${file} -> public/images/${name}.webp`)
    done++
  } catch (e) {
    console.error(`failed on ${file}: ${e.message.split('\n')[0]} (is cwebp installed? brew install webp)`)
  }
}
console.log(done ? `Done: ${done} image(s) updated.` : 'No matching photos found in /photos.')
