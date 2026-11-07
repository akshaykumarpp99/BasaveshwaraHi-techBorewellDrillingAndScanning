import { site } from '../config/site'
import { faqs } from '../data/content'

const abs = (path: string) => `${site.url}${path}`

export const localBusinessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
  '@id': `${site.url}/#business`,
  name: site.name,
  description: `${site.name} provides borewell drilling, cleaning, flushing, pump installation and groundwater survey services in ${site.city}.`,
  url: site.url,
  image: abs(site.ogImage),
  telephone: `+${site.phoneRaw}`,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: site.city,
  openingHoursSpecification: site.hoursSpec.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: Object.values(site.socials).filter(Boolean),
  hasMap: site.mapLinkUrl,
})

export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

export const serviceJsonLd = (name: string, description: string, path: string, area: string = site.city) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: abs(path),
  areaServed: area,
  provider: { '@type': 'LocalBusiness', '@id': `${site.url}/#business`, name: site.name },
})

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
})
