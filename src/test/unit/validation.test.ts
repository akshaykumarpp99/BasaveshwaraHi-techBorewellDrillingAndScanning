import { describe, expect, it } from 'vitest'
import { enquirySchema, normalizePhone, serviceOptions } from '../../lib/validation'
import { services } from '../../data/services'

const valid = { name: 'Asha Rao', phone: '9876543210', email: '', location: 'Pune', service: 'Borewell Drilling', depth: '', message: '', website: '' }
const errorsOf = (over: Partial<typeof valid>) => {
  const r = enquirySchema.safeParse({ ...valid, ...over })
  return r.success ? {} : Object.fromEntries([...r.error.issues].reverse().map((i) => [String(i.path[0]), i.message])) // first issue per field, like the form
}

describe('normalizePhone', () => {
  it.each([
    ['98765 43210', '9876543210'],
    ['+91 98765-43210', '9876543210'],
    ['091 (98765) 43210', '9876543210'],
    ['09876543210', '9876543210'],
    ['919876543210', '9876543210'],
    ['9123456789', '9123456789'], // valid mobile that itself starts with 91
    ['+91 91234 56789', '9123456789'],
    ['0919123456789', '9123456789'],
    ['12345', '12345'], // too short: returned unchanged so validation can reject it
    ['', ''],
  ])('%s -> %s', (input, out) => expect(normalizePhone(input)).toBe(out))
})

describe('enquirySchema', () => {
  it('accepts a minimal valid enquiry (email, depth, message optional)', () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true)
  })
  it('accepts a fully filled enquiry', () => {
    expect(enquirySchema.safeParse({ ...valid, email: 'a@b.co', depth: '350', message: 'Need water' }).success).toBe(true)
  })

  describe('name', () => {
    it('rejects blank and 1-char names', () => {
      expect(errorsOf({ name: '' }).name).toMatch(/full name/i)
      expect(errorsOf({ name: ' a ' }).name).toMatch(/full name/i)
    })
    it('rejects names over 80 chars', () => expect(errorsOf({ name: 'x'.repeat(81) }).name).toMatch(/too long/i))
  })

  describe('phone', () => {
    it('requires a value', () => expect(errorsOf({ phone: '' }).phone).toMatch(/required/i))
    it.each(['12345', '5876543210', '98765432101', 'abcdefghij', '98765 4321'])('rejects %s', (p) => expect(errorsOf({ phone: p }).phone).toMatch(/10-digit/i))
    it.each(['9876543210', '+91 98765 43210', '098765-43210', '6000000000', '9123456789', '+919123456789'])('accepts %s', (p) => expect(errorsOf({ phone: p }).phone).toBeUndefined())
  })

  describe('email', () => {
    it('is optional', () => expect(errorsOf({ email: '' }).email).toBeUndefined())
    it.each(['nope', 'a@', '@b.com', 'a b@c.com'])('rejects %s', (e) => expect(errorsOf({ email: e }).email).toMatch(/valid email/i))
    it('accepts a valid address', () => expect(errorsOf({ email: 'asha@example.com' }).email).toBeUndefined())
  })

  describe('location / service', () => {
    it('requires location', () => expect(errorsOf({ location: ' ' }).location).toMatch(/location/i))
    it('requires a service', () => expect(errorsOf({ service: '' }).service).toMatch(/choose a service/i))
  })

  describe('depth', () => {
    it('is optional', () => expect(errorsOf({ depth: '' }).depth).toBeUndefined())
    it.each(['1', '300', '2000'])('accepts %s', (d) => expect(errorsOf({ depth: d }).depth).toBeUndefined())
    it.each(['0', '2001', '12.5', '-5', 'abc', '10000'])('rejects %s', (d) => expect(errorsOf({ depth: d }).depth).toMatch(/depth/i))
  })

  it('limits message length to 1000', () => {
    expect(errorsOf({ message: 'x'.repeat(1000) }).message).toBeUndefined()
    expect(errorsOf({ message: 'x'.repeat(1001) }).message).toMatch(/1000/)
  })

  it('rejects a filled honeypot (bots)', () => {
    expect(enquirySchema.safeParse({ ...valid, website: 'http://spam.example' }).success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    const r = enquirySchema.parse({ ...valid, name: '  Asha Rao  ', location: ' Pune ' })
    expect(r.name).toBe('Asha Rao')
    expect(r.location).toBe('Pune')
  })

  it('reports every missing required field at once', () => {
    const e = errorsOf({ name: '', phone: '', location: '', service: '' })
    expect(Object.keys(e).sort()).toEqual(['location', 'name', 'phone', 'service'])
  })
})

describe('serviceOptions', () => {
  it('lists every service plus an "Other" option', () => {
    expect(serviceOptions).toEqual([...services.map((s) => s.title), 'Other / Not sure'])
    expect(serviceOptions).toHaveLength(9)
  })
})
