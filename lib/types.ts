// ═══════════════════════════════════════════════════════════
// INOVANERD — Tipos e Interfaces
// Preparado para integração com backend (Supabase, Neon, etc.)
// ═══════════════════════════════════════════════════════════

export type ProductCategory = 'camisetas' | 'bonecos'
export type BadgeType = 'new' | 'sale' | 'hot' | null

export interface Product {
  id: number
  name: string
  anime: string
  category: ProductCategory
  price: number
  oldPrice: number | null
  emoji: string
  badge: BadgeType
  rating: number
  reviews: number
  sizes: string[]
  description: string
  tags: string[]
  bestseller: boolean
  featured: boolean
  image: string | null
}

export interface CartItem {
  key: string
  id: number
  name: string
  anime: string
  emoji: string
  image: string | null
  price: number
  size: string | null
  qty: number
}

export interface CartTotals {
  subtotalBruto: number
  desconto: number
  subtotal: number
  frete: number
  total: number
}

export interface Coupon {
  code: string
  pct: number
}

// ─── Tipos para API ─────────────────────────────────
export interface OrderItem {
  product_id: number
  variant: string | null
  qty: number
  price: number
}

export interface CreateOrderPayload {
  items: OrderItem[]
  coupon: string | null
  totals: CartTotals
  customer: CustomerInfo
}

export interface CustomerInfo {
  nome: string
  email: string
  cpf: string
  telefone: string
  cep: string
  endereco: string
  numero: string
  complemento?: string
  cidade: string
  estado: string
}

export interface OrderResponse {
  success: boolean
  order_id: string
  message?: string
}

// ─── Filtros do Catálogo ─────────────────────────────
export interface CatalogFilters {
  category: 'todos' | ProductCategory
  animes: string[]
  maxPrice: number
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'name'
}
