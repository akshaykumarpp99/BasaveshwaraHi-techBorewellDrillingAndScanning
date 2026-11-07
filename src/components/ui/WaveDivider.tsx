import { WAVE_WIDTH, wavePath } from '../../lib/wave'

const FRONT = wavePath()
// back layer: smaller, quicker swell (400-unit period; 1200 is a whole number of periods, so the loop stays seamless)
const BACK = wavePath(WAVE_WIDTH, 400, 64, 24)

/**
 * Water-wave edge for section transitions. `className` sets the colour via currentColor.
 * Two layers drift in opposite directions at different speeds so it reads as moving water.
 * Both tile seamlessly, and the strip overlaps the neighbouring section by 1px so no hairline
 * can show between them. (Users who ask their OS for reduced motion get a still wave via the
 * global rule in index.css.)
 */
export default function WaveDivider({ className = 'text-white' }: { className?: string }) {
  const layer = 'absolute inset-y-0 left-0 block h-full w-[200%] will-change-transform'
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 -bottom-px h-12 overflow-hidden leading-none sm:h-16 ${className}`}>
      <svg data-layer="back" className={`${layer} animate-wave-slow opacity-40`} viewBox={`0 0 ${WAVE_WIDTH} 100`} preserveAspectRatio="none" focusable="false">
        <path fill="currentColor" d={BACK} />
      </svg>
      <svg data-layer="front" className={`${layer} animate-wave`} viewBox={`0 0 ${WAVE_WIDTH} 100`} preserveAspectRatio="none" focusable="false">
        <path fill="currentColor" d={FRONT} />
      </svg>
    </div>
  )
}
