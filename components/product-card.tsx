'use client'

import Image from 'next/image'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Heart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCart } from './cart-provider'
import { useToast } from './toast-provider'

interface ProductCardProps {
  product: Product
  delay?: number
}

const badgeMap = {
  new: { label: 'Novo', className: 'bg-green-500' },
  sale: { label: 'Oferta', className: 'bg-orange' },
  hot: { label: 'Hot', className: 'bg-red-500' },
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useToast()
  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock <= 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) {
      showToast('Produto sem estoque no momento.', 'error')
      return
    }

    if (product.sizes.length > 0) {
      showToast('Selecione o tamanho na pagina do produto.', 'info')
      return
    }

    addToCart(product)
    track('add_to_cart', {
      productId: product.id,
      productName: product.name,
    })
    showToast(`${product.name} adicionado ao carrinho.`, 'success')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(
      inWishlist ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.',
      inWishlist ? 'info' : 'success'
    )
  }

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-orange hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(245,158,11,0.2)]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-card-foreground/5">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-card to-purple/30">
            {product.emoji}
          </div>
        )}

        {product.badge && (
          <span
            className={`absolute top-3 left-3 ${badgeMap[product.badge].className} text-background text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide`}
          >
            {badgeMap[product.badge].label}
          </span>
        )}

        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            inWishlist
              ? 'bg-red-500/20 text-red-500'
              : 'bg-background/70 text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
          }`}
          aria-label="Favoritar"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-purple-light mb-1.5">
          {product.anime}
        </div>
        <div className="text-[15px] font-bold text-foreground mb-2.5 leading-tight line-clamp-2">
          {product.name}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="font-condensed text-xl font-bold text-orange">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
            {product.oldPrice && (
              <div className="text-sm text-muted-foreground line-through">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="bg-gradient-to-br from-purple to-purple-light text-white border-none px-4 py-2 rounded-lg text-sm font-bold transition-all hover:from-orange-dark hover:to-orange hover:text-background hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOutOfStock ? 'Sem estoque' : '+ Carrinho'}
          </button>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {isOutOfStock ? 'Produto indisponivel.' : `${product.stock} unidade(s) em estoque`}
        </div>
      </div>
    </Link>
  )
}
