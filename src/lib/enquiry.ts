import { site, whatsappLink } from '../config/site'
import { normalizePhone, type EnquiryValues } from './validation'
import { supabase } from './supabase'

const THROTTLE_KEY = 'enquiry:last'
const THROTTLE_MS = 30_000

export const enquiryText = (v: Partial<EnquiryValues>) =>
  [
    `Hello ${site.name}, I would like a borewell quote.`,
    v.name && `Name: ${v.name}`,
    v.phone && `Mobile: ${v.phone}`,
    v.location && `Location: ${v.location}`,
    v.service && `Service: ${v.service}`,
    v.depth && `Expected depth: ${v.depth} ft`,
    v.message && `Message: ${v.message}`,
  ]
    .filter(Boolean)
    .join('\n')

export const enquiryWhatsAppLink = (v: Partial<EnquiryValues>) => whatsappLink(enquiryText(v))

export const enquiryMailLink = (v: Partial<EnquiryValues>) =>
  `mailto:${site.email}?subject=${encodeURIComponent('Borewell enquiry')}&body=${encodeURIComponent(enquiryText(v))}`

export type SubmitResult = 'saved' | 'fallback'

/**
 * Saves the enquiry to Supabase when configured.
 * Returns 'fallback' when no backend is configured, so the UI can hand the
 * lead to WhatsApp / email instead of silently dropping it.
 */
export async function submitEnquiry(v: EnquiryValues): Promise<SubmitResult> {
  const last = Number(localStorage.getItem(THROTTLE_KEY) ?? 0)
  if (Date.now() - last < THROTTLE_MS) throw new Error('Please wait a few seconds before sending another enquiry.')

  if (!supabase) return 'fallback'

  const { error } = await supabase.from('enquiries').insert({
    name: v.name,
    phone: normalizePhone(v.phone),
    email: v.email || null,
    location: v.location,
    service: v.service,
    expected_depth_ft: v.depth ? Number(v.depth) : null,
    message: v.message || null,
  })
  if (error) throw new Error('We could not send your enquiry. Please try again or call us.')

  localStorage.setItem(THROTTLE_KEY, String(Date.now()))
  return 'saved'
}
