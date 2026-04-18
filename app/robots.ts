import type { MetadataRoute } from 'next'
import { getAppBaseUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
