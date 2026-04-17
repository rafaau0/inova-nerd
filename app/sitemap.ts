import type { MetadataRoute } from 'next'
import { readProducts } from '@/lib/server-store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const products = await readProducts()

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
