// Shared drawing helpers for the illustration generator.
// All shapes use gradients/filters defined once in `defs()`; scenes only reference them by id.

export const rng = (seed = 1) => {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const defs = () => `
<defs>
  <linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7EEF5"/><stop offset=".45" stop-color="#9DB0C4"/><stop offset="1" stop-color="#55677D"/></linearGradient>
  <linearGradient id="steelH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4B5C71"/><stop offset=".3" stop-color="#E3ECF5"/><stop offset=".55" stop-color="#9CB0C5"/><stop offset="1" stop-color="#3F4F63"/></linearGradient>
  <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9C762C"/><stop offset=".3" stop-color="#F6E3A8"/><stop offset=".6" stop-color="#D2AA5C"/><stop offset="1" stop-color="#8A6622"/></linearGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2DA98"/><stop offset=".5" stop-color="#D2AA5C"/><stop offset="1" stop-color="#9C762C"/></linearGradient>
  <linearGradient id="brand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A74B8"/><stop offset=".55" stop-color="#14467D"/><stop offset="1" stop-color="#0B2B52"/></linearGradient>
  <linearGradient id="brandDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#173B69"/><stop offset="1" stop-color="#081A33"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BFE3F7"/><stop offset=".55" stop-color="#4C93C6"/><stop offset="1" stop-color="#1A4F82"/></linearGradient>
  <linearGradient id="tire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3342"/><stop offset="1" stop-color="#05080D"/></linearGradient>
  <radialGradient id="rim" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#F2F6FA"/><stop offset=".6" stop-color="#8EA2B7"/><stop offset="1" stop-color="#46586D"/></radialGradient>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B98655"/><stop offset=".45" stop-color="#85563A"/><stop offset="1" stop-color="#3E281A"/></linearGradient>
  <linearGradient id="aquifer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58B4EA"/><stop offset="1" stop-color="#0F5F9E"/></linearGradient>
  <linearGradient id="waterSpray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#9ED3F2" stop-opacity=".5"/></linearGradient>
  <radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#040C18" stop-opacity=".4"/></radialGradient>
  <radialGradient id="spot" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#3E7DB5" stop-opacity=".75"/><stop offset=".6" stop-color="#173B69" stop-opacity=".35"/><stop offset="1" stop-color="#040C18" stop-opacity="0"/></radialGradient>
  <filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="b5" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="b30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .11 0"/></filter>
  <filter id="soilTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .12" numOctaves="3" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 0  0 0 0 .55 -.12"/></filter>
</defs>`

export const frame = (W, H, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">${defs()}${body}
<rect width="${W}" height="${H}" filter="url(#grain)"/>
<rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`

/** Skies: 'dusk' (golden hour with stars) and 'day' (blue). `horizon` is the y where the glow sits. */
const SKIES = {
  dusk: {
    stops: [['0', '#07163A'], ['.30', '#16407A'], ['.58', '#3E7FB4'], ['.80', '#F0A868'], ['1', '#FBD99A']],
    glow: ['#FFF6D8', '#FFD38A', '#F29A5E', '#FFD9A0'], glowEdge: '.28', cloud: (i) => (i % 2 ? '#F3B27C' : '#8FA6CF'), cloudOpacity: 0.3, stars: true,
  },
  day: {
    stops: [['0', '#4C94D2'], ['.5', '#86BDE6'], ['.85', '#CDE6F5'], ['1', '#F2F8FC']],
    glow: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], glowEdge: '.28', cloud: () => '#fff', cloudOpacity: 0.55, stars: false,
  },
}

export function sky(W, H, kind = 'dusk', horizon = H * 0.62, sunX = W * 0.72) {
  const { stops, glow, glowEdge, cloud, cloudOpacity, stars } = SKIES[kind]
  const r = rng(7)
  const sy = horizon - H * 0.04
  let extra = `<radialGradient id="sunglow" cx="${sunX}" cy="${sy}" r="${H * 0.62}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${glow[0]}" stop-opacity=".95"/><stop offset=".12" stop-color="${glow[1]}" stop-opacity=".7"/>
      <stop offset=".45" stop-color="${glow[2]}" stop-opacity="${glowEdge}"/><stop offset="1" stop-color="${glow[3]}" stop-opacity="0"/></radialGradient>
      <rect width="${W}" height="${H}" fill="url(#sunglow)"/>`
  for (let i = 0; i < 8; i++) {
    const cx = r() * W, cy = H * (0.1 + r() * 0.36), rx = W * (0.1 + r() * 0.16)
    extra += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.06}" fill="${cloud(i)}" opacity="${cloudOpacity}" filter="url(#b12)"/>`
  }
  if (stars) {
    for (let i = 0; i < 46; i++) extra += `<circle cx="${r() * W}" cy="${r() * horizon * 0.5}" r="${0.5 + r() * 1.1}" fill="#fff" opacity="${0.12 + r() * 0.45}"/>`
  }
  return `<linearGradient id="skyg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${horizon}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>
  <rect width="${W}" height="${H}" fill="url(#skyg)"/>${extra}`
}

/** Smooth rolling silhouette. */
export function hills(W, y, amp, color, seed, opacity = 1, step = 80, bottom = 2000) {
  const r = rng(seed)
  let d = `M-20 ${bottom} L-20 ${y}`
  let px = -20, py = y
  for (let x = step - 20; x <= W + step; x += step) {
    const ny = y + (r() - 0.5) * 2 * amp
    d += ` C${px + step / 2} ${py} ${x - step / 2} ${ny} ${x} ${ny}`
    px = x; py = ny
  }
  d += ` L${px} ${bottom}Z`
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`
}

export function grass(W, y, seed, color, count = 160, hMin = 10, hMax = 38) {
  const r = rng(seed)
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = r() * W, h = hMin + r() * (hMax - hMin), lean = (r() - 0.5) * 14
    d += `M${x} ${y} Q${x + lean * 0.4} ${y - h * 0.6} ${x + lean} ${y - h} Q${x + lean * 0.6 + 2} ${y - h * 0.5} ${x + 3} ${y}Z `
  }
  return `<path d="${d}" fill="${color}"/>`
}

export function rocks(x, y, seed, n = 6, size = 16, color = '#5E4B3C') {
  const r = rng(seed)
  let s = ''
  for (let i = 0; i < n; i++) {
    const rx = size * (0.5 + r()), ry = rx * (0.5 + r() * 0.3), cx = x + (r() - 0.5) * size * 8
    s += `<ellipse cx="${cx}" cy="${y + ry * 0.4}" rx="${rx * 1.1}" ry="${ry * 0.3}" fill="#000" opacity=".25" filter="url(#b2)"/>
    <path d="M${cx - rx} ${y + ry * 0.4} Q${cx - rx * 0.8} ${y - ry} ${cx} ${y - ry} Q${cx + rx * 0.9} ${y - ry * 0.9} ${cx + rx} ${y + ry * 0.4}Z" fill="${color}"/>
    <path d="M${cx - rx * 0.7} ${y - ry * 0.4} Q${cx - rx * 0.2} ${y - ry} ${cx + rx * 0.3} ${y - ry * 0.85}" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none"/>`
  }
  return s
}

/** Field/ground block with soil colour, texture and a warm rim light on the top edge. */
export function groundBlock(W, y, H) {
  return `<rect x="-10" y="${y}" width="${W + 20}" height="${H - y + 10}" fill="url(#soil)"/>
  <rect x="-10" y="${y}" width="${W + 20}" height="${H - y + 10}" filter="url(#soilTex)" opacity=".8"/>
  <rect x="-10" y="${y}" width="${W + 20}" height="3" fill="#FFF3D4" opacity=".85"/>`
}

/** Splash + dust at a borehole. (x,y) = hole position on the ground. */
export function splash(x, y, scale = 1, seed = 3) {
  const r = rng(seed)
  let s = `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="3" rx="64" ry="9" fill="#4A301F" opacity=".4" filter="url(#b5)"/>
    <ellipse cx="0" cy="2" rx="46" ry="6" fill="#5A7E96" opacity=".8"/>
    <ellipse cx="-6" cy="0" rx="30" ry="3.5" fill="#9CC9E6" opacity=".7"/>
    <ellipse cx="-40" cy="-16" rx="52" ry="22" fill="#D9BE96" opacity=".35" filter="url(#b12)"/>
    <ellipse cx="38" cy="-26" rx="46" ry="26" fill="#CDB28A" opacity=".28" filter="url(#b12)"/>
    <ellipse cx="0" cy="-48" rx="30" ry="36" fill="#E8D5B6" opacity=".22" filter="url(#b12)"/>`
  for (let i = 0; i < 38; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.2, v = 28 + r() * 62
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v
    s += `<path d="M0 -2 Q${dx * 0.55} ${dy * 1.15} ${dx} ${dy + 14}" fill="none" stroke="url(#waterSpray)" stroke-width="${1 + r() * 2.2}" stroke-linecap="round" opacity="${0.4 + r() * 0.5}"/>
    <circle cx="${dx}" cy="${dy + 14}" r="${1 + r() * 2.4}" fill="#E8F6FF" opacity="${0.5 + r() * 0.5}"/>`
  }
  return s + '</g>'
}

/** Worker (feet at 0,0; ~120 tall). facing: 1 right, -1 left. */
export function worker(x, y, s = 1, facing = 1, vest = '#E5B24E', hat = '#F3D17A') {
  return `<g transform="translate(${x} ${y}) scale(${s * facing} ${s})">
    <ellipse cx="0" cy="2" rx="26" ry="5" fill="#000" opacity=".35" filter="url(#b2)"/>
    <path d="M-11 -62 L-12 -4 H-1 L0 -40 L2 -4 H13 L11 -62Z" fill="#14253D"/>
    <path d="M-14 -4 h14 v6 h-16z M3 -4 h14 v6 h-12z" fill="#0C1119"/>
    <path d="M-17 -108 Q-19 -88 -15 -62 H15 Q19 -88 17 -108 Q0 -116 -17 -108Z" fill="${vest}"/>
    <path d="M-16 -86 H16 M-16 -76 H16" stroke="#F4F7FA" stroke-opacity=".85" stroke-width="3"/>
    <path d="M-17 -106 L-26 -78 L-20 -76 L-12 -96Z M17 -106 L28 -84 L22 -80 L12 -96Z" fill="#14253D"/>
    <circle cx="0" cy="-122" r="10.5" fill="#B9825A"/>
    <path d="M-13 -125 Q0 -144 13 -125 L16 -122 H-16Z" fill="${hat}"/>
    <rect x="-17" y="-123" width="34" height="4" rx="2" fill="${hat}"/><rect x="-17" y="-123" width="34" height="4" rx="2" fill="#000" opacity=".18"/>
    <path d="M-17 -108 Q0 -116 17 -108" stroke="#fff" stroke-opacity=".25" stroke-width="2" fill="none"/>
  </g>`
}

export const wheel = (cx, r = 38) => {
  let bolts = ''
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    bolts += `<circle cx="${Math.cos(a) * 15}" cy="${Math.sin(a) * 15}" r="2.2" fill="#2C3A4D"/>`
  }
  return `<g transform="translate(${cx} ${-r})">
    <circle r="${r}" fill="url(#tire)"/>
    <circle r="${r - 3}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="5" stroke-dasharray="4 5"/>
    <circle r="${r * 0.62}" fill="url(#rim)"/>
    <circle r="${r * 0.62}" fill="none" stroke="#0b1018" stroke-width="2"/>
    ${bolts}
    <circle r="7" fill="#1B2535"/><circle r="4" fill="url(#rim)"/>
    <path d="M${-r * 0.8} ${-r * 0.45} A${r * 0.9} ${r * 0.9} 0 0 1 ${r * 0.1} ${-r * 0.9}" stroke="#fff" stroke-opacity=".16" stroke-width="3" fill="none"/>
  </g>`
}

export const lattice = (x0, x1, yTop, yBot, step = 34, stroke = 'url(#goldV)') => {
  let d = `M${x0} ${yBot}`
  let left = false
  for (let y = yBot; y > yTop; y -= step) {
    d += ` L${left ? x0 : x1} ${y - step}`
    left = !left
  }
  let rungs = ''
  for (let y = yBot - step; y > yTop; y -= step * 2) rungs += `M${x0} ${y}H${x1}`
  return `<path d="${d}" stroke="${stroke}" stroke-width="3.2" fill="none" stroke-linejoin="round"/><path d="${rungs}" stroke="${stroke}" stroke-width="2.4" fill="none"/>`
}

/**
 * Truck-mounted borewell drilling rig, side view, cab on the right.
 * Local origin = ground level directly under the drill rod (x=0). Rod at x=0, truck extends right to ~470.
 */
export function rigTruck({ rodDepth = 6 } = {}) {
  const mastX0 = -28, mastX1 = 28, mastTop = -414, mastBase = -98
  return `
  <ellipse cx="250" cy="3" rx="280" ry="11" fill="#000" opacity=".5" filter="url(#b5)"/>

  <!-- drill string -->
  <rect x="-5" y="-232" width="10" height="${232 + rodDepth}" fill="url(#steelH)"/>
  ${[-170, -110, -50, 10].map((y) => `<rect x="-7" y="${y}" width="14" height="9" rx="2" fill="url(#steelH)"/><rect x="-7" y="${y + 3}" width="14" height="1.6" fill="#2A394C"/>`).join('')}

  <!-- jacks -->
  <g><rect x="-6" y="-100" width="11" height="96" rx="3" fill="url(#steelH)"/><rect x="-22" y="-8" width="40" height="8" rx="3" fill="#2A394C"/></g>
  <g><rect x="150" y="-100" width="11" height="96" rx="3" fill="url(#steelH)" opacity=".9"/><rect x="134" y="-8" width="40" height="8" rx="3" fill="#2A394C"/></g>

  <!-- wheels behind body -->
  ${wheel(190)}${wheel(272)}${wheel(444)}

  <!-- chassis + deck -->
  <rect x="-34" y="-100" width="150" height="18" rx="3" fill="#18222F"/>
  <rect x="60" y="-100" width="450" height="26" rx="4" fill="#111A26"/>
  <rect x="60" y="-106" width="352" height="9" rx="2" fill="url(#goldV)"/>
  <path d="M138 -74 a52 52 0 0 1 104 0 M230 -74 a52 52 0 0 1 84 0" fill="#05080D" opacity=".0"/>

  <!-- fenders -->
  ${[190, 272, 444].map((cx) => `<path d="M${cx - 47} -72 A47 47 0 0 1 ${cx + 47} -72" fill="none" stroke="#0B1119" stroke-width="8" stroke-linecap="round"/><path d="M${cx - 47} -72 A47 47 0 0 1 ${cx + 47} -72" fill="none" stroke="url(#goldV)" stroke-width="2" stroke-linecap="round" transform="translate(0 -4)"/><rect x="${cx + 36}" y="-76" width="6" height="36" rx="2" fill="#0B1119"/>`).join('')}

  <!-- mast: chords, lattice, crown -->
  <g>
    <rect x="${mastX0}" y="${mastTop}" width="7" height="${mastBase - mastTop}" fill="url(#goldH)"/>
    <rect x="${mastX1 - 7}" y="${mastTop}" width="7" height="${mastBase - mastTop}" fill="url(#goldH)"/>
    ${lattice(mastX0 + 3, mastX1 - 3, mastTop + 10, mastBase)}
    <rect x="${mastX0 - 8}" y="${mastTop - 16}" width="${mastX1 - mastX0 + 16}" height="18" rx="4" fill="url(#steelV)"/>
    <circle cx="-12" cy="${mastTop - 7}" r="10" fill="url(#rim)" stroke="#2A394C" stroke-width="2"/><circle cx="12" cy="${mastTop - 7}" r="10" fill="url(#rim)" stroke="#2A394C" stroke-width="2"/>
    <path d="M-12 ${mastTop} V-262 M12 ${mastTop} V-262" stroke="#1B2535" stroke-width="1.6"/>
    <circle cx="0" cy="${mastTop - 22}" r="5" fill="#FF5C4D"/><circle cx="0" cy="${mastTop - 22}" r="16" fill="#FF5C4D" opacity=".35" filter="url(#b5)"/>
    <!-- rotary head -->
    <rect x="-20" y="-266" width="40" height="42" rx="5" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
    <rect x="-20" y="-250" width="40" height="7" fill="url(#goldV)"/>
    <rect x="-9" y="-224" width="18" height="12" fill="url(#steelH)"/>
    <rect x="22" y="-258" width="12" height="26" rx="3" fill="url(#steelH)"/>
  </g>
  <!-- rod rack -->
  <g opacity=".95">${[0, 1, 2].map((i) => `<rect x="${34 + i * 7}" y="-340" width="5" height="240" rx="2" fill="url(#steelH)"/>`).join('')}</g>
  <!-- ram -->
  <path d="M82 -96 L36 -228" stroke="#18222F" stroke-width="13" stroke-linecap="round"/><path d="M82 -96 L36 -228" stroke="url(#steelH)" stroke-width="8" stroke-linecap="round"/>

  <!-- compressor / engine housing -->
  <g>
    <rect x="150" y="-198" width="236" height="96" rx="8" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
    <rect x="152" y="-196" width="232" height="14" rx="6" fill="#fff" opacity=".14"/>
    <rect x="150" y="-150" width="236" height="10" fill="url(#goldV)"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${166 + i * 4}" y="${-188 + i * 0}" width="2" height="0"/>`).join('')}
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="164" y="${-186 + i * 8}" width="74" height="4" rx="2" fill="#061326"/>`).join('')}
    <path d="M262 -196 V-104 M330 -196 V-104" stroke="#071426" stroke-width="2"/>
    <rect x="272" y="-190" width="8" height="14" rx="2" fill="url(#steelV)"/><rect x="338" y="-190" width="8" height="14" rx="2" fill="url(#steelV)"/>
    <path d="M356 -132 q9 -22 18 0 q-9 16 -18 0z" fill="url(#goldV)"/>
    <rect x="192" y="-220" width="26" height="24" rx="3" fill="url(#steelH)"/><rect x="188" y="-228" width="34" height="10" rx="3" fill="url(#steelV)"/>
    <rect x="236" y="-212" width="52" height="14" rx="3" fill="url(#brandDark)"/>
  </g>
  <!-- air hose to hole -->
  <path d="M152 -126 Q96 -124 78 -88 Q64 -50 36 -26 Q14 -10 4 -4" fill="none" stroke="#0B1119" stroke-width="8" stroke-linecap="round"/>
  <path d="M152 -126 Q96 -124 78 -88 Q64 -50 36 -26 Q14 -10 4 -4" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>

  <!-- fuel/tool tanks -->
  <rect x="300" y="-90" width="70" height="26" rx="12" fill="url(#steelH)"/>
  <rect x="130" y="-92" width="42" height="22" rx="3" fill="#18222F"/>

  ${cab(0)}
  `
}

/** Truck cab (front facing right). Drawn around x=394..534; shift with dx. */
export const cab = (dx = 0) => `<g transform="translate(${dx} 0)">
    <rect x="404" y="-250" width="9" height="150" rx="3" fill="url(#steelH)"/><rect x="400" y="-258" width="17" height="9" rx="3" fill="url(#steelV)"/>
    <path d="M394 -100 V-176 Q394 -192 410 -192 H470 Q482 -192 488 -182 L516 -132 Q522 -122 522 -110 V-100 Z" fill="url(#brand)" stroke="#071426" stroke-width="2"/>
    <path d="M412 -184 H468 Q476 -184 480 -177 L502 -138 H412Z" fill="url(#glass)" stroke="#071426" stroke-width="2"/>
    <path d="M424 -182 L470 -182 L440 -138 H424Z" fill="#fff" opacity=".28"/>
    <path d="M410 -138 V-104 M458 -138 V-104" stroke="#071426" stroke-width="2"/>
    <rect x="440" y="-124" width="14" height="4" rx="2" fill="url(#steelV)"/>
    <rect x="514" y="-170" width="9" height="20" rx="3" fill="#18222F"/>
    <rect x="394" y="-138" width="128" height="6" fill="url(#goldV)"/>
    <path d="M516 -112 h14 q3 0 3 3 v22 h-17z" fill="#0B1119"/>
    <ellipse cx="524" cy="-120" rx="8" ry="6" fill="#FFF3C9"/><ellipse cx="530" cy="-120" rx="40" ry="14" fill="#FFE29A" opacity=".35" filter="url(#b5)"/>
    <rect x="508" y="-90" width="26" height="14" rx="2" fill="#0B1119"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${512 + i * 6} -90 l6 14 h-5z" fill="#E5B24E"/>`).join('')}
</g>`
