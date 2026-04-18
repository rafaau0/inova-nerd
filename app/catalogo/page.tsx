import { CatalogPageClient } from '@/components/catalog-page-client'
import { readProducts } from '@/lib/server-store'

export const dynamic = 'force-dynamic'

interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [{ categoria }, products] = await Promise.all([searchParams, readProducts()])

  return <CatalogPageClient products={products} initialCategory={categoria} />
}
