import { describe, expect, it } from 'vitest'
import { addToCart, getCartTotals, updateCartQty } from '@/lib/cart-store'
import type { Product } from '@/lib/types'

const product: Product = {
  id: 99,
  name: 'Produto Teste',
  anime: 'Teste',
  category: 'camisetas',
  price: 100,
  oldPrice: null,
  emoji: '🔥',
  badge: null,
  rating: 5,
  reviews: 10,
  sizes: ['M'],
  description: 'Teste',
  tags: ['teste'],
  bestseller: false,
  featured: false,
  image: null,
  stock: 10,
}

describe('cart-store', () => {
  it('adds items and caps quantity at 10', () => {
    const cart = addToCart([], product, 1, 'M')
    const updated = addToCart(cart, product, 20, 'M')
    expect(updated[0]?.qty).toBe(10)
  })

  it('updates cart totals with coupon', () => {
    const cart = addToCart([], product, 2, 'M')
    const totals = getCartTotals(cart, { pct: 10 })
    expect(totals.subtotalBruto).toBe(200)
    expect(totals.desconto).toBe(20)
    expect(totals.total).toBe(199.9)
  })

  it('keeps quantity between 1 and 10', () => {
    const cart = addToCart([], product, 1, 'M')
    const updated = updateCartQty(cart, cart[0]!.key, -20)
    expect(updated[0]?.qty).toBe(1)
  })
})
