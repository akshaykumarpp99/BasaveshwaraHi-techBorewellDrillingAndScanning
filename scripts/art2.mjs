// Second-tier drawing helpers: other machines, cutaways, buildings, product shots.
import { rng, wheel, lattice, cab } from './art.mjs'

const stripes = (x, y, n, w = 10, h = 14, color = '#E5B24E') =>
  Array.from({ length: n }, (_, i) => `<path d="M${x + i * w * 1.4} ${y} l${w * 0.7} ${h} h${w * 0.7}z" fill="${color}"/>`).join('')

/** Crawler-mounted hydraulic drilling rig. Origin = ground under the left of the tracks. Hole is at x≈+262. */
export function crawlerRig() {
  const theta = 12
  const baseX = 286, baseY = -128
  const mastLen = 330
  const holeX = baseX - Math.tan((theta * Math.PI) / 180) * Math.abs(baseY)
  return {
    holeX,
    svg: `
  <ellipse cx="150" cy="3" rx="190" ry="10" fill="#000" opacity=".5" filter="url(#b5)"/>
  <!-- tracks -->
  <rect x="-6" y="-68" width="312" height="68" rx="34" fill="#0C1119"/>
  <rect x="0" y="-62" width="300" height="56" rx="28" fill="url(#tire)" stroke="#2A3342" stroke-width="3"/>
  <rect x="2" y="-61" width="296" height="54" rx="27" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="7" stroke-dasharray="6 6"/>
  ${[44, 92, 140, 188, 236].map((x) => `<circle cx="${x}" cy="-30" r="14" fill="url(#rim)" stroke="#0b1018" stroke-width="2"/><circle cx="${x}" cy="-30" r="4" fill="#1B2535"/>`).join('')}
  <circle cx="30" cy="-34" r="22" fill="url(#goldH)" stroke="#0b1018" stroke-width="2"/><circle cx="272" cy="-34" r="22" fill="url(#goldH)" stroke="#0b1018" stroke-width="2"/>
  <rect x="14" y="-88" width="272" height="28" rx="4" fill="#18222F"/>
  <rect x="14" y="-92" width="272" height="8" rx="3" fill="url(#goldV)"/>
  <!-- engine house -->
  <rect x="26" y="-196" width="164" height="106" rx="9" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
  <rect x="28" y="-194" width="160" height="14" rx="6" fill="#fff" opacity=".14"/>
  <rect x="26" y="-146" width="164" height="9" fill="url(#goldV)"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="40" y="${-184 + i * 8}" width="64" height="4" rx="2" fill="#061326"/>`).join('')}
  <path d="M118 -196 V-90" stroke="#071426" stroke-width="2"/><path d="M146 -128 q9 -22 18 0 q-9 16 -18 0z" fill="url(#goldV)"/>
  <rect x="62" y="-228" width="22" height="34" rx="3" fill="url(#steelH)"/><rect x="58" y="-236" width="30" height="10" rx="3" fill="url(#steelV)"/>
  <!-- operator cab -->
  <path d="M190 -90 V-190 Q190 -204 204 -204 H242 Q252 -204 256 -196 L272 -150 V-90Z" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
  <path d="M202 -194 H240 Q246 -194 249 -188 L258 -158 H202Z" fill="url(#glass)" stroke="#071426" stroke-width="2"/>
  <path d="M208 -192 H232 L214 -160 H208Z" fill="#fff" opacity=".28"/>
  <circle cx="256" cy="-216" r="4" fill="#FF5C4D"/><circle cx="256" cy="-216" r="14" fill="#FF5C4D" opacity=".3" filter="url(#b5)"/>
  <!-- mast (rotated about its base) -->
  <g transform="translate(${baseX} ${baseY}) rotate(${theta})">
    <ellipse cx="0" cy="0" rx="30" ry="9" fill="#18222F"/>
    <rect x="-24" y="-${mastLen}" width="6" height="${mastLen}" fill="url(#goldH)"/><rect x="18" y="-${mastLen}" width="6" height="${mastLen}" fill="url(#goldH)"/>
    <g transform="translate(0 0)">${lattice(-21, 21, -mastLen + 10, 0, 32)}</g>
    <rect x="-30" y="-${mastLen + 14}" width="60" height="16" rx="4" fill="url(#steelV)"/>
    <rect x="-17" y="-${mastLen * 0.62}" width="34" height="46" rx="5" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
    <rect x="-17" y="-${mastLen * 0.62 + 22}" width="34" height="7" fill="url(#goldV)"/>
    <rect x="-4.5" y="-${mastLen * 0.62 - 46}" width="9" height="${mastLen * 0.62 - 46 + Math.abs(baseY) / Math.cos((theta * Math.PI) / 180) + 4}" fill="url(#steelH)"/>
    ${[0.3, 0.14, -0.1].map((f) => `<rect x="-6.5" y="${-mastLen * f}" width="13" height="8" rx="2" fill="url(#steelH)"/>`).join('')}
  </g>
  <path d="M200 -120 L${baseX + 10} -200" stroke="#18222F" stroke-width="12" stroke-linecap="round"/><path d="M200 -120 L${baseX + 10} -200" stroke="url(#steelH)" stroke-width="7" stroke-linecap="round"/>
  ${stripes(10, -22, 4, 8, 12)}
  `,
  }
}

/** Trailer-mounted screw compressor. Origin = ground under the wheel axle line start; towbar to the left. */
export function compressorUnit() {
  return `
  <ellipse cx="190" cy="3" rx="220" ry="10" fill="#000" opacity=".5" filter="url(#b5)"/>
  <!-- drawbar + jockey -->
  <path d="M60 -66 L-70 -56" stroke="#18222F" stroke-width="12" stroke-linecap="round"/><path d="M60 -66 L-70 -56" stroke="url(#steelH)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="-74" cy="-54" r="8" fill="none" stroke="url(#goldH)" stroke-width="5"/>
  <rect x="-26" y="-60" width="9" height="46" rx="2" fill="url(#steelH)"/><circle cx="-21" cy="-10" r="10" fill="url(#tire)" stroke="#2A3342" stroke-width="2"/>
  <!-- chassis -->
  <rect x="40" y="-82" width="320" height="22" rx="4" fill="#111A26"/>
  ${wheel(190, 44)}
  <path d="M142 -70 A48 48 0 0 1 238 -70" fill="none" stroke="#0B1119" stroke-width="9" stroke-linecap="round"/>
  <!-- canopy -->
  <rect x="44" y="-228" width="312" height="150" rx="14" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
  <rect x="48" y="-226" width="304" height="20" rx="9" fill="#fff" opacity=".14"/>
  <rect x="44" y="-158" width="312" height="12" fill="url(#goldV)"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="62" y="${-212 + i * 9}" width="104" height="4.5" rx="2" fill="#061326"/>`).join('')}
  <path d="M190 -228 V-78 M290 -228 V-78" stroke="#071426" stroke-width="2"/>
  <rect x="200" y="-124" width="36" height="5" rx="2" fill="url(#steelV)"/>
  <!-- gauge -->
  <circle cx="318" cy="-190" r="21" fill="#E9F0F6" stroke="url(#goldV)" stroke-width="5"/><circle cx="318" cy="-190" r="16" fill="#0A1D37"/>
  ${Array.from({ length: 9 }, (_, i) => { const a = (-210 + i * 30) * Math.PI / 180; return `<path d="M${318 + Math.cos(a) * 12} ${-190 + Math.sin(a) * 12} L${318 + Math.cos(a) * 15} ${-190 + Math.sin(a) * 15}" stroke="#fff" stroke-width="1.5"/>` }).join('')}
  <path d="M318 -190 L328 -200" stroke="#FF5C4D" stroke-width="2.5" stroke-linecap="round"/><circle cx="318" cy="-190" r="2.5" fill="#E9F0F6"/>
  <path d="M310 -138 q9 -22 18 0 q-9 16 -18 0z" fill="url(#goldV)"/>
  <!-- exhaust + intake -->
  <rect x="90" y="-262" width="18" height="36" rx="3" fill="url(#steelH)"/><rect x="84" y="-270" width="30" height="10" rx="3" fill="url(#steelV)"/>
  <rect x="236" y="-244" width="64" height="18" rx="4" fill="url(#brandDark)" stroke="#071426" stroke-width="2"/>
  <!-- outlet manifold + hoses -->
  <rect x="356" y="-136" width="28" height="12" rx="3" fill="url(#steelH)"/><rect x="356" y="-112" width="28" height="12" rx="3" fill="url(#steelH)"/>
  <circle cx="386" cy="-130" r="9" fill="url(#goldV)"/><circle cx="386" cy="-106" r="9" fill="url(#goldV)"/>
  <path d="M386 -106 C430 -100 452 -70 436 -40 S 430 -8 470 -6" fill="none" stroke="#0B1119" stroke-width="9" stroke-linecap="round"/>
  <path d="M386 -106 C430 -100 452 -70 436 -40 S 430 -8 470 -6" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2" stroke-linecap="round"/>
  <!-- tail lights + mud flap -->
  <rect x="352" y="-98" width="8" height="14" rx="2" fill="#FF5C4D"/><rect x="238" y="-60" width="10" height="26" rx="2" fill="#0B1119"/>
  ${stripes(60, -78, 5, 8, 12)}`
}

/** Water tanker, cab right. Origin = ground at rear; uses the shared cab(). */
export function tankerTruck() {
  return `
  <ellipse cx="250" cy="3" rx="285" ry="11" fill="#000" opacity=".5" filter="url(#b5)"/>
  ${wheel(110)}${wheel(192)}${wheel(444)}
  <rect x="20" y="-100" width="492" height="26" rx="4" fill="#111A26"/>
  ${[110, 192, 444].map((cx) => `<path d="M${cx - 47} -72 A47 47 0 0 1 ${cx + 47} -72" fill="none" stroke="#0B1119" stroke-width="8" stroke-linecap="round"/>`).join('')}
  <!-- tank -->
  <rect x="26" y="-246" width="362" height="150" rx="75" fill="url(#steelV)" stroke="#2A394C" stroke-width="2"/>
  <rect x="26" y="-246" width="362" height="150" rx="75" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" transform="translate(0 3)" opacity=".4"/>
  <path d="M60 -200 H356 L356 -150 H60Z" fill="url(#brand)" opacity=".92"/>
  <rect x="60" y="-152" width="296" height="7" fill="url(#goldV)"/><rect x="60" y="-200" width="296" height="4" fill="url(#goldV)" opacity=".6"/>
  <path d="M208 -196 C208 -196 188 -170 188 -160 a20 20 0 0 0 40 0 C228 -170 208 -196 208 -196Z" fill="#fff" opacity=".95"/>
  <path d="M26 -171 H388" stroke="#2A394C" stroke-width="1.4" opacity=".4"/>
  ${[120, 200, 280].map((x) => `<path d="M${x} -246 V-96" stroke="#2A394C" stroke-width="2" opacity=".55"/>`).join('')}
  <!-- hatch + rail -->
  <rect x="190" y="-262" width="46" height="20" rx="6" fill="url(#steelH)"/><rect x="198" y="-272" width="30" height="12" rx="4" fill="url(#goldV)"/>
  <path d="M60 -250 V-282 H150 V-250 M60 -266 H150" fill="none" stroke="url(#goldV)" stroke-width="3" stroke-linejoin="round"/>
  <!-- ladder -->
  <path d="M16 -250 V-96 M34 -250 V-96" stroke="url(#steelH)" stroke-width="5"/>
  ${Array.from({ length: 10 }, (_, i) => `<path d="M16 ${-236 + i * 15} H34" stroke="url(#steelH)" stroke-width="3.5"/>`).join('')}
  <!-- rear valve + hose -->
  <rect x="4" y="-130" width="22" height="30" rx="5" fill="url(#goldV)" stroke="#071426" stroke-width="2"/>
  <path d="M4 -110 Q-30 -100 -36 -66 Q-34 -30 -6 -22" fill="none" stroke="#0B1119" stroke-width="10" stroke-linecap="round"/>
  <path d="M4 -110 Q-30 -100 -36 -66 Q-34 -30 -6 -22" fill="none" stroke="#3E9DD6" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <!-- cab -->
  ${cab(0)}`
}

/** Horizontal strata + aquifer for cutaway scenes. Returns svg and band y positions. */
export function strata(W, H, surfY, { aquiferY = surfY + 230, aquiferH = 70, seed = 5 } = {}) {
  const r = rng(seed)
  const wave = (y, amp, step = 120) => {
    let d = `M-20 ${y}`
    for (let x = -20; x <= W + step; x += step) d += ` Q${x + step / 2} ${y + (r() - 0.5) * amp * 2} ${x + step} ${y + (r() - 0.5) * amp}`
    return d
  }
  const layer = (y, amp, fill, bottom) => `<path d="${wave(y, amp)} L${W + 120} ${bottom} L-20 ${bottom}Z" fill="${fill}"/>`
  const speck = (y0, y1, n, color, op) => Array.from({ length: n }, () => `<circle cx="${r() * W}" cy="${y0 + r() * (y1 - y0)}" r="${0.8 + r() * 2.4}" fill="${color}" opacity="${op * (0.5 + r() * 0.5)}"/>`).join('')
  const crack = (y0, y1, n) => Array.from({ length: n }, () => { const x = r() * W, y = y0 + r() * (y1 - y0); return `<path d="M${x} ${y} l${(r() - 0.5) * 50} ${10 + r() * 24} l${(r() - 0.5) * 40} ${8 + r() * 20}" stroke="#101a26" stroke-opacity=".5" stroke-width="1.6" fill="none"/>` }).join('')
  const y1 = surfY + 56, y2 = y1 + 90, y3 = aquiferY - 20
  return {
    y1, y2, y3,
    svg: `
  <rect x="-20" y="${surfY}" width="${W + 40}" height="${H - surfY + 20}" fill="#3A2718"/>
  ${layer(surfY, 3, '#4B311E', H + 20)}
  ${layer(y1, 10, '#9A6A43', H + 20)}
  ${layer(y2, 12, '#C29A6B', H + 20)}
  ${layer(y3, 10, '#8E8F94', H + 20)}
  ${layer(aquiferY, 12, 'url(#aquifer)', aquiferY + aquiferH)}
  ${layer(aquiferY + aquiferH, 10, '#4C5666', H + 20)}
  <rect x="-20" y="${surfY}" width="${W + 40}" height="${H - surfY + 20}" filter="url(#soilTex)" opacity=".55"/>
  ${speck(surfY, y1, 60, '#2A1A0F', 0.5)}${speck(y1, y2, 70, '#E3C49B', 0.5)}${speck(y2, y3, 80, '#6C4C30', 0.45)}${speck(y3, aquiferY, 50, '#D6D6DC', 0.35)}
  ${crack(y3, aquiferY, 6)}${crack(aquiferY + aquiferH, H - 20, 8)}
  <!-- aquifer glow + bubbles -->
  <rect x="-20" y="${aquiferY}" width="${W + 40}" height="${aquiferH}" fill="#9ED7FF" opacity=".12" filter="url(#b12)"/>
  ${Array.from({ length: 26 }, () => `<circle cx="${r() * W}" cy="${aquiferY + 8 + r() * (aquiferH - 14)}" r="${1 + r() * 2.6}" fill="#E8F6FF" opacity="${0.25 + r() * 0.5}"/>`).join('')}
  <rect x="-20" y="${surfY - 2}" width="${W + 40}" height="4" fill="#D9B27A" opacity=".8"/>`,
  }
}

/** Vertical borehole with steel casing. (x centre, surface y, bottom y). */
export function bore(x, surfY, bottomY, { casingTo = surfY + 160, water = null, w = 38 } = {}) {
  const wy = water ?? bottomY + 1
  return `
  <rect x="${x - w / 2}" y="${surfY}" width="${w}" height="${bottomY - surfY}" rx="3" fill="#06101D"/>
  <rect x="${x - w / 2}" y="${surfY}" width="${w}" height="${bottomY - surfY}" rx="3" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
  <rect x="${x - w / 2 + 1}" y="${wy}" width="${w - 2}" height="${bottomY - wy}" fill="url(#aquifer)" opacity=".9"/>
  <rect x="${x - 15}" y="${surfY - 22}" width="30" height="${casingTo - surfY + 22}" fill="none" stroke="url(#steelH)" stroke-width="5"/>
  <rect x="${x - 21}" y="${surfY - 30}" width="42" height="12" rx="3" fill="url(#steelV)" stroke="#2A394C" stroke-width="1.5"/>`
}

/** Depth ruler with ticks and labels along an edge. */
export function depthRuler(x, y0, y1, step = 40, label = true) {
  let s = `<path d="M${x} ${y0} V${y1}" stroke="#E0C079" stroke-width="2" stroke-opacity=".9"/>`
  for (let y = y0, i = 0; y <= y1; y += step, i++) {
    s += `<path d="M${x - 8} ${y} H${x + 8}" stroke="#E0C079" stroke-width="2"/>`
    if (label) s += `<text x="${x + 14}" y="${y + 4}" font-family="Sora, Arial, sans-serif" font-size="13" fill="#F5E9C8" fill-opacity=".9">${i * 50} ft</text>`
  }
  return s
}

/** A simple warm house. Origin = ground at the left wall. */
export function house() {
  return `
  <ellipse cx="170" cy="4" rx="210" ry="11" fill="#000" opacity=".45" filter="url(#b5)"/>
  <rect x="0" y="-150" width="340" height="150" fill="#EFE3CE"/>
  <rect x="0" y="-150" width="340" height="150" fill="url(#brandDark)" opacity=".18"/>
  <rect x="212" y="-150" width="128" height="150" fill="#E2D2B6"/>
  <path d="M-24 -150 L170 -250 L364 -150Z" fill="#14305A"/>
  <path d="M-24 -150 L170 -250 L364 -150Z" fill="url(#brandDark)" opacity=".65"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${-6 + i * 4} ${-158 + i * 0} L${170} -244" stroke="#0B1F3B" stroke-opacity=".22" stroke-width="1.4"/>`).join('')}
  <rect x="-24" y="-154" width="388" height="9" fill="url(#goldV)"/>
  ${[28, 98].map((x) => `<g><rect x="${x}" y="-122" width="54" height="64" fill="#FFD27A"/><rect x="${x}" y="-122" width="54" height="64" fill="#FFF1C8" opacity=".6" filter="url(#b2)"/><path d="M${x + 27} -122 V-58 M${x} -90 H${x + 54}" stroke="#1B2A3E" stroke-width="3"/><rect x="${x - 4}" y="-126" width="62" height="72" fill="none" stroke="#F6F0E4" stroke-width="5"/></g>`).join('')}
  <g><rect x="190" y="-96" width="38" height="96" rx="3" fill="#2A5B93"/><rect x="190" y="-96" width="38" height="96" rx="3" fill="url(#brandDark)" opacity=".4"/><circle cx="220" cy="-46" r="2.6" fill="url(#goldV)"/></g>
  <rect x="258" y="-112" width="60" height="54" fill="#FFD27A"/><rect x="258" y="-112" width="60" height="54" fill="#FFF1C8" opacity=".55" filter="url(#b2)"/><path d="M288 -112 V-58" stroke="#1B2A3E" stroke-width="3"/><rect x="254" y="-116" width="68" height="62" fill="none" stroke="#F6F0E4" stroke-width="5"/>
  <!-- rooftop tank -->
  <rect x="230" y="-292" width="64" height="44" rx="10" fill="url(#brand)" stroke="#071426" stroke-width="2"/><rect x="238" y="-300" width="48" height="10" rx="4" fill="url(#steelV)"/>
  <path d="M240 -250 V-213 M284 -250 V-190" stroke="#18222F" stroke-width="5"/>
  <rect x="-24" y="-4" width="388" height="8" fill="#C9B79B"/>`
}

/** Leafy tree. Origin = trunk base. */
export function tree(h = 140, seed = 1, dark = '#1F4A2E', light = '#4C9A4F') {
  const r = rng(seed)
  let blobs = ''
  for (let i = 0; i < 9; i++) {
    const cx = (r() - 0.5) * h * 0.7, cy = -h * (0.55 + r() * 0.5), rr = h * (0.22 + r() * 0.12)
    blobs += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${i % 3 ? dark : '#2C6B3E'}"/><circle cx="${cx - rr * 0.3}" cy="${cy - rr * 0.3}" r="${rr * 0.6}" fill="${light}" opacity=".55"/>`
  }
  return `<ellipse cx="0" cy="3" rx="${h * 0.4}" ry="6" fill="#000" opacity=".35" filter="url(#b5)"/><path d="M-5 0 L-3 ${-h * 0.6} L3 ${-h * 0.6} L5 0Z" fill="#4A3220"/>${blobs}`
}
