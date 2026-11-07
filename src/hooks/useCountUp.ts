import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Animates 0 → target when `start` becomes true. Respects reduced motion. */
export function useCountUp(target: number, start: boolean, duration = 1800) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration, reduce])

  return value
}
