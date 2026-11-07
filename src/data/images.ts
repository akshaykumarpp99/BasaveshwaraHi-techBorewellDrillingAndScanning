/**
 * Central image map. All site imagery is referenced from here, so replacing a
 * placeholder with a real photo only means changing a path in this file
 * (drop the file in /public/images).
 * Current files are generated artwork: see scripts/generate-images.mjs.
 */
export const images = {
  hero: '/images/hero-rig.webp',
  aboutMain: '/images/about-rig.webp',
  aboutTeam: '/images/team.webp',
  rig: '/images/rig.webp',
  hydraulic: '/images/hydraulic.webp',
  compressor: '/images/compressor.webp',
  tanker: '/images/tanker.webp',
  accessories: '/images/accessories.webp',
  survey: '/images/survey.webp',
  pump: '/images/pump.webp',
  cleaning: '/images/cleaning.webp',
  flushing: '/images/flushing.webp',
  openwell: '/images/openwell.webp',
  maintenance: '/images/maintenance.webp',
  residential: '/images/residential.webp',
  agricultural: '/images/agricultural.webp',
  commercial: '/images/commercial.webp',
  industrial: '/images/industrial.webp',
} as const

export type ImageKey = keyof typeof images
