import type { ReactNode } from 'react'
import HashLink from './HashLink'

type Variant = 'primary' | 'secondary' | 'outline' | 'light'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 will-change-transform focus-visible:outline-offset-4 active:scale-[.97] disabled:pointer-events-none disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-gold-300 to-gold-500 text-navy-950 shadow-gold hover:-translate-y-0.5 hover:from-gold-200 hover:to-gold-400 hover:shadow-glow',
  secondary: 'bg-navy-900 text-white shadow-card hover:-translate-y-0.5 hover:bg-navy-700',
  outline: 'border border-white/40 text-white backdrop-blur hover:-translate-y-0.5 hover:border-white hover:bg-white/10',
  light: 'bg-white text-navy-900 hover:-translate-y-0.5 hover:bg-gold-50',
}
const sizes: Record<Size, string> = { md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-[15px]' }

interface Props {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  icon?: ReactNode
  /** internal route or "/#section" */
  to?: string
  /** external / tel: / mailto: */
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', icon, to, href, type = 'button', ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const inner = (
    <>
      {children}
      {icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
    </>
  )
  if (to) return <HashLink to={to} className={cls} onClick={rest.onClick} aria-label={rest['aria-label']}>{inner}</HashLink>
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a href={href} className={cls} onClick={rest.onClick} aria-label={rest['aria-label']} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  return <button type={type} className={cls} {...rest}>{inner}</button>
}
