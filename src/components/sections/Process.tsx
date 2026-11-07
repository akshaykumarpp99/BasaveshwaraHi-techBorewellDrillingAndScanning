import { motion, useReducedMotion } from 'framer-motion'
import { processSteps } from '../../data/content'
import { usePageMotion } from '../../context/pageMotion'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

export default function Process() {
  const t = useT()
  const prefersReduced = useReducedMotion()
  const pageMotion = usePageMotion()
  const reduce = prefersReduced || !pageMotion
  const grow = (axis: 'x' | 'y') => ({
    initial: reduce ? false : axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
    whileInView: axis === 'x' ? { scaleX: 1 } : { scaleY: 1 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 1.4, ease: 'easeInOut' as const },
  })

  return (
    <section id="process" aria-labelledby="process-title" className="section-y relative bg-white">
      <div className="container-x">
        <SectionHeading id="process-title" eyebrow={t('Our Work Process')} title={t('From first call to a tested borewell')} subtitle={t('A clear, step-by-step process so you always know what happens next.')} />

        <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-4">
          {/* connector: vertical on mobile, horizontal on desktop */}
          <div aria-hidden className="absolute bottom-6 left-7 top-6 w-px bg-navy-900/10 lg:hidden">
            <motion.div {...grow('y')} className="h-full w-full origin-top bg-gradient-to-b from-water-400 to-water-600" />
          </div>
          <div aria-hidden className="absolute left-[8.33%] right-[8.33%] top-7 hidden h-px bg-navy-900/10 lg:block">
            <motion.div {...grow('x')} className="h-full w-full origin-left bg-gradient-to-r from-water-400 to-water-600" />
          </div>

          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
              <div className="relative z-10 shrink-0">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-gold-300 shadow-lg ring-8 ring-white transition duration-300 hover:scale-110 hover:bg-water-500 hover:text-white">
                  <s.icon size={24} aria-hidden />
                </span>
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-white ring-2 ring-white">{i + 1}</span>
              </div>
              <div className="lg:mt-6">
                <h3 className="font-display text-lg font-semibold">{t(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-900/65">{t(s.text)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
