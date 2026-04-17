'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { CartItem, Coupon, Product, ShippingDestination } from '@/lib/types'
import {
  loadCart,
  saveCart,
  addToCart as addToCartFn,
  removeFromCart as removeFromCartFn,
  updateCartQty as updateCartQtyFn,
  getCartTotals,
  getCartCount,
  loadWishlist,
  saveWishlist,
  toggleWishlistItem,
} from '@/lib/cart-store'

interface CouponResult {
  ok: boolean
  error?: string
}

interface CartContextType {
  cart: CartItem[]
  coupon: Coupon | null
  wishlist: number[]
  shippingDestination: ShippingDestination | null
  cartCount: number
  totals: ReturnType<typeof getCartTotals>
  addToCart: (product: Product, qty?: number, size?: string | null) => void
  removeFromCart: (key: string) => void
  updateQty: (key: string, delta: number) => void
  applyCoupon: (code: string) => Promise<CouponResult>
  removeCoupon: () => void
  clearCart: () => void
  setShippingDestination: (destination: ShippingDestination | null) => void
  toggleWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart())
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [wishlist, setWishlist] = useState<number[]>(() => loadWishlist())
  const [shippingDestination, setShippingDestination] = useState<ShippingDestination | null>(null)

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  useEffect(() => {
    saveWishlist(wishlist)
  }, [wishlist])

  const addToCart = useCallback((product: Product, qty = 1, size: string | null = null) => {
    setCart((prev) => addToCartFn(prev, product, qty, size))
  }, [])

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => removeFromCartFn(prev, key))
  }, [])

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((prev) => updateCartQtyFn(prev, key, delta))
  }, [])

  const applyCoupon = useCallback(
    async (code: string): Promise<CouponResult> => {
      try {
        const response = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            cartTotal: getCartTotals(cart, null).subtotalBruto,
          }),
        })

        const result = (await response.json()) as {
          success: boolean
          error?: string
          data?: Coupon
        }

        if (!response.ok || !result.success || !result.data) {
          return {
            ok: false,
            error: result.error || 'Nao foi possivel validar o cupom.',
          }
        }

        setCoupon(result.data)
        return { ok: true }
      } catch {
        return {
          ok: false,
          error: 'Falha ao validar cupom no momento.',
        }
      }
    },
    [cart]
  )

  const removeCoupon = useCallback(() => {
    setCoupon(null)
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setCoupon(null)
    setShippingDestination(null)
  }, [])

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => toggleWishlistItem(prev, id))
  }, [])

  const isInWishlist = useCallback((id: number) => wishlist.includes(id), [wishlist])

  const cartCount = getCartCount(cart)
  const totals = getCartTotals(cart, coupon, shippingDestination ?? undefined)

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        wishlist,
        shippingDestination,
        cartCount,
        totals,
        addToCart,
        removeFromCart,
        updateQty,
        applyCoupon,
        removeCoupon,
        clearCart,
        setShippingDestination,
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
