export const WAVE_WIDTH = 2400
export const WAVE_PERIOD = 600

/**
 * SVG path for the section wave. The curve repeats exactly every `period` units with matching
 * height AND slope at each seam, so sliding it by any whole number of periods (the CSS loop slides it
 * by half the width) is seamless: no jump, no kink.
 */
export function wavePath(width = WAVE_WIDTH, period = WAVE_PERIOD, base = 60, amp = 40) {
  const s = period / 6
  let d = `M0 ${base}`
  for (let x = 0; x < width; x += period) {
    d += ` C${x + s} ${base - amp} ${x + 2 * s} ${base - amp} ${x + 3 * s} ${base}`
    d += ` C${x + 4 * s} ${base + amp} ${x + 5 * s} ${base + amp} ${x + 6 * s} ${base}`
  }
  return `${d} V101 H0Z`
}
