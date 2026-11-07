import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/content'
import { useCarousel } from '../../hooks/useCarousel'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

export default function Testimonials() {
  const tr = useT()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const paused = hover || userPaused || !!reduce
  const { index, dir, go, next, prev } = useCarousel(testimonials.length, { paused })
  const cur = testimonials[index]

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y relative overflow-hidden bg-gradient-to-b from-water-50 to-white">
      <Quote aria-hidden className="absolute -right-10 top-10 h-72 w-72 text-water-200/50" />
      <div className="container-x relative">
        <SectionHeading id="testimonials-title" eyebrow={tr('Customer Testimonials')} title={tr('What our customers say')} />

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={tr('Customer testimonials')}
          className="mx-auto max-w-3xl"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
        >
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-white p-8 shadow-card ring-1 ring-navy-900/5 sm:min-h-[280px] sm:p-12">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={tr('{n} of {total}', { n: index + 1, total: testimonials.length })}
                aria-live={paused ? 'polite' : 'off'}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 60 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="flex gap-1" role="img" aria-label={tr('{rating} out of 5 stars', { rating: cur.rating })}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={20} aria-hidden className={n <= cur.rating ? 'fill-gold-400 text-gold-400' : 'text-navy-900/20'} />
                  ))}
                </div>
                <blockquote className="mt-5 text-lg leading-relaxed text-navy-900/80 sm:text-xl">“{tr(cur.text)}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-900 font-display font-bold text-gold-300" aria-hidden>{tr(cur.name).charAt(0)}</span>
                  <span>
                    <span className="block font-display font-semibold">{tr(cur.name)}</span>
                    <span className="block text-sm text-navy-900/55">{tr(cur.location)}</span>
                  </span>
                  {cur.isSample && <span className="ml-auto rounded-full bg-earth-100 px-3 py-1 text-xs font-semibold text-earth-600">{tr('Sample')}</span>}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button type="button" onClick={prev} aria-label={tr('Previous testimonial')} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow ring-1 ring-navy-900/10 transition hover:bg-navy-900 hover:text-white"><ChevronLeft size={20} aria-hidden /></button>
              <button type="button" onClick={next} aria-label={tr('Next testimonial')} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow ring-1 ring-navy-900/10 transition hover:bg-navy-900 hover:text-white"><ChevronRight size={20} aria-hidden /></button>
            </div>
            <div className="flex items-center gap-2" role="tablist" aria-label={tr('Choose testimonial')}>
              {testimonials.map((_, i) => (
                <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={tr('Show testimonial {n}', { n: i + 1 })} onClick={() => go(i)} className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-water-500' : 'w-2.5 bg-navy-900/20 hover:bg-navy-900/40'}`} />
              ))}
            </div>
            <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? tr('Resume automatic sliding') : tr('Pause automatic sliding')} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow ring-1 ring-navy-900/10 transition hover:bg-navy-900 hover:text-white">
              {userPaused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
