import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
  id?: string
  /** Tighter bottom margin when body copy follows directly. */
  compact?: boolean
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light, id, compact }: Props) {
  return (
    <Reveal className={`${compact ? 'mb-6' : 'mb-12 sm:mb-16'} ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <span className={`eyebrow ${light ? '!text-gold-300' : ''}`}>{eyebrow}</span>
      <h2 id={id} className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem] ${light ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-white/70' : 'text-navy-900/65'}`}>{subtitle}</p>}
    </Reveal>
  )
}
