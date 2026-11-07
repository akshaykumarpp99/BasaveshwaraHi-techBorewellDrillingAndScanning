import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Cog, Eye, HardHat, ShieldCheck, Target, Users } from 'lucide-react'
import { site } from '../../config/site'
import { usePageMotion } from '../../context/pageMotion'
import { images } from '../../data/images'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useT } from '../../i18n/LanguageContext'

const years = site.stats.find((s) => s.label.toLowerCase().includes('year'))

const pillars = [
  { icon: ShieldCheck, title: 'Quality & Safety', text: 'Safe site practices and proper casing, testing and clean-up on every job.' },
  { icon: Cog, title: 'Advanced Equipment', text: 'Modern rigs, compressors and accessories maintained for reliable drilling.' },
  { icon: Users, title: 'Experienced Technical Team', text: 'A crew that understands local ground conditions and drilling methods.' },
]

export default function About() {
  const t = useT()
  const photoRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const pageMotion = usePageMotion()
  const reduce = prefersReduced || !pageMotion
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative bg-white">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="left" className="relative">
          <div ref={photoRef} className="relative overflow-hidden rounded-3xl shadow-card">
            <motion.img style={{ y, scale: reduce ? 1 : 1.18 }} src={images.aboutMain} alt={t('{name} drilling crew working beside a rig', { name: t(site.name) })} width={800} height={600} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -right-3 hidden w-44 overflow-hidden rounded-2xl border-4 border-white shadow-card sm:block lg:-right-8 lg:w-56">
            <img src={images.aboutTeam} alt={t('Technical drilling team')} width={800} height={600} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          {years && (
            <div className="absolute -left-3 top-8 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-card ring-1 ring-gold-400/40 lg:-left-8">
              <p className="font-display text-3xl font-bold text-gold-300">{years.value}{years.suffix}</p>
              <p className="text-xs uppercase tracking-wider text-white/70">{t('Years of Experience')}</p>
            </div>
          )}
          <div aria-hidden className="absolute -z-10 -left-6 -top-6 h-full w-full rounded-3xl border-2 border-dashed border-water-200" />
        </Reveal>

        <div>
          <SectionHeading id="about-title" align="left" compact eyebrow={t('About Us')} title={t('Water solutions built on engineering, not guesswork')} />
          <Reveal>
            <p className="text-lg leading-relaxed text-navy-900/70">
              {t('{name} is a borewell drilling and water solutions company serving homes, farms, businesses and industry in {city} and nearby areas. With {years} years of experience, we combine on-site assessment, modern drilling equipment and a skilled technical team to deliver dependable water sources.', { name: t(site.name), city: t(site.city), years: `${years?.value}${years?.suffix}` })}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.05} className="rounded-2xl bg-water-50 p-6">
              <Target className="text-water-600" aria-hidden />
              <h3 className="mt-3 font-display text-lg font-semibold">{t('Our Mission')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/65">{t('To deliver reliable, honestly-priced groundwater solutions through careful assessment, safe drilling and quality workmanship.')}</p>
            </Reveal>
            <Reveal delay={0.12} className="rounded-2xl bg-earth-100 p-6">
              <Eye className="text-earth-500" aria-hidden />
              <h3 className="mt-3 font-display text-lg font-semibold">{t('Our Vision')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/65">{t('To be the most trusted name in borewell and water services, known for transparency, safety and results our customers can depend on.')}</p>
            </Reveal>
          </div>

          <ul className="mt-8 space-y-5">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-300 shadow-sm"><p.icon size={22} aria-hidden /></span>
                <div>
                  <h3 className="font-display font-semibold">{t(p.title)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-900/65">{t(p.text)}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-2 text-sm text-navy-900/55"><HardHat size={16} aria-hidden /> {t('Safety first on every site we work on.')}</p>
        </div>
      </div>
    </section>
  )
}
