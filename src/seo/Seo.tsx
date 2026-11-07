import { Helmet } from 'react-helmet-async'
import { site } from '../config/site'

interface Props {
  title: string
  description: string
  /** Path beginning with "/", used for canonical + og:url. */
  path: string
  jsonLd?: object | object[]
  noindex?: boolean
}

export default function Seo({ title, description, path, jsonLd, noindex }: Props) {
  const url = `${site.url}${path === '/' ? '' : path}`
  const image = `${site.url}${site.ogImage}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  )
}
