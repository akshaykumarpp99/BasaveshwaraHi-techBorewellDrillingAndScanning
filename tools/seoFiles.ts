import type { Plugin } from 'vite'

export interface SeoFilesInput {
  siteUrl: string
  servicePaths: string[]
  cityPaths: string[]
}

/** Paths that go into sitemap.xml. */
export const sitemapPaths = ({ servicePaths, cityPaths }: Pick<SeoFilesInput, 'servicePaths' | 'cityPaths'>) => [
  '/', '/about', '/services', '/projects', '/contact', ...servicePaths, ...cityPaths,
]

export const buildSitemap = (input: SeoFilesInput) => {
  const urls = sitemapPaths(input)
    .map((p) => `  <url><loc>${input.siteUrl}${p === '/' ? '' : p}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export const buildRobots = (siteUrl: string) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

/** Emits sitemap.xml + robots.txt from the same data the app renders, so they never drift. */
export function seoFiles(input: SeoFilesInput): Plugin {
  return {
    name: 'seo-files',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(input) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(input.siteUrl) })
    },
  }
}
