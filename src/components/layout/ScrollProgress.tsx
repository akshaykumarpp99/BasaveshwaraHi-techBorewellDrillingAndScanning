import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin gold→blue bar at the very top that fills as you scroll the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })
  return <motion.div aria-hidden data-testid="scroll-progress" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-400 via-gold-300 to-water-400" />
}
