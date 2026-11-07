import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToId } from '../../lib/scroll'
import { fullAddress, mailHref, phoneHref, site, whatsappLink } from '../../config/site'

describe('scrollToId', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('scrolls an existing element into view (smooth by default) and returns true', () => {
    document.body.innerHTML = '<section id="faq"></section>'
    const spy = vi.fn()
    document.getElementById('faq')!.scrollIntoView = spy
    expect(scrollToId('faq')).toBe(true)
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })
  it('supports a custom scroll behaviour', () => {
    document.body.innerHTML = '<div id="a"></div>'
    const spy = vi.fn()
    document.getElementById('a')!.scrollIntoView = spy
    scrollToId('a', 'auto')
    expect(spy).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })
  it('returns false when the element does not exist', () => expect(scrollToId('missing')).toBe(false))
})

describe('site config helpers', () => {
  it('phoneHref is a tel: link with country code', () => expect(phoneHref).toBe(`tel:+${site.phoneRaw}`))
  it('mailHref is a mailto: link', () => expect(mailHref).toBe(`mailto:${site.email}`))
  it('whatsappLink encodes the default message', () => {
    const href = whatsappLink()
    expect(href).toMatch(new RegExp(`^https://wa\\.me/${site.whatsappRaw}\\?text=`))
    expect(decodeURIComponent(href.split('text=')[1])).toContain(site.name)
  })
  it('whatsappLink encodes custom text (spaces, newlines, symbols)', () => {
    const href = whatsappLink('Hi & hello\nline 2?')
    expect(href).toContain(encodeURIComponent('Hi & hello\nline 2?'))
    expect(href).not.toMatch(/ |\n/)
  })
  it('fullAddress joins street, locality, region and postcode', () => {
    expect(fullAddress()).toBe(`${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`)
  })
  it('exposes the four hero stats from the brief', () => {
    expect(site.stats.map((s) => `${s.value}${s.suffix} ${s.label}`)).toEqual([
      '1000+ Successful Borewells', '15+ Years of Experience', '500+ Happy Customers', '100% Customer Commitment',
    ])
  })
  it('has every required company field filled in (nothing undefined or blank)', () => {
    const required = [site.name, site.tagline, site.city, site.country, site.phone, site.phoneRaw, site.whatsappRaw, site.email, site.hours, site.url,
      site.address.street, site.address.locality, site.address.region, site.address.postalCode, site.mapEmbedUrl, site.mapLinkUrl, site.ogImage]
    for (const v of required) expect(typeof v === 'string' && v.trim().length > 0, String(v)).toBe(true)
    expect(Number.isFinite(site.geo.lat) && Number.isFinite(site.geo.lng)).toBe(true)
    expect(fullAddress()).not.toMatch(/undefined/)
  })
  it('keeps phone numbers digits-only for tel:/wa.me', () => {
    expect(site.phoneRaw).toMatch(/^\d{10,15}$/)
    expect(site.whatsappRaw).toMatch(/^\d{10,15}$/)
  })
})
