/**
 * SINGLE SOURCE OF TRUTH for company information.
 * Edit this file to rebrand the whole site (nav, footer, SEO, structured data,
 * WhatsApp / call links, map). Everything marked PLACEHOLDER must be replaced
 * before going live.
 */
export const site = {
  name: 'Your Company Name', // PLACEHOLDER
  tagline: 'Borewell Drilling & Water Solutions',
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://www.example.com',

  /** Primary city used in titles / local SEO. */
  city: 'Your City', // PLACEHOLDER
  country: 'IN',

  phone: '+91 98765 43210', // PLACEHOLDER
  /** digits only, with country code, for tel: and wa.me */
  phoneRaw: '919876543210', // PLACEHOLDER
  whatsappRaw: '919876543210', // PLACEHOLDER
  email: 'info@example.com', // PLACEHOLDER
  address: {
    street: '123 Industrial Area Road', // PLACEHOLDER
    locality: 'Your City', // PLACEHOLDER
    region: 'Your State', // PLACEHOLDER
    postalCode: '000000', // PLACEHOLDER
  },
  hours: 'Mon – Sat: 8:00 AM – 7:00 PM', // PLACEHOLDER
  /** Opening hours for structured data (schema.org format). */
  hoursSpec: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '19:00' }],

  geo: { lat: 12.9716, lng: 77.5946 }, // PLACEHOLDER
  /** Paste the "Embed a map" src URL from Google Maps → Share → Embed. */
  mapEmbedUrl:
    'https://www.google.com/maps?q=12.9716,77.5946&z=11&output=embed', // PLACEHOLDER
  mapLinkUrl: 'https://www.google.com/maps?q=12.9716,77.5946', // PLACEHOLDER

  socials: {
    facebook: '', // e.g. https://facebook.com/yourpage – leave empty to hide
    instagram: '',
    youtube: '',
  },

  /** Figures supplied by the business owner. Edit freely. */
  stats: [
    { value: 1000, suffix: '+', label: 'Successful Borewells' },
    { value: 15, suffix: '+', label: 'Years of Experience' },
    { value: 500, suffix: '+', label: 'Happy Customers' },
    { value: 100, suffix: '%', label: 'Customer Commitment' },
  ],

  /** Sets which service area pages /borewell-drilling-in/:city exist (see data/cities.ts). */
  ogImage: '/images/og-image.jpg',
} as const

export const phoneHref = `tel:+${site.phoneRaw}`
export const mailHref = `mailto:${site.email}`
export const whatsappLink = (text = `Hello ${site.name}, I would like to enquire about borewell drilling.`) =>
  `https://wa.me/${site.whatsappRaw}?text=${encodeURIComponent(text)}`
/** Pass a translate function to localise the street/locality/region parts (the postcode is left as-is). */
export const fullAddress = (tr: (s: string) => string = (s) => s) =>
  `${tr(site.address.street)}, ${tr(site.address.locality)}, ${tr(site.address.region)} ${site.address.postalCode}`
