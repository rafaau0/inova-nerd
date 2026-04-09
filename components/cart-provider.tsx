'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { CartItem, Coupon, Product } from '@/lib/types'
import {
  loadCart,
  saveCart,
  addToCart as addToCartFn,
  removeFromCart as removeFromCartFn,
  updateCartQty as updateCartQtyFn,
  getCartTotals,
  getCartCount,
  validateCoupon,
  loadWishlist,
  saveWishlist,
  toggleWishlistItem,
} from '@/lib/cart-store'

interface CartContextType {
  cart: CartItem[]
  coupon: Coupon | null
  wishlist: number[]
  cartCount: number
  totals: ReturnType<typeof getCartTotals>
  addToCart: (product: Product, qty?: number, size?: string | null) => void
  removeFromCart: (key: string) => void
  updateQty: (key: string, delta: number) => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  clearCart: () => void
  toggleWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hidrata o estado do localStorage
  useEffect(() => {
    setCart(loadCart())
    setWishlist(loadWishlist())
    setIsHydrated(true)
  }, [])

  // Persiste carrinho
  useEffect(() => {
    if (isHydrated) {
      saveCart(cart)
    }
  }, [cart, isHydrated])

  // Persiste wishlist
  useEffect(() => {
    if (isHydrated) {
      saveWishlist(wishlist)
    }
  }, [wishlist, isHydrated])

  const addToCart = useCallback((product: Product, qty = 1, size: string | null = null) => {
    setCart(prev => addToCartFn(prev, product, qty, size))
  }, [])

  const removeFromCart = useCallback((key: string) => {
    setCart(prev => removeFromCartFn(prev, key))
  }, [])

  const updateQty = useCallback((key: string, delta: number) => {
    setCart(prev => updateCartQtyFn(prev, key, delta))
  }, [])

  const applyCoupon = useCallback((code: string): boolean => {
    const validCoupon = validateCoupon(code)
    if (validCoupon) {
      setCoupon(validCoupon)
      return true
    }
    return false
  }, [])

  const removeCoupon = useCallback(() => {
    setCoupon(null)
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setCoupon(null)
  }, [])

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => toggleWishlistItem(prev, id))
  }, [])

  const isInWishlist = useCallback((id: number) => wishlist.includes(id), [wishlist])

  const cartCount = getCartCount(cart)
  const totals = getCartTotals(cart, coupon)

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        wishlist,
        cartCount,
        totals,
        addToCart,
        removeFromCart,
        updateQty,
        applyCoupon,
        removeCoupon,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}
