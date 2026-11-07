export interface City { slug: string; name: string; region: string; blurb: string }

/**
 * Service-area landing pages: /borewell-drilling-in/:slug
 * Add the real cities you serve. Only list areas you actually cover.
 */
export const cities: City[] = [
  { slug: 'your-city', name: 'Your City', region: 'Your State', blurb: 'Our home base: borewell drilling, cleaning and pump installation across the city and nearby areas.' },
  { slug: 'nearby-town', name: 'Nearby Town', region: 'Your State', blurb: 'Serving homes, farms and businesses in and around this town.' },
  { slug: 'another-district', name: 'Another District', region: 'Your State', blurb: 'Agricultural and residential borewell services across the district.' },
]

export const getCity = (slug?: string) => cities.find((c) => c.slug === slug)
