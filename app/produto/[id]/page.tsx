import { notFound } from 'next/navigation'
import { ProductDetailsClient } from '@/components/product-details-client'
import { readProducts } from '@/lib/server-store'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const products = await readProducts()
  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    notFound()
  }

  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.stock > 0 &&
        (item.anime === product.anime || item.category === product.category)
    )
    .slice(0, 4)

  return <ProductDetailsClient product={product} related={related} />
}
