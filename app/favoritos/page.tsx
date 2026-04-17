'use client'

import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/components/cart-provider'
import { PRODUCTS } from '@/lib/products'

export default function FavoritesPage() {
  const { wishlist } = useCart()
  const favoriteProducts = PRODUCTS.filter((product) => wishlist.includes(product.id))

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-foreground">FAVORITOS</h1>
          <p className="text-muted-foreground mt-2">
            Seus produtos salvos para ver depois.
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-8">
            <p className="text-muted-foreground mb-4">Voce ainda nao favoritou nenhum item.</p>
            <Link href="/catalogo" className="text-orange font-semibold">
              Explorar catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 0.05} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
