import type { MetadataRoute } from 'next'

// The CMS host is not a public site: keep crawlers out of the admin and API, but let them fetch
// media files, which the public site's pages and social previews load from here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/api/media/file/',
      disallow: '/',
    },
  }
}
