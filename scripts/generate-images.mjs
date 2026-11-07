// Generates branded illustrations into public/images (golden-hour editorial style).
// Replace any of these with real photography: drop the file in public/images and update
// src/data/images.ts - no component changes needed.
//   node scripts/generate-images.mjs [name ...]
// Writes SVG sources to scripts/generated-svg and optimised WebP (+ og-image.jpg) to
// public/images. Rasterising needs `rsvg-convert` and `cwebp` (brew install librsvg webp).
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { frame, sky, hills, grass, rocks, groundBlock, splash, worker, rigTruck } from './art.mjs'
import { crawlerRig, compressorUnit, tankerTruck, strata, bore, depthRuler, house, tree } from './art2.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'images')
const svgOut = join(root, 'scripts', 'generated-svg')
mkdirSync(out, { recursive: true })
mkdirSync(svgOut, { recursive: true })
const only = process.argv.slice(2)

const scenes = {}
const W = 800, H = 600

// rich mid-tone backdrops: blue day sky for work scenes, golden hour for hero-style scenes
const dayBackdrop = (gy, w = W, h = H) => `
  ${sky(w, h, 'day', gy - 20, w * 0.8)}
  ${hills(w, gy - 120, 36, '#8DB6D4', 31, 0.95, 150)}
  ${hills(w, gy - 78, 30, '#5F93BA', 32, 1, 120)}
  ${hills(w, gy - 40, 20, '#3D7099', 33, 1, 100)}
  ${groundBlock(w, gy, h)}
  ${grass(w, gy + 2, 41, '#3E5A2A', 90, 8, 22)}`

const duskBackdrop = (gy, w = W, h = H, sunX = w * 0.3) => `
  ${sky(w, h, 'dusk', gy - 30, sunX)}
  ${hills(w, gy - 100, 30, '#3A5C86', 11, 0.9, 130)}
  ${hills(w, gy - 66, 24, '#274A72', 12, 1, 110)}
  ${hills(w, gy - 34, 16, '#1A3556', 13, 1, 90)}
  ${groundBlock(w, gy, h)}
  ${grass(w, gy + 2, 21, '#3E5A2A', 100, 8, 24)}`

// ---------- hero (1600x900) ----------
scenes['hero-rig'] = () => {
  const w = 1600, h = 900, gy = 690
  return frame(w, h, 'Borewell drilling rig operating at golden hour', `
    ${sky(w, h, 'dusk', gy - 40, w * 0.34)}
    ${hills(w, gy - 150, 40, '#3A5C86', 11, 0.9, 160)}
    ${hills(w, gy - 100, 34, '#274A72', 12, 1, 130)}
    ${hills(w, gy - 58, 22, '#1A3556', 13, 1, 110)}
    ${groundBlock(w, gy, h)}
    ${grass(w, gy + 2, 21, '#3E5A2A', 140, 8, 26)}
    <g transform="translate(760 ${gy + 18}) scale(1.45)">${rigTruck()}</g>
    ${splash(760, gy + 20, 1.45)}
    ${worker(630, gy + 70, 1.5, 1)}
    ${worker(1230, gy + 125, 1.4, -1, '#E5B24E')}
    ${rocks(980, gy + 90, 5, 6, 22)}${rocks(1440, gy + 150, 8, 5, 26)}
    ${grass(w, h - 4, 33, '#2A1B10', 70, 22, 70)}
    <rect x="0" y="${gy - 90}" width="${w}" height="110" fill="#F6C98A" opacity=".18" filter="url(#b30)"/>`)
}

// ---------- services ----------
scenes['rig'] = () => {
  const gy = 468
  return frame(W, H, 'Truck-mounted borewell drilling rig', `
    ${dayBackdrop(gy)}
    <g transform="translate(120 ${gy + 14}) scale(.98)">${rigTruck()}</g>
    ${splash(120, gy + 16, 1)}
    ${worker(690, gy + 95, 1.25, -1)}
    ${rocks(70, gy + 100, 6, 5, 16)}
    ${grass(W, H - 2, 34, '#2A1B10', 50, 18, 54)}`)
}

scenes['about-rig'] = () => {
  const gy = 455
  return frame(W, H, 'Drilling crew with rig', `
    ${duskBackdrop(gy, W, H, W * 0.18)}
    <g transform="translate(70 ${gy + 14}) scale(.96)">${rigTruck()}</g>
    ${splash(70, gy + 16, 0.96)}
    ${worker(470, H - 12, 2.0, 1, '#E5B24E', '#F3D17A')}
    ${worker(580, H - 4, 2.0, -1, '#E5B24E', '#FFFFFF')}
    ${grass(W, H - 2, 35, '#2A1B10', 40, 14, 40)}`)
}

scenes['team'] = () => {
  const gy = 430
  return frame(W, H, 'Technical drilling team', `
    ${duskBackdrop(gy, W, H, W * 0.5)}
    <g transform="translate(140 ${gy + 8}) scale(.82)" opacity=".85" filter="url(#b2)">${rigTruck()}</g>
    ${worker(190, H - 16, 3.1, 1, '#E5B24E', '#F3D17A')}
    ${worker(400, H - 6, 3.4, 1, '#D5E2EE', '#FFFFFF')}
    ${worker(610, H - 16, 3.1, -1, '#E5B24E', '#F3D17A')}
    ${grass(W, H - 2, 37, '#2A1B10', 40, 12, 36)}`)
}

scenes['hydraulic'] = () => {
  const gy = 500
  const c = crawlerRig()
  return frame(W, H, 'Hydraulic crawler drilling machine', `
    ${sky(W, H, 'dusk', gy - 30, W * 0.82)}
    ${hills(W, gy - 190, 50, '#6A5B6E', 41, 0.9, 150)}
    ${hills(W, gy - 130, 40, '#4A4A66', 42, 1, 130)}
    ${hills(W, gy - 70, 26, '#2C3C5E', 43, 1, 110)}
    ${groundBlock(W, gy, H)}
    <g transform="translate(215 ${gy + 14})">${c.svg}</g>
    ${splash(215 + c.holeX, gy + 16, 1)}
    ${worker(110, gy + 70, 1.3, 1)}
    ${rocks(660, gy + 40, 12, 7, 24, '#6A5242')}${rocks(60, gy + 84, 5, 4, 22, '#6A5242')}
    ${grass(W, H - 2, 38, '#2A1B10', 40, 14, 40)}`)
}

scenes['compressor'] = () => {
  const gy = 470
  return frame(W, H, 'Trailer-mounted air compressor', `
    ${duskBackdrop(gy, W, H, W * 0.82)}
    <g transform="translate(176 ${gy + 14}) scale(1.2)">${compressorUnit()}</g>
    ${rocks(720, gy + 70, 9, 5, 18)}${rocks(50, gy + 90, 4, 4, 18)}
    ${grass(W, H - 2, 39, '#2A1B10', 50, 14, 44)}`)
}

scenes['tanker'] = () => {
  const gy = 468
  return frame(W, H, 'Water tanker truck', `
    ${dayBackdrop(gy)}
    <g transform="translate(130 ${gy + 14}) scale(1.04)">${tankerTruck()}</g>
    <path d="M118 ${gy - 6} Q96 ${gy + 8} 82 ${gy + 40}" fill="none" stroke="url(#waterSpray)" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="80" cy="${gy + 52}" rx="38" ry="7" fill="#6FA8CC" opacity=".9"/><ellipse cx="80" cy="${gy + 50}" rx="22" ry="3.5" fill="#CFE9F8" opacity=".8"/>
    ${worker(732, gy + 96, 1.25, -1)}
    ${grass(W, H - 2, 44, '#2A1B10', 50, 18, 54)}`)
}

scenes['accessories'] = () => {
  const fy = 440
  // tricone bit at cx=235 ; DTH hammer + button bit at cx=545
  const teeth = (cx, cy, rx, ry, n, a0 = 0, a1 = Math.PI) =>
    Array.from({ length: n }, (_, i) => {
      const a = a0 + ((a1 - a0) * (i + 0.5)) / n
      return `<circle cx="${cx + Math.cos(a) * rx}" cy="${cy + Math.sin(a) * ry}" r="4.2" fill="url(#goldV)" stroke="#6B4F1C" stroke-width=".8"/>`
    }).join('')
  const thread = (x, y, w, n, step = 9) => Array.from({ length: n }, (_, i) => `<path d="M${x} ${y + i * step} h${w}" stroke="#2A394C" stroke-width="2"/><path d="M${x} ${y + i * step + 3} h${w}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>`).join('')
  const bits = `
    <!-- tricone -->
    <g>
      <ellipse cx="235" cy="${fy + 6}" rx="118" ry="14" fill="#000" opacity=".55" filter="url(#b5)"/>
      <rect x="198" y="120" width="74" height="86" rx="6" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>${thread(198, 130, 74, 8)}
      <path d="M172 206 H298 L286 250 H184Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <rect x="172" y="200" width="126" height="10" rx="3" fill="url(#goldH)"/>
      <path d="M184 250 H286 L322 330 H148Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <g transform="rotate(-24 150 330)"><path d="M118 322 Q142 312 168 322 L186 420 Q150 440 118 420Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>${teeth(152, 356, 30, 8, 5, 0.3, 2.9)}${teeth(152, 394, 28, 8, 5, 0.3, 2.9)}</g>
      <g transform="rotate(24 320 330)"><path d="M302 322 Q328 312 352 322 L372 420 Q336 440 302 420Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>${teeth(336, 356, 30, 8, 5, 0.3, 2.9)}${teeth(336, 394, 28, 8, 5, 0.3, 2.9)}</g>
      <path d="M176 326 Q235 306 294 326 L276 ${fy} Q235 ${fy + 14} 194 ${fy}Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      ${teeth(235, 350, 44, 10, 7, 0.2, 2.94)}${teeth(235, 386, 40, 10, 7, 0.2, 2.94)}${teeth(235, 420, 30, 8, 5, 0.3, 2.84)}
    </g>
    <!-- DTH hammer + button bit -->
    <g>
      <ellipse cx="545" cy="${fy + 6}" rx="108" ry="13" fill="#000" opacity=".55" filter="url(#b5)"/>
      <rect x="510" y="70" width="70" height="52" rx="5" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>${thread(510, 78, 70, 5)}
      <rect x="498" y="120" width="94" height="170" rx="8" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <rect x="498" y="150" width="94" height="12" fill="url(#goldH)"/><rect x="498" y="230" width="94" height="12" fill="url(#goldH)"/>
      <path d="M520 168 V224 M545 168 V224 M570 168 V224" stroke="#2A394C" stroke-opacity=".5" stroke-width="3"/>
      <rect x="506" y="288" width="78" height="26" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <path d="M486 314 H604 Q614 340 610 372 L604 ${fy - 40} Q545 ${fy - 14} 486 ${fy - 40} L480 372 Q476 340 486 314Z" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <path d="M498 ${fy - 40} Q545 ${fy - 18} 592 ${fy - 40} L598 ${fy - 8} Q545 ${fy + 14} 492 ${fy - 8}Z" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      ${[-36, -12, 12, 36].map((x) => `<path d="M${545 + x} 322 V362" stroke="#0A1D37" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>`).join('')}
      ${[[-34, 6], [-14, 12], [8, 12], [28, 6], [-24, -8], [0, -6], [22, -8], [-8, 2]].map(([x, y]) => `<circle cx="${545 + x * 1.3}" cy="${fy - 18 + y}" r="7" fill="url(#goldV)" stroke="#6B4F1C" stroke-width="1"/>`).join('')}
      ${[-44, 44].map((x) => `<circle cx="${545 + x * 1.15}" cy="${fy - 30}" r="5.5" fill="url(#goldV)" stroke="#6B4F1C" stroke-width="1"/>`).join('')}
    </g>`
  const rod = (y) => `
    <g>
      <ellipse cx="400" cy="${y + 12}" rx="330" ry="6" fill="#000" opacity=".5" filter="url(#b5)"/>
      <rect x="90" y="${y - 8}" width="620" height="18" rx="5" fill="url(#steelV)" stroke="#2A394C" stroke-width="1.5"/>
      <rect x="62" y="${y - 12}" width="46" height="26" rx="5" fill="url(#steelV)" stroke="#2A394C" stroke-width="1.5"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${70 + i * 8} ${y - 12} v26" stroke="#2A394C" stroke-width="1.6"/>`).join('')}
      <rect x="692" y="${y - 12}" width="46" height="26" rx="5" fill="url(#steelV)" stroke="#2A394C" stroke-width="1.5"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${700 + i * 8} ${y - 12} v26" stroke="#2A394C" stroke-width="1.6"/>`).join('')}
      <rect x="100" y="${y - 8}" width="590" height="4" fill="#fff" opacity=".35"/>
      <rect x="62" y="${y - 12}" width="8" height="26" rx="3" fill="url(#goldH)"/><rect x="730" y="${y - 12}" width="8" height="26" rx="3" fill="url(#goldH)"/>
    </g>`
  return frame(W, H, 'Drill bits, hammer and drill rods', `
    <linearGradient id="floorfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030A16" stop-opacity="0"/><stop offset=".55" stop-color="#030A16" stop-opacity=".7"/><stop offset="1" stop-color="#030A16" stop-opacity=".95"/></linearGradient>
    <rect width="${W}" height="${H}" fill="#06122A"/>
    <rect width="${W}" height="${H}" fill="url(#spot)"/>
    <ellipse cx="400" cy="140" rx="360" ry="190" fill="#7CBBE4" opacity=".12" filter="url(#b30)"/>
    <ellipse cx="650" cy="120" rx="200" ry="120" fill="#D2AA5C" opacity=".10" filter="url(#b30)"/>
    <rect y="${fy}" width="${W}" height="${H - fy}" fill="#030A16"/>
    <rect y="${fy}" width="${W}" height="${H - fy}" fill="url(#spot)" opacity=".55"/>
    <rect y="${fy}" width="${W}" height="2" fill="#7CBBE4" opacity=".4"/>
    <g opacity=".22" transform="translate(0 ${fy * 2 - 4}) scale(1 -1)">${bits}</g>
    <rect y="${fy}" width="${W}" height="${H - fy}" fill="url(#floorfade)"/>
    ${bits}
    ${rod(498)}${rod(556)}`)
}

// ---------- cutaways ----------
const surfY = 200
const cutawayBase = (extraAbove = '', st = {}) => {
  const s = strata(W, H, surfY, { aquiferY: surfY + 230, aquiferH: 84, seed: 5, ...st })
  return `
    ${sky(W, H, 'day', surfY - 10, W * 0.78)}
    ${hills(W, surfY - 70, 24, '#A5C9E2', 51, 0.95, 140)}
    ${hills(W, surfY - 36, 16, '#76A6C9', 52, 1, 110)}
    ${s.svg}
    ${extraAbove}`
}

scenes['survey'] = () => frame(W, H, 'Groundwater survey of underground layers', `
  ${cutawayBase(`
    <!-- surveyor + tripod instrument -->
    <g transform="translate(150 ${surfY + 2})">
      <path d="M0 -62 L-30 0 M0 -62 L30 0 M0 -62 L2 0" stroke="#18222F" stroke-width="5" stroke-linecap="round"/>
      <rect x="-16" y="-92" width="32" height="30" rx="6" fill="url(#brand)" stroke="#071426" stroke-width="2"/><rect x="-16" y="-80" width="32" height="6" fill="url(#goldV)"/>
      <circle cx="0" cy="-102" r="8" fill="url(#steelV)"/>
    </g>
    ${worker(205, surfY + 6, 0.95, -1)}
    <!-- probe points -->
    ${[250, 340, 430, 520, 610, 700].map((x, i) => `<path d="M${x} ${surfY - 2} l-7 -14 h14z" fill="${i === 3 ? '#FF5C4D' : 'url(#goldV)'}"/><path d="M${x} ${surfY + 4} V${i === 3 ? surfY + 220 : surfY + 70 + (i % 3) * 30}" stroke="#F5E9C8" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="4 5"/>`).join('')}
    ${[1, 2, 3].map((k) => `<path d="M150 ${surfY + 4} Q${300 + k * 90} ${surfY + 40 + k * 70} ${440 + k * 110} ${surfY + 40 + k * 50}" fill="none" stroke="#F5E9C8" stroke-opacity="${0.55 - k * 0.1}" stroke-width="1.8" stroke-dasharray="3 6"/>`).join('')}
    <!-- proposed bore -->
    <rect x="504" y="${surfY + 4}" width="32" height="226" fill="#F5E9C8" opacity=".12"/>
    <circle cx="520" cy="${surfY + 230}" r="34" fill="#9ED7FF" opacity=".4" filter="url(#b12)"/>
    <circle cx="520" cy="${surfY + 258}" r="10" fill="none" stroke="#fff" stroke-width="3"/><circle cx="520" cy="${surfY + 258}" r="4" fill="#FF5C4D"/>
    ${depthRuler(W - 40, surfY + 10, H - 20, 70)}
  `)}
  <rect x="0" y="${surfY + 160}" width="${W}" height="120" fill="#7CBBE4" opacity=".05"/>`)

scenes['pump'] = () => {
  const bx = 360, bottom = surfY + 300, waterY = surfY + 110
  return frame(W, H, 'Submersible pump installed in a borewell', `
    ${cutawayBase(`
      ${bore(bx, surfY, bottom, { casingTo: surfY + 220, water: waterY, w: 52 })}
      <!-- riser, cable, pump -->
      <path d="M${bx - 6} ${surfY - 34} V${surfY + 214}" stroke="#18222F" stroke-width="12"/><path d="M${bx - 6} ${surfY - 34} V${surfY + 214}" stroke="url(#steelH)" stroke-width="8"/>
      <path d="M${bx + 8} ${surfY - 20} V${surfY + 226}" stroke="#05080D" stroke-width="4"/>
      <rect x="${bx - 20}" y="${surfY + 212}" width="40" height="84" rx="12" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <rect x="${bx - 20}" y="${surfY + 236}" width="40" height="9" fill="url(#goldH)"/><rect x="${bx - 20}" y="${surfY + 268}" width="40" height="7" fill="url(#goldH)"/>
      ${Array.from({ length: 6 }, (_, i) => `<path d="M${bx - 18} ${surfY + 216 + i * 14} h36" stroke="#2A394C" stroke-opacity=".5"/>`).join('')}
      <!-- surface pipe + tank -->
      <path d="M${bx - 6} ${surfY - 34} Q${bx - 6} ${surfY - 50} ${bx + 12} ${surfY - 50} H580 V${surfY - 132}" fill="none" stroke="#18222F" stroke-width="13" stroke-linejoin="round"/>
      <path d="M${bx - 6} ${surfY - 34} Q${bx - 6} ${surfY - 50} ${bx + 12} ${surfY - 50} H580 V${surfY - 132}" fill="none" stroke="url(#steelH)" stroke-width="8" stroke-linejoin="round"/>
      <g transform="translate(580 ${surfY}) scale(.8)">
        <path d="M-50 0 L-40 -62 M50 0 L40 -62" stroke="#18222F" stroke-width="7" stroke-linecap="round"/>
        <rect x="-62" y="-198" width="124" height="138" rx="26" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
        <rect x="-58" y="-194" width="116" height="30" rx="14" fill="#fff" opacity=".18"/>
        <rect x="-62" y="-130" width="124" height="9" fill="url(#goldV)"/>
        <rect x="-18" y="-216" width="36" height="22" rx="6" fill="url(#steelV)"/>
        <path d="M-1 -166 q0 6 -3 12" stroke="url(#waterSpray)" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <!-- control panel -->
      <g transform="translate(150 ${surfY})">
        <rect x="-4" y="-104" width="8" height="104" fill="#18222F"/>
        <rect x="-36" y="-170" width="72" height="84" rx="8" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
        <rect x="-36" y="-170" width="72" height="14" rx="6" fill="#fff" opacity=".16"/>
        <circle cx="-14" cy="-134" r="6" fill="#4ADE80"/><circle cx="-14" cy="-134" r="14" fill="#4ADE80" opacity=".35" filter="url(#b5)"/>
        <rect x="2" y="-140" width="26" height="12" rx="3" fill="#06101D"/><rect x="-26" y="-108" width="52" height="8" rx="3" fill="url(#goldV)"/>
      </g>
      <path d="M154 ${surfY - 30} Q250 ${surfY - 20} ${bx + 8} ${surfY - 20}" fill="none" stroke="#05080D" stroke-width="4"/>
      ${depthRuler(W - 40, surfY + 10, H - 20, 70, false)}
    `)}`)
}

scenes['cleaning'] = () => {
  const bx = 400, bottom = surfY + 300
  const r = (i) => ((i * 9301 + 49297) % 233280) / 233280
  return frame(W, H, 'Borewell cleaning removing silt and debris', `
    ${cutawayBase(`
      ${bore(bx, surfY, bottom, { casingTo: surfY + 200, water: surfY + 80, w: 54 })}
      <rect x="${bx - 26}" y="${surfY + 80}" width="52" height="${bottom - surfY - 80}" fill="#8A6A44" opacity=".55"/>
      <!-- tripod + winch cable -->
      <g transform="translate(${bx} ${surfY})">
        <path d="M0 -150 L-80 0 M0 -150 L80 0 M0 -150 L6 0" stroke="#18222F" stroke-width="9" stroke-linecap="round"/>
        <path d="M0 -150 L-80 0 M0 -150 L80 0" stroke="url(#goldV)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="0" cy="-152" r="14" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
        <path d="M0 -138 V220" stroke="#05080D" stroke-width="3"/>
        <path d="M-14 -152 L-66 -118" stroke="#05080D" stroke-width="3"/>
      </g>
      <g transform="translate(${bx - 150} ${surfY})"><rect x="-26" y="-50" width="52" height="40" rx="8" fill="url(#brand)" stroke="#071426" stroke-width="2"/><circle cx="0" cy="-30" r="12" fill="url(#steelV)"/><rect x="-26" y="-22" width="52" height="6" fill="url(#goldV)"/><path d="M-20 -10 L-24 0 M20 -10 L24 0" stroke="#18222F" stroke-width="5"/></g>
      <!-- brush head -->
      <g transform="translate(${bx} ${surfY + 214})">
        <rect x="-5" y="-14" width="10" height="20" fill="url(#steelH)"/>
        <rect x="-8" y="6" width="16" height="58" rx="5" fill="url(#steelH)"/>
        ${Array.from({ length: 22 }, (_, i) => `<path d="M0 ${10 + (i % 11) * 5} L${i % 2 ? 22 : -22} ${6 + (i % 11) * 5 - 3}" stroke="url(#goldV)" stroke-width="2.2" stroke-linecap="round"/>`).join('')}
      </g>
      <!-- rising debris + bubbles -->
      ${Array.from({ length: 34 }, (_, i) => `<circle cx="${bx - 20 + r(i) * 40}" cy="${surfY + 90 + r(i + 40) * 200}" r="${1.2 + r(i + 90) * 3}" fill="${i % 3 ? '#C9A56B' : '#E8F6FF'}" opacity="${0.4 + r(i + 7) * 0.5}"/>`).join('')}
      <!-- muddy discharge at the surface -->
      <path d="M${bx + 24} ${surfY - 12} Q${bx + 90} ${surfY - 40} ${bx + 120} ${surfY - 4}" fill="none" stroke="#8A6A44" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="${bx + 140}" cy="${surfY + 4}" rx="48" ry="8" fill="#7A5A38"/><ellipse cx="${bx + 140}" cy="${surfY + 2}" rx="30" ry="4" fill="#A3825A"/>
      ${depthRuler(W - 40, surfY + 10, H - 20, 70, false)}
    `)}`)
}

scenes['flushing'] = () => {
  const bx = 470, bottom = surfY + 296
  return frame(W, H, 'Compressor flushing a borewell', `
    ${cutawayBase(`
      ${bore(bx, surfY, bottom, { casingTo: surfY + 190, water: surfY + 200, w: 50 })}
      <!-- air line + fractures -->
      <path d="M${bx} ${surfY - 20} V${surfY + 252}" stroke="#05080D" stroke-width="8"/><path d="M${bx} ${surfY - 20} V${surfY + 252}" stroke="url(#goldH)" stroke-width="4"/>
      ${[[-1, 60], [1, 90], [-1, 40], [1, 70]].map(([d, l], i) => `<path d="M${bx + d * 25} ${surfY + 232 + i * 14} q${d * l * 0.5} -${10 + i * 6} ${d * l} ${14 - i * 4}" fill="none" stroke="#9ED7FF" stroke-width="3" stroke-linecap="round" opacity=".85"/>`).join('')}
      <!-- compressor -->
      <g transform="translate(120 ${surfY + 10}) scale(.62)">${compressorUnit()}</g>
      <path d="M${120 + 386 * 0.62} ${surfY + 10 - 130 * 0.62} Q${bx - 60} ${surfY - 56} ${bx - 10} ${surfY - 22}" fill="none" stroke="#0B1119" stroke-width="7" stroke-linecap="round"/>
      <!-- eruption -->
      ${splash(bx, surfY - 8, 1.25, 8)}
      <ellipse cx="${bx}" cy="${surfY - 90}" rx="26" ry="90" fill="#fff" opacity=".35" filter="url(#b12)"/>
      ${depthRuler(W - 40, surfY + 10, H - 20, 70, false)}
    `)}`)
}

scenes['openwell'] = () => {
  const cx = 400, gy = 210, wallW = 150, bottom = 560, waterY = 440
  const s = strata(W, H, gy, { aquiferY: gy + 250, aquiferH: 80, seed: 6 })
  return frame(W, H, 'Openwell drilling and stone-lined open well', `
    ${sky(W, H, 'day', gy - 10, W * 0.2)}
    ${hills(W, gy - 70, 24, '#A5C9E2', 61, 0.95, 140)}
    ${hills(W, gy - 36, 16, '#76A6C9', 62, 1, 110)}
    ${s.svg}
    <pattern id="brick" width="46" height="22" patternUnits="userSpaceOnUse"><rect width="46" height="22" fill="#9C7A54"/><path d="M0 11 H46 M23 0 V11 M0 11 V22 M46 11 V22" stroke="#4E3822" stroke-width="2"/><rect width="46" height="22" fill="#fff" opacity=".04"/></pattern>
    <linearGradient id="wellshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>
    <linearGradient id="welldepth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
    <rect x="${cx - wallW}" y="${gy}" width="${wallW * 2}" height="${bottom - gy}" fill="url(#brick)"/>
    <rect x="${cx - wallW}" y="${gy}" width="${wallW * 2}" height="${bottom - gy}" fill="url(#wellshade)"/>
    <rect x="${cx - wallW}" y="${gy}" width="${wallW * 2}" height="${bottom - gy}" fill="url(#welldepth)"/>
    <rect x="${cx - wallW + 2}" y="${waterY}" width="${wallW * 2 - 4}" height="${bottom - waterY}" fill="url(#aquifer)"/>
    <ellipse cx="${cx}" cy="${waterY + 2}" rx="${wallW - 8}" ry="9" fill="#BFE6FA" opacity=".6"/>
    ${[0, 1, 2].map((i) => `<ellipse cx="${cx - 40 + i * 50}" cy="${waterY + 14 + i * 12}" rx="${34 - i * 6}" ry="4" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`).join('')}
    <path d="M${cx - wallW} ${gy} V${bottom} M${cx + wallW} ${gy} V${bottom}" stroke="#2A1A0F" stroke-width="5"/>
    <!-- parapet -->
    <rect x="${cx - wallW - 18}" y="${gy - 34}" width="${wallW * 2 + 36}" height="38" rx="6" fill="url(#brick)" stroke="#2A1A0F" stroke-width="3"/>
    <rect x="${cx - wallW - 18}" y="${gy - 38}" width="${wallW * 2 + 36}" height="9" rx="4" fill="#C9B79B"/>
    <!-- tripod + bucket -->
    <g transform="translate(${cx} ${gy - 36})">
      <path d="M0 -110 L-84 0 M0 -110 L84 0" stroke="#4A3220" stroke-width="9" stroke-linecap="round"/>
      <path d="M0 -110 L-84 0 M0 -110 L84 0" stroke="#9C7A54" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      <circle cx="0" cy="-112" r="14" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      <path d="M0 -100 V206" stroke="#2A1A0F" stroke-width="3"/>
      <g transform="translate(0 206)"><path d="M-16 0 H16 L12 30 H-12Z" fill="url(#goldV)" stroke="#6B4F1C" stroke-width="2"/><path d="M-16 0 Q0 -22 16 0" fill="none" stroke="#2A1A0F" stroke-width="2.5"/><ellipse cx="0" cy="1" rx="16" ry="4" fill="#8FD0F2"/></g>
    </g>
    <g transform="translate(110 ${gy + 2})">${tree(170, 3)}</g><g transform="translate(700 ${gy + 2})">${tree(150, 8)}</g>`)
}

scenes['maintenance'] = () => {
  const gy = 470, cx = 330
  return frame(W, H, 'Borewell head, valves and pressure gauge being maintained', `
    ${duskBackdrop(gy, W, H, W * 0.82)}
    <rect x="${cx - 120}" y="${gy - 6}" width="240" height="24" rx="6" fill="#8B8F96"/><rect x="${cx - 120}" y="${gy - 6}" width="240" height="6" rx="3" fill="#C4C8CE"/>
    <g transform="translate(${cx} ${gy - 6})">
      <ellipse cx="40" cy="22" rx="150" ry="9" fill="#000" opacity=".45" filter="url(#b5)"/>
      <!-- casing + flange -->
      <rect x="-24" y="-250" width="48" height="250" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
      <rect x="-48" y="-30" width="96" height="16" rx="3" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      ${[-38, -18, 18, 38].map((x) => `<circle cx="${x}" cy="-22" r="4.5" fill="url(#goldV)" stroke="#6B4F1C"/>`).join('')}
      <rect x="-38" y="-258" width="76" height="14" rx="4" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      <!-- tee + valve + pipe -->
      <rect x="22" y="-160" width="190" height="40" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      <rect x="198" y="-176" width="14" height="72" rx="3" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
      <rect x="86" y="-186" width="56" height="92" rx="12" fill="url(#brand)" stroke="#071426" stroke-width="2"/><rect x="86" y="-150" width="56" height="8" fill="url(#goldV)"/>
      <rect x="110" y="-236" width="8" height="50" fill="url(#steelH)"/><circle cx="114" cy="-240" r="34" fill="none" stroke="url(#goldV)" stroke-width="9"/><path d="M80 -240 H148 M114 -274 V-206" stroke="url(#goldV)" stroke-width="6"/>
      <!-- pressure gauge -->
      <rect x="-4" y="-196" width="8" height="38" fill="url(#steelH)"/><circle cx="0" cy="-224" r="34" fill="#E9F0F6" stroke="url(#goldV)" stroke-width="8"/><circle cx="0" cy="-224" r="26" fill="#0A1D37"/>
      ${Array.from({ length: 11 }, (_, i) => { const a = (-225 + i * 27) * Math.PI / 180; return `<path d="M${Math.cos(a) * 20} ${-224 + Math.sin(a) * 20} L${Math.cos(a) * 25} ${-224 + Math.sin(a) * 25}" stroke="#fff" stroke-width="2"/>` }).join('')}
      <path d="M0 -224 L16 -238" stroke="#FF5C4D" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-224" r="4" fill="#E9F0F6"/>
      <path d="M-20 -266 q20 -12 40 0" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>
    </g>
    ${worker(560, gy + 80, 2.1, -1)}
    ${rocks(70, gy + 90, 5, 5, 18)}
    ${grass(W, H - 2, 45, '#2A1B10', 40, 14, 40)}`)
}

// ---------- projects ----------
const smallRig = (x, gy, s = 0.62) => `<g transform="translate(${x} ${gy + 12}) scale(${s})">${rigTruck()}</g>${splash(x, gy + 14, s)}`

scenes['residential'] = () => {
  const gy = 470
  return frame(W, H, 'Residential borewell project at a family home', `
    ${duskBackdrop(gy, W, H, W * 0.85)}
    <path d="M0 ${gy + 62} Q200 ${gy + 52} 420 ${gy + 62}" stroke="#4C9A4F" stroke-width="22" stroke-linecap="round" fill="none" opacity=".8"/>
    <g transform="translate(60 ${gy + 18}) scale(.9)">${house()}</g>
    <g transform="translate(760 ${gy + 30})">${tree(140, 11)}</g>
    ${smallRig(430, gy + 20, 0.62)}
    ${worker(380, gy + 92, 1.2, 1)}
    ${grass(W, H - 2, 46, '#2A1B10', 40, 14, 40)}`)
}

scenes['agricultural'] = () => {
  const gy = 330
  let rows = ''
  const vx = 400
  for (let i = -9; i <= 9; i++) {
    const x2 = vx + i * 150
    rows += `<path d="M${vx + i * 7} ${gy} L${x2} ${H}" stroke="${i % 2 ? '#2F7A3C' : '#3E9A4A'}" stroke-width="${Math.abs(i) * 4 + 8}" opacity=".95"/>`
  }
  return frame(W, H, 'Agricultural borewell supplying a green farm', `
    ${sky(W, H, 'dusk', gy, W * 0.2)}
    ${hills(W, gy - 54, 20, '#3A5C86', 71, 0.9, 140)}
    ${hills(W, gy - 22, 14, '#274A72', 72, 1, 110)}
    <rect y="${gy}" width="${W}" height="${H - gy}" fill="#4E8F3D"/>
    <rect y="${gy}" width="${W}" height="${H - gy}" fill="url(#soil)" opacity=".4"/>
    ${rows}
    <rect y="${gy}" width="${W}" height="${H - gy}" fill="url(#vignette)" opacity=".5"/>
    <rect y="${gy}" width="${W}" height="2" fill="#F2C887" opacity=".7"/>
    ${[90, 180, 640, 720].map((x, i) => `<g transform="translate(${x} ${gy + 6})">${tree(60 + (i % 2) * 20, i + 20)}</g>`).join('')}
    <!-- irrigation channel -->
    <path d="M300 ${H} Q330 ${gy + 190} 410 ${gy + 100}" stroke="#2A6FA0" stroke-width="34" stroke-linecap="round" fill="none"/>
    <path d="M300 ${H} Q330 ${gy + 190} 410 ${gy + 100}" stroke="#7CBBE4" stroke-width="16" stroke-linecap="round" fill="none" opacity=".8"/>
    <path d="M308 ${H - 40} Q336 ${gy + 190} 410 ${gy + 106}" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>
    ${smallRig(430, gy + 120, 0.7)}
    ${worker(560, gy + 200, 1.4, -1)}
    ${grass(W, H - 2, 47, '#1E4F2A', 60, 14, 46)}`)
}

scenes['commercial'] = () => {
  const gy = 470
  const tower = (x, w, h, seed) => {
    let wins = ''
    for (let yy = gy - h + 18; yy < gy - 24; yy += 24) for (let xx = x + 10; xx < x + w - 14; xx += 20) wins += `<rect x="${xx}" y="${yy}" width="13" height="14" fill="${((xx * 7 + yy * 3 + seed) % 5) === 0 ? '#FFD27A' : '#6FB1DE'}" opacity="${0.55 + ((xx + yy + seed) % 4) * 0.1}"/>`
    return `<rect x="${x}" y="${gy - h}" width="${w}" height="${h}" fill="url(#brandDark)"/><rect x="${x}" y="${gy - h}" width="${w}" height="${h}" fill="url(#glass)" opacity=".22"/>${wins}<rect x="${x}" y="${gy - h}" width="${w}" height="5" fill="url(#goldV)"/>`
  }
  return frame(W, H, 'Commercial building borewell project', `
    ${duskBackdrop(gy, W, H, W * 0.25)}
    ${tower(60, 130, 330, 1)}${tower(210, 170, 260, 2)}${tower(400, 110, 200, 3)}
    <rect x="0" y="${gy}" width="${W}" height="${H - gy}" fill="#3B4658"/>
    <rect x="0" y="${gy}" width="${W}" height="${H - gy}" fill="url(#soilTex)" opacity=".25"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 120 - 20} ${H} L${380 + i * 6} ${gy}" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>`).join('')}
    <rect x="0" y="${gy}" width="${W}" height="3" fill="#F2C887" opacity=".6"/>
    ${smallRig(380, gy + 60, 0.76)}
    ${worker(330, gy + 135, 1.45, 1, '#E5B24E', '#FFFFFF')}`)
}

scenes['industrial'] = () => {
  const gy = 470
  const saw = (x, w, h) => {
    let d = `M${x} ${gy} V${gy - h}`
    const n = Math.round(w / 56)
    for (let i = 0; i < n; i++) d += ` l0 -34 l56 34`
    return `<path d="${d} V${gy}Z" fill="url(#brandDark)" stroke="#071426" stroke-width="2"/>`
  }
  return frame(W, H, 'Industrial borewell project at a factory', `
    ${sky(W, H, 'dusk', gy - 30, W * 0.82)}
    ${hills(W, gy - 70, 24, '#3A4C70', 81, 0.9, 130)}
    ${saw(50, 336, 120)}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${72 + i * 54}" y="${gy - 78}" width="30" height="20" fill="#FFD27A" opacity=".85"/>`).join('')}
    <rect x="404" y="${gy - 230}" width="30" height="230" fill="url(#steelH)"/><rect x="398" y="${gy - 238}" width="42" height="12" fill="url(#goldV)"/>
    <rect x="456" y="${gy - 180}" width="24" height="180" fill="url(#steelH)"/><rect x="451" y="${gy - 188}" width="34" height="10" fill="url(#goldV)"/>
    <ellipse cx="420" cy="${gy - 270}" rx="52" ry="30" fill="#E8D5B6" opacity=".25" filter="url(#b12)"/><ellipse cx="470" cy="${gy - 300}" rx="64" ry="34" fill="#E8D5B6" opacity=".18" filter="url(#b12)"/>
    <!-- storage tanks + pipes -->
    <rect x="500" y="${gy - 110}" width="86" height="110" rx="10" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/><rect x="500" y="${gy - 70}" width="86" height="8" fill="url(#goldV)"/>
    <rect x="596" y="${gy - 90}" width="70" height="90" rx="10" fill="url(#steelH)" stroke="#2A394C" stroke-width="2"/>
    <path d="M440 ${gy - 20} H500 M586 ${gy - 40} H596" stroke="#18222F" stroke-width="9"/>
    ${groundBlock(W, gy, H)}
    <rect x="0" y="${gy}" width="${W}" height="${H - gy}" fill="#2B3445" opacity=".45"/>
    ${smallRig(250, gy + 70, 0.78)}
    ${worker(160, gy + 130, 1.45, 1)}
    ${rocks(700, gy + 100, 5, 5, 18)}
    ${grass(W, H - 2, 48, '#1A1209', 30, 12, 34)}`)
}

const names = Object.keys(scenes).filter((n) => !only.length || only.includes(n))
const has = (cmd) => { try { execFileSync('which', [cmd], { stdio: 'ignore' }); return true } catch { return false } }
const canRaster = has('rsvg-convert') && has('cwebp')
if (!canRaster) console.warn('rsvg-convert / cwebp not found: wrote SVG only (brew install librsvg webp)')

for (const n of names) {
  const svg = join(svgOut, `${n}.svg`)
  writeFileSync(svg, scenes[n]())
  if (!canRaster) continue
  const hero = n === 'hero-rig'
  const png = join(tmpdir(), `bw-${n}.png`)
  execFileSync('rsvg-convert', ['-w', hero ? '1920' : '1000', svg, '-o', png])
  execFileSync('cwebp', ['-quiet', '-q', hero ? '90' : '88', '-m', '5', '-sns', '0', '-f', '0', '-sharp_yuv', png, '-o', join(out, `${n}.webp`)])
  if (hero) {
    // social share image (1200x630 JPEG): center-crop of the hero
    const og = join(tmpdir(), 'bw-og.png')
    execFileSync('rsvg-convert', ['-w', '1200', svg, '-o', og])
    execFileSync('sips', ['-c', '630', '1200', '-s', 'format', 'jpeg', '-s', 'formatOptions', '85', og, '--out', join(out, 'og-image.jpg')], { stdio: 'ignore' })
  }
  rmSync(png, { force: true })
}
console.log(`Wrote ${names.length} images to ${out}`)
