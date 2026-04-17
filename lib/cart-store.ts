import { calculateShipping } from './shipping'
import type { CartItem, CartTotals, Product, ShippingDestination } from './types'

const CART_KEY = 'inovanerd_cart'
const WISHLIST_KEY = 'inovanerd_wishlist'
const CART_EXPIRY_MS = 24 * 60 * 60 * 1000

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []

    const { items, timestamp } = JSON.parse(raw) as {
      items: CartItem[]
      timestamp: number
    }

    if (Date.now() - timestamp > CART_EXPIRY_MS) {
      localStorage.removeItem(CART_KEY)
      return []
    }

    return items || []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(CART_KEY, JSON.stringify({ items, timestamp: Date.now() }))
}

export function addToCart(
  cart: CartItem[],
  product: Product,
  qty = 1,
  size: string | null = null
): CartItem[] {
  const key = `${product.id}_${size || 'n'}`
  const existing = cart.find((item) => item.key === key)

  if (existing) {
    return cart.map((item) =>
      item.key === key
        ? { ...item, qty: Math.min(item.qty + qty, 10) }
        : item
    )
  }

  return [
    ...cart,
    {
      key,
      id: product.id,
      name: product.name,
      anime: product.anime,
      emoji: product.emoji,
      image: product.image,
      price: product.price,
      size,
      qty,
    },
  ]
}

export function removeFromCart(cart: CartItem[], key: string): CartItem[] {
  return cart.filter((item) => item.key !== key)
}

export function updateCartQty(cart: CartItem[], key: string, delta: number): CartItem[] {
  return cart.map((item) => {
    if (item.key !== key) return item

    const newQty = Math.max(1, Math.min(10, item.qty + delta))
    return { ...item, qty: newQty }
  })
}

export function getCartTotals(
  cart: CartItem[],
  coupon: { pct: number } | null,
  destination?: ShippingDestination
): CartTotals {
  const subtotalBruto = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const desconto = coupon ? subtotalBruto * (coupon.pct / 100) : 0
  const subtotal = subtotalBruto - desconto
  const frete = calculateShipping(subtotal, destination)
  const total = subtotal + frete

  return { subtotalBruto, desconto, subtotal, frete, total }
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

export function loadWishlist(): number[] {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]') as number[]
  } catch {
    return []
  }
}

export function saveWishlist(wishlist: number[]): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
}

export function toggleWishlistItem(wishlist: number[], id: number): number[] {
  const exists = wishlist.includes(id)
  return exists ? wishlist.filter((item) => item !== id) : [...wishlist, id]
}
