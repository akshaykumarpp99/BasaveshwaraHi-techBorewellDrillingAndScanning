import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Droplets } from 'lucide-react'

/** A navy panel with a gold leading edge that sweeps across the screen on every page change. */
export default function RouteCurtain() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!reduce) setRun((n) => n + 1)
  }, [pathname, reduce])

  if (!run) return null
  return (
    <motion.div
      key={run}
      aria-hidden
      data-testid="route-curtain"
      className="pointer-events-none fixed inset-0 z-[150] grid place-items-center bg-gradient-to-br from-navy-900 to-navy-950"
      initial={{ x: '-101%' }}
      animate={{ x: ['-101%', '0%', '0%', '101%'] }}
      transition={{ duration: 1.05, times: [0, 0.4, 0.58, 1], ease: 'easeInOut' }}
    >
      <span className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-300" />
      <Droplets size={44} className="text-gold-300" />
    </motion.div>
  )
}
