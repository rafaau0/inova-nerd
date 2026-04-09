'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import { getProductById, getRelatedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/toast-provider'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { id } = use(params)
  const product = getProductById(Number(id))
  
  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product)
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useToast()
  
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? null : 'N/A'
  )
  const [qty, setQty] = useState(1)
  const inWishlist = isInWishlist(product.id)

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  const stars = Math.floor(product.rating)
  const hasHalfStar = product.rating % 1 >= 0.5

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      showToast('Selecione um tamanho primeiro!', 'error')
      return
    }
    addToCart(product, qty, selectedSize)
    showToast(`${product.name} adicionado ao carrinho!`, 'success')
  }

  const handleWishlist = () => {
    toggleWishlist(product.id)
    showToast(
      inWishlist ? 'Removido dos favoritos' : 'Adicionado aos favoritos!',
      inWishlist ? 'info' : 'success'
    )
  }

  return (
    <main className="pt-[72px]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-orange transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[120px] bg-gradient-to-br from-card to-purple/30">
                {product.emoji}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="text-sm font-semibold text-purple-light uppercase tracking-wider mb-2">
              {product.category === 'camisetas' ? 'Camiseta' : 'Boneco Colecionavel'}
            </div>
            <div className="text-sm text-muted-foreground mb-4">{product.anime}</div>
            
            <h1 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-orange">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                {hasHalfStar && <Star className="w-5 h-5 fill-current opacity-50" />}
              </div>
              <span className="font-bold text-orange">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} avaliacoes)</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-condensed text-4xl font-bold text-orange">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              {discount && (
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="text-sm font-semibold text-foreground mb-3">Tamanho</div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-orange text-background'
                          : 'bg-card border border-border text-foreground hover:border-orange'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <div className="text-sm font-semibold text-foreground mb-3">Quantidade</div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 rounded-xl bg-card border border-border text-foreground flex items-center justify-center hover:border-orange transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold text-foreground min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-12 h-12 rounded-xl bg-card border border-border text-foreground flex items-center justify-center hover:border-orange transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
              <button
                onClick={handleWishlist}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all ${
                  inWishlist
                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                    : 'bg-card border-border text-muted-foreground hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl tracking-wide text-foreground mb-8">
              VOCE TAMBEM VAI GOSTAR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
