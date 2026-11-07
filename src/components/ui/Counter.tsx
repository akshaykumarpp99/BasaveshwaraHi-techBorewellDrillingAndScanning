import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'

export default function Counter({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const n = useCountUp(value, inView)
  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">{n.toLocaleString('en-IN')}{suffix}</span>
    </span>
  )
}
