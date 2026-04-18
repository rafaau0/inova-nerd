import type { MetadataRoute } from 'next'
import { getAppBaseUrl } from '@/lib/env'
import { readProducts } from '@/lib/server-store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppBaseUrl()
  const products = await readProducts().catch(() => [])

  const staticRoutes = ['', '/catalogo', '/favoritos', '/sobre', '/politica-de-troca', '/faq', '/contato']
    .map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    }))

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/produto/${product.id}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...productRoutes]
}
