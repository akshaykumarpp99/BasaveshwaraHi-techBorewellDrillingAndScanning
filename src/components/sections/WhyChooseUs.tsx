import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { whyUs } from '../../data/content'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

export default function WhyChooseUs() {
  const t = useT()
  const reduce = useReducedMotion()
  return (
    <section id="why-us" aria-labelledby="why-title" className="section-y relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white">
      <div aria-hidden className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-water-500/15 blur-3xl" />
      <div aria-hidden className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
      <div aria-hidden className="gauge absolute inset-y-0 left-6 hidden w-3 text-white/10 xl:block" />
      <div className="container-x relative">
        <SectionHeading light id="why-title" eyebrow={t('Why Choose Us')} title={t('What sets our drilling work apart')} subtitle={t('Seven commitments we hold ourselves to on every project.')} />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <Reveal as="li" key={w.title} delay={(i % 4) * 0.07}>
              <motion.div
                whileHover={reduce ? undefined : 'hover'}
                initial="rest"
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[.05] p-7 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:bg-white/[.08]"
              >
                <motion.span
                  variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: [0, -10, 8, 0], scale: 1.12 } }}
                  transition={{ duration: 0.6 }}
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-200 to-gold-500 text-navy-950 shadow-lg shadow-gold-600/30"
                >
                  <w.icon size={26} aria-hidden />
                </motion.span>
                <h3 className="mt-5 font-display text-lg font-semibold">{t(w.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{t(w.text)}</p>
                <span aria-hidden className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gold-400/0 blur-2xl transition duration-500 group-hover:bg-gold-400/25" />
              </motion.div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.28}>
            <div className="flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-water-500 to-water-700 p-7">
              <div>
                <h3 className="font-display text-xl font-bold">{t('Ready to get water on your land?')}</h3>
                <p className="mt-2 text-sm text-white/90">{t('Tell us about your site and get a clear, written quote.')}</p>
              </div>
              <Button to="/#contact" variant="light" className="mt-6 w-fit" icon={<ArrowRight size={16} aria-hidden />}>{t('Get a Free Quote')}</Button>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  )
}
