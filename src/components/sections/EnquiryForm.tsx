import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Send } from 'lucide-react'
import { enquiryMailLink, enquiryWhatsAppLink, submitEnquiry, type SubmitResult } from '../../lib/enquiry'
import { enquirySchema, serviceOptions, type EnquiryValues } from '../../lib/validation'
import Button from '../ui/Button'
import { useT } from '../../i18n/LanguageContext'

type Status = { kind: 'idle' } | { kind: 'sent'; result: SubmitResult } | { kind: 'error'; message: string }

function Field({ id, label, error, required, children, hint }: { id: string; label: string; error?: string; required?: boolean; hint?: string; children: ReactNode }) {
  const t = useT()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {t(label)} {required ? <span className="text-red-500" aria-hidden>*</span> : <span className="font-normal text-navy-900/45">{t('(optional)')}</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-navy-900/50">{t(hint)}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"><AlertCircle size={13} aria-hidden />{t(error)}</p>}
    </div>
  )
}

export default function EnquiryForm({ defaultService = '' }: { defaultService?: string }) {
  const t = useT()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const {
    register, handleSubmit, watch, reset, formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', location: '', service: defaultService, depth: '', message: '', website: '' },
  })
  const values = watch()

  const aria = (k: keyof EnquiryValues) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-error` : undefined })

  const onSubmit = async (v: EnquiryValues) => {
    setStatus({ kind: 'idle' })
    try {
      const result = await submitEnquiry(v)
      setStatus({ kind: 'sent', result })
      if (result === 'saved') reset()
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : 'Something went wrong. Please try again or call us.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t('Borewell enquiry form')} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-900/5 sm:p-9">
      <h3 className="font-display text-2xl font-bold">{t('Request a free quote')}</h3>
      <p className="mt-1 text-sm text-navy-900/60"><span className="text-red-500">*</span> {t('marked fields are required. We usually reply the same day.')}</p>

      {/* honeypot - hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register('website')} /></label>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name?.message}>
          <input id="name" className="field" autoComplete="name" placeholder={t('Your name')} {...aria('name')} {...register('name')} />
        </Field>
        <Field id="phone" label="Mobile number" required error={errors.phone?.message}>
          <input id="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="98765 43210" {...aria('phone')} {...register('phone')} />
        </Field>
        <Field id="email" label="Email address" error={errors.email?.message}>
          <input id="email" type="email" className="field" autoComplete="email" placeholder="you@example.com" {...aria('email')} {...register('email')} />
        </Field>
        <Field id="location" label="Location" required error={errors.location?.message}>
          <input id="location" className="field" autoComplete="address-level2" placeholder={t('Village / area, city')} {...aria('location')} {...register('location')} />
        </Field>
        <Field id="service" label="Required service" required error={errors.service?.message}>
          <select id="service" className="field" {...aria('service')} {...register('service')}>
            <option value="">{t('Select a service')}</option>
            {serviceOptions.map((o) => <option key={o} value={o}>{t(o)}</option>)}
          </select>
        </Field>
        <Field id="depth" label="Expected borewell depth (ft)" error={errors.depth?.message} hint="Not sure? Leave blank and we’ll advise.">
          <input id="depth" type="text" inputMode="numeric" className="field" placeholder={t('e.g. 300')} {...aria('depth')} {...register('depth')} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label="Message" error={errors.message?.message}>
            <textarea id="message" rows={4} className="field resize-y" placeholder={t('Tell us about your site and water requirement')} {...aria('message')} {...register('message')} />
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1" icon={isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}>
          {isSubmitting ? t('Sending…') : t('Submit Enquiry')}
        </Button>
        <a
          href={enquiryWhatsAppLink(values)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95 active:scale-[.97]"
        >
          <MessageCircle size={18} aria-hidden /> {t('WhatsApp Enquiry')}
        </a>
      </div>

      <div aria-live="polite" className="mt-5">
        <AnimatePresence mode="wait">
          {status.kind === 'sent' && status.result === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="flex gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-900 ring-1 ring-green-200">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20} aria-hidden />
              <p><strong>{t('Thank you!')}</strong> {t('Your enquiry has been received. We’ll contact you shortly.')}</p>
            </motion.div>
          )}
          {status.kind === 'sent' && status.result === 'fallback' && (
            <motion.div key="fallback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="rounded-2xl bg-water-50 p-4 text-sm text-navy-900 ring-1 ring-water-200">
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-water-600" size={20} aria-hidden /><span><strong>{t('Details ready.')}</strong> {t('Please send them to us on WhatsApp or email to complete your enquiry.')}</span></p>
              <div className="mt-3 flex flex-wrap gap-2 pl-8">
                <a href={enquiryWhatsAppLink(values)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 font-semibold text-white"><MessageCircle size={15} aria-hidden /> {t('Send on WhatsApp')}</a>
                <a href={enquiryMailLink(values)} className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 font-semibold text-white"><Mail size={15} aria-hidden /> {t('Send by email')}</a>
              </div>
            </motion.div>
          )}
          {status.kind === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-900 ring-1 ring-red-200">
              <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} aria-hidden />
              <p>{t(status.message)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
