import { beforeEach, describe, expect, it } from 'vitest'
import { enquiryMailLink, enquiryText, enquiryWhatsAppLink, submitEnquiry } from '../../lib/enquiry'
import { site } from '../../config/site'

const values = { name: 'Asha Rao', phone: '9876543210', email: 'a@b.co', location: 'Pune', service: 'Borewell Drilling', depth: '300', message: 'Need water', website: '' }

describe('enquiryText', () => {
  it('includes every filled field with labels', () => {
    const t = enquiryText(values)
    expect(t).toContain(`Hello ${site.name}`)
    for (const line of ['Name: Asha Rao', 'Mobile: 9876543210', 'Location: Pune', 'Service: Borewell Drilling', 'Expected depth: 300 ft', 'Message: Need water'])
      expect(t).toContain(line)
  })
  it('omits blank fields', () => {
    const t = enquiryText({ name: 'Asha' })
    expect(t).toContain('Name: Asha')
    expect(t).not.toMatch(/Mobile|Location|Service|depth|Message/)
  })
  it('works with no values at all', () => expect(enquiryText({})).toMatch(/^Hello /))
})

describe('enquiry links', () => {
  it('builds an encoded wa.me link to the configured WhatsApp number', () => {
    const href = enquiryWhatsAppLink(values)
    expect(href.startsWith(`https://wa.me/${site.whatsappRaw}?text=`)).toBe(true)
    expect(decodeURIComponent(href.split('text=')[1])).toBe(enquiryText(values))
  })
  it('builds a mailto link with subject and body', () => {
    const href = enquiryMailLink(values)
    expect(href.startsWith(`mailto:${site.email}?subject=`)).toBe(true)
    expect(decodeURIComponent(href)).toContain('Name: Asha Rao')
  })
})

describe('submitEnquiry without a backend configured', () => {
  beforeEach(() => localStorage.clear())

  it("returns 'fallback' so the UI can hand the lead to WhatsApp/email", async () => {
    await expect(submitEnquiry(values)).resolves.toBe('fallback')
  })
  it('does not start the throttle timer in fallback mode', async () => {
    await submitEnquiry(values)
    expect(localStorage.getItem('enquiry:last')).toBeNull()
  })
  it('refuses a second enquiry inside the throttle window', async () => {
    localStorage.setItem('enquiry:last', String(Date.now()))
    await expect(submitEnquiry(values)).rejects.toThrow(/wait a few seconds/i)
  })
  it('allows a new enquiry once the throttle window has passed', async () => {
    localStorage.setItem('enquiry:last', String(Date.now() - 31_000))
    await expect(submitEnquiry(values)).resolves.toBe('fallback')
  })
})
