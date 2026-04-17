export type ProductCategory = 'camisetas' | 'bonecos'
export type BadgeType = 'new' | 'sale' | 'hot' | null
export type PaymentMethod = 'credit_card' | 'pix' | 'boleto' | 'debit'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatus = 'awaiting_payment' | 'confirmed' | 'cancelled'
export type UserRole = 'customer' | 'admin'

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
  stock: number
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

export interface CouponDefinition extends Coupon {
  minValue: number | null
  active: boolean
  maxUses: number | null
  uses: number
}

export interface CreateCouponPayload {
  code: string
  pct: number
  minValue: number | null
  active: boolean
  maxUses: number | null
}

export interface OrderItem {
  product_id: number
  variant: string | null
  qty: number
  price: number
}

export interface OrderItemRecord extends OrderItem {
  product_name: string
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

export interface CreateOrderPayload {
  items: OrderItem[]
  coupon: string | null
  totals: CartTotals
  customer: CustomerInfo
  paymentMethod: PaymentMethod
}

export interface CheckoutPreferencePayload extends CreateOrderPayload {
  paymentMethod: PaymentMethod
}

export interface OrderResponse {
  success: boolean
  order_id?: string
  message?: string
  error?: string
}

export interface OrderRecord {
  id: string
  createdAt: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  paymentProvider?: 'mercado_pago'
  paymentReferenceId?: string | null
  paymentUrl?: string | null
  userId?: string | null
  customer: CustomerInfo
  coupon: string | null
  totals: CartTotals
  items: OrderItemRecord[]
}

export interface CatalogFilters {
  category: 'todos' | ProductCategory
  animes: string[]
  maxPrice: number
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'name'
}

export interface UserRecord {
  id: string
  nome: string
  email: string
  cpf?: string
  telefone?: string
  passwordHash: string
  role: UserRole
  createdAt: string
}

export interface SessionRecord {
  token: string
  userId: string
  createdAt: string
  expiresAt: string
}

export interface AuthUser {
  id: string
  nome: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: AuthUser
}
