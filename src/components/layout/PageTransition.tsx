import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

// The very first page of a visit appears without a fade (the loader/curtain already covers it).
// Later pages fade in. Deliberately NOT done with <AnimatePresence initial={false}>, because that
// would also switch off every scroll-reveal inside the first page.
let firstPage = true

export default function PageTransition({ children }: { children: ReactNode }) {
  const skipEntrance = useRef(firstPage)
  useEffect(() => { firstPage = false }, [])
  return (
    <motion.div
      initial={skipEntrance.current ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
