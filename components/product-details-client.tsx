'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/toast-provider'
import type { Product } from '@/lib/types'

interface ProductDetailsClientProps {
  product: Product
  related: Product[]
}

export function ProductDetailsClient({
  product,
  related,
}: ProductDetailsClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useToast()

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? null : 'N/A'
  )
  const [qty, setQty] = useState(1)

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock <= 0

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  const stars = Math.floor(product.rating)
  const hasHalfStar = product.rating % 1 >= 0.5

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Produto sem estoque no momento.', 'error')
      return
    }

    if (product.sizes.length > 0 && !selectedSize) {
      showToast('Selecione um tamanho primeiro.', 'error')
      return
    }

    if (qty > product.stock) {
      showToast(`Temos apenas ${product.stock} unidade(s) disponiveis.`, 'error')
      return
    }

    addToCart(product, qty, selectedSize)
    showToast(`${product.name} adicionado ao carrinho.`, 'success')
  }

  const handleWishlist = () => {
    toggleWishlist(product.id)
    showToast(
      inWishlist ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.',
      inWishlist ? 'info' : 'success'
    )
  }

  return (
    <main className="pt-[72px]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-orange transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[120px] bg-gradient-to-br from-card to-purple/30">
                {product.emoji}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-purple-light uppercase tracking-wider mb-2">
              {product.category === 'camisetas' ? 'Camiseta' : 'Boneco colecionavel'}
            </div>
            <div className="text-sm text-muted-foreground mb-4">{product.anime}</div>

            <h1 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-orange">
                {Array.from({ length: stars }).map((_, index) => (
                  <Star key={index} className="w-5 h-5 fill-current" />
                ))}
                {hasHalfStar && <Star className="w-5 h-5 fill-current opacity-50" />}
              </div>
              <span className="font-bold text-orange">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} avaliacoes)</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
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

            <div className="mb-8 text-sm text-muted-foreground">
              {isOutOfStock
                ? 'Sem estoque no momento.'
                : `${product.stock} unidade(s) disponiveis.`}
            </div>

            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="text-sm font-semibold text-foreground mb-3">Tamanho</div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
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
                  onClick={() => setQty(Math.min(Math.max(product.stock, 1), qty + 1))}
                  className="w-12 h-12 rounded-xl bg-card border border-border text-foreground flex items-center justify-center hover:border-orange transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Sem estoque' : 'Adicionar ao carrinho'}
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

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl tracking-wide text-foreground mb-8">
              VOCE TAMBEM VAI GOSTAR
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} delay={index * 0.1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
