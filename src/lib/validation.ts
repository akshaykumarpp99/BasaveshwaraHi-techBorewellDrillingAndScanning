import { z } from 'zod'
import { services } from '../data/services'

export const serviceOptions = [...services.map((s) => s.title), 'Other / Not sure'] as const

/**
 * Indian mobile: optional +91 / 91 / 091 / 0 prefix, then 10 digits starting 6-9.
 * The prefix is only stripped when exactly 10 digits remain, so valid numbers that
 * themselves start with "91" (e.g. 9123456789) are left intact.
 */
export const normalizePhone = (v: string) => {
  const digits = v.replace(/[\s\-()]/g, '')
  return digits.match(/^(?:\+?91|091|0)?(\d{10})$/)?.[1] ?? digits
}

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(80, 'Name is too long'),
  phone: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .refine((v) => /^[6-9]\d{9}$/.test(normalizePhone(v)), 'Enter a valid 10-digit mobile number'),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email address'),
  location: z.string().trim().min(2, 'Please tell us your location').max(120),
  service: z.string().min(1, 'Please choose a service'),
  depth: z
    .string()
    .trim()
    .refine((v) => v === '' || (/^\d{1,4}$/.test(v) && Number(v) >= 1 && Number(v) <= 2000), 'Enter depth in feet (1–2000)'),
  message: z.string().trim().max(1000, 'Please keep the message under 1000 characters'),
  /** Honeypot: real users never fill this. */
  website: z.string().max(0),
})

export type EnquiryValues = z.infer<typeof enquirySchema>
