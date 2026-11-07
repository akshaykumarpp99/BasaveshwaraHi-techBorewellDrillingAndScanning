import { describe, expect, it } from 'vitest'
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, serviceJsonLd } from '../../lib/seo'
import { faqs } from '../../data/content'
import { site } from '../../config/site'

describe('localBusinessJsonLd', () => {
  const ld = localBusinessJsonLd() as Record<string, any>
  it('declares schema.org LocalBusiness', () => {
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toContain('LocalBusiness')
    expect(ld['@id']).toBe(`${site.url}/#business`)
  })
  it('carries name, phone, email and address from site config', () => {
    expect(ld.name).toBe(site.name)
    expect(ld.telephone).toBe(`+${site.phoneRaw}`)
    expect(ld.email).toBe(site.email)
    expect(ld.address).toMatchObject({ '@type': 'PostalAddress', addressLocality: site.address.locality, postalCode: site.address.postalCode, addressCountry: site.country })
  })
  it('has geo coordinates and opening hours', () => {
    expect(ld.geo).toMatchObject({ latitude: site.geo.lat, longitude: site.geo.lng })
    expect(ld.openingHoursSpecification[0]).toMatchObject({ opens: '08:00', closes: '19:00' })
    expect(ld.openingHoursSpecification[0].dayOfWeek).toHaveLength(6)
  })
  it('only lists social profiles that are configured', () => {
    expect(ld.sameAs).toEqual(Object.values(site.socials).filter(Boolean))
  })
  it('does not contain non-schema keys', () => expect(Object.keys(ld)).not.toContain('address_text'))
  it('is JSON-serialisable', () => expect(() => JSON.parse(JSON.stringify(ld))).not.toThrow())
})

describe('faqJsonLd', () => {
  const ld = faqJsonLd() as Record<string, any>
  it('maps every FAQ to a Question/Answer pair', () => {
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity).toHaveLength(faqs.length)
    expect(ld.mainEntity[0]).toEqual({ '@type': 'Question', name: faqs[0].q, acceptedAnswer: { '@type': 'Answer', text: faqs[0].a } })
  })
})

describe('serviceJsonLd', () => {
  it('describes the service for the default area', () => {
    const ld = serviceJsonLd('Borewell Cleaning', 'desc', '/services/borewell-cleaning') as Record<string, any>
    expect(ld).toMatchObject({ '@type': 'Service', name: 'Borewell Cleaning', description: 'desc', areaServed: site.city, url: `${site.url}/services/borewell-cleaning` })
    expect(ld.provider['@id']).toBe(`${site.url}/#business`)
  })
  it('accepts a custom area (city landing pages)', () => {
    expect((serviceJsonLd('X', 'd', '/p', 'Nashik') as any).areaServed).toBe('Nashik')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers items from 1 with absolute URLs', () => {
    const ld = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]) as Record<string, any>
    expect(ld['@type']).toBe('BreadcrumbList')
    expect(ld.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.url}/services` },
    ])
  })
  it('handles an empty trail', () => expect((breadcrumbJsonLd([]) as any).itemListElement).toEqual([]))
})
