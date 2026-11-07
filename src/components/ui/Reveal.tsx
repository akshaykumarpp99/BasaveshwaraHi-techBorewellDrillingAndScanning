import { createElement, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePageMotion } from '../../context/pageMotion'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  className?: string
  as?: 'div' | 'li'
}

/** Scroll-triggered fade/slide-in. Animates opacity + transform only; static when the page has motion off or the user prefers reduced motion. */
export default function Reveal({ children, delay = 0, direction = 'up', className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const pageMotion = usePageMotion()
  if (!pageMotion) return createElement(as, { className }, children)

  const offset = reduce ? { x: 0, y: 0 } : { up: { x: 0, y: 28 }, left: { x: -36, y: 0 }, right: { x: 36, y: 0 } }[direction]
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
