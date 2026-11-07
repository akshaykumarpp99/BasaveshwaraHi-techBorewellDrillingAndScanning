import { describe, expect, it, vi } from 'vitest'
import { buildRobots, buildSitemap, seoFiles, sitemapPaths } from '../../../tools/seoFiles'

const input = { siteUrl: 'https://www.acme.com', servicePaths: ['/services/a', '/services/b'], cityPaths: ['/borewell-drilling-in/pune'] }

describe('sitemap / robots plugin', () => {
  it('lists static pages, services and cities', () => {
    expect(sitemapPaths(input)).toEqual(['/', '/about', '/services', '/projects', '/contact', '/services/a', '/services/b', '/borewell-drilling-in/pune'])
  })
  it('builds valid sitemap XML with absolute URLs and a bare-domain home', () => {
    const xml = buildSitemap(input)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<loc>https://www.acme.com</loc>')
    expect(xml).toContain('<loc>https://www.acme.com/services/a</loc>')
    expect(xml.match(/<url>/g)).toHaveLength(8)
    expect(xml).not.toContain('acme.com//')
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0)
  })
  it('builds robots.txt pointing to the sitemap', () => {
    expect(buildRobots('https://www.acme.com')).toBe('User-agent: *\nAllow: /\n\nSitemap: https://www.acme.com/sitemap.xml\n')
  })
  it('emits both files during the bundle step', () => {
    const emitFile = vi.fn()
    const plugin = seoFiles(input) as any
    plugin.generateBundle.call({ emitFile })
    expect(plugin.name).toBe('seo-files')
    expect(emitFile.mock.calls.map((c) => c[0].fileName)).toEqual(['sitemap.xml', 'robots.txt'])
    expect(emitFile.mock.calls[0][0]).toMatchObject({ type: 'asset' })
  })
})
