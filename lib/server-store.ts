import 'server-only'

import { getShippingQuote } from './shipping-server'
import { getDataStore } from './data'
import type {
  AuthUser,
  CreateCouponPayload,
  CreateOrderPayload,
  CouponDefinition,
  OrderRecord,
  OrderStatus,
  Product,
  SessionRecord,
  UserRecord,
} from './types'

const store = getDataStore()

export async function readProducts(): Promise<Product[]> {
  return store.readProducts()
}

export async function writeProducts(products: Product[]) {
  await store.writeProducts(products)
}

export async function upsertProduct(product: Product) {
  const products = await readProducts()
  const exists = products.some((item) => item.id === product.id)
  const nextProducts = exists
    ? products.map((item) => (item.id === product.id ? product : item))
    : [...products, product].sort((a, b) => a.id - b.id)

  await writeProducts(nextProducts)
  return product
}

export async function deleteProduct(productId: number) {
  const products = await readProducts()
  const nextProducts = products.filter((item) => item.id !== productId)
  await writeProducts(nextProducts)
}

export async function getNextProductId() {
  const products = await readProducts()
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1
}

export async function readCoupons(): Promise<CouponDefinition[]> {
  return store.readCoupons()
}

export async function writeCoupons(coupons: CouponDefinition[]) {
  await store.writeCoupons(coupons)
}

export async function upsertCoupon(coupon: CreateCouponPayload) {
  const coupons = await readCoupons()
  const normalizedCode = coupon.code.trim().toUpperCase()
  const existing = coupons.find((item) => item.code === normalizedCode)
  const nextCoupon: CouponDefinition = {
    code: normalizedCode,
    pct: coupon.pct,
    minValue: coupon.minValue,
    active: coupon.active,
    maxUses: coupon.maxUses,
    uses: existing?.uses ?? 0,
  }

  const nextCoupons = existing
    ? coupons.map((item) => (item.code === normalizedCode ? nextCoupon : item))
    : [...coupons, nextCoupon].sort((a, b) => a.code.localeCompare(b.code))

  await writeCoupons(nextCoupons)
  return nextCoupon
}

export async function deleteCoupon(code: string) {
  const coupons = await readCoupons()
  const nextCoupons = coupons.filter((item) => item.code !== code.toUpperCase())
  await writeCoupons(nextCoupons)
}

export async function readOrders(): Promise<OrderRecord[]> {
  return store.readOrders()
}

export async function writeOrders(orders: OrderRecord[]) {
  await store.writeOrders(orders)
}

export async function updateOrderPayment(
  orderId: string,
  updates: Partial<
    Pick<
      OrderRecord,
      'status' | 'paymentStatus' | 'paymentReferenceId' | 'paymentUrl' | 'paymentProvider'
    >
  >
) {
  const orders = await readOrders()
  const nextOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          ...updates,
        }
      : order
  )

  await writeOrders(nextOrders)
  return nextOrders.find((order) => order.id === orderId) ?? null
}

export async function readUsers(): Promise<UserRecord[]> {
  return store.readUsers()
}

export async function writeUsers(users: UserRecord[]) {
  await store.writeUsers(users)
}

export async function createUser(user: UserRecord) {
  const users = await readUsers()
  await writeUsers([user, ...users])
  return user
}

export async function findUserByEmail(email: string) {
  const users = await readUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
}

export async function findUserById(userId: string) {
  const users = await readUsers()
  return users.find((user) => user.id === userId) ?? null
}

export async function updateUserPasswordHash(userId: string, passwordHash: string) {
  const users = await readUsers()
  const nextUsers = users.map((user) =>
    user.id === userId
      ? {
          ...user,
          passwordHash,
        }
      : user
  )

  await writeUsers(nextUsers)
}

export async function readSessions(): Promise<SessionRecord[]> {
  return store.readSessions()
}

export async function writeSessions(sessions: SessionRecord[]) {
  await store.writeSessions(sessions)
}

export async function createSession(session: SessionRecord) {
  const sessions = await readSessions()
  await writeSessions([session, ...sessions])
  return session
}

export async function findSession(token: string) {
  const sessions = await readSessions()
  return sessions.find((session) => session.token === token) ?? null
}

export async function deleteSession(token: string) {
  const sessions = await readSessions()
  await writeSessions(sessions.filter((session) => session.token !== token))
}

export function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    cpf: user.cpf || '',
    telefone: user.telefone || '',
    cep: user.cep || '',
    endereco: user.endereco || '',
    numero: user.numero || '',
    complemento: user.complemento || '',
    bairro: user.bairro || '',
    cidade: user.cidade || '',
    estado: user.estado || '',
  }
}

export async function getOrdersByUser(userId: string) {
  const orders = await readOrders()
  return orders.filter((order) => order.userId === userId)
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = await readOrders()
  const nextOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status,
        }
      : order
  )

  await writeOrders(nextOrders)
  return nextOrders.find((order) => order.id === orderId) ?? null
}

export async function quoteOrderPricing(payload: {
  items: CreateOrderPayload['items']
  coupon: string | null
  customer: Pick<CreateOrderPayload['customer'], 'cidade' | 'estado' | 'cep'>
}) {
  const products = await readProducts()
  const coupons = await readCoupons()
  const productMap = new Map(products.map((product) => [product.id, product]))
  const missingItems: number[] = []
  const stockErrors: string[] = []

  for (const item of payload.items) {
    const product = productMap.get(item.product_id)
    if (!product) {
      missingItems.push(item.product_id)
      continue
    }

    if (product.stock < item.qty) {
      stockErrors.push(`${product.name}: disponivel ${product.stock}, solicitado ${item.qty}`)
    }
  }

  if (missingItems.length > 0) {
    return {
      ok: false as const,
      status: 404,
      error: `Produtos nao encontrados: ${missingItems.join(', ')}`,
    }
  }

  if (stockErrors.length > 0) {
    return {
      ok: false as const,
      status: 409,
      error: `Estoque insuficiente. ${stockErrors.join(' | ')}`,
    }
  }

  const subtotalBruto = payload.items.reduce((sum, item) => {
    const product = productMap.get(item.product_id)!
    return sum + product.price * item.qty
  }, 0)

  let appliedCoupon: CouponDefinition | null = null
  if (payload.coupon) {
    appliedCoupon =
      coupons.find((coupon) => coupon.code === payload.coupon && coupon.active) ?? null

    if (!appliedCoupon) {
      return {
        ok: false as const,
        status: 400,
        error: 'Cupom invalido ou inativo.',
      }
    }

    if (appliedCoupon.minValue && subtotalBruto < appliedCoupon.minValue) {
      return {
        ok: false as const,
        status: 400,
        error: `Valor minimo para o cupom: R$ ${appliedCoupon.minValue
          .toFixed(2)
          .replace('.', ',')}`,
      }
    }

    if (appliedCoupon.maxUses && appliedCoupon.uses >= appliedCoupon.maxUses) {
      return {
        ok: false as const,
        status: 400,
        error: 'Cupom sem saldo de uso.',
      }
    }
  }

  const desconto = appliedCoupon ? subtotalBruto * (appliedCoupon.pct / 100) : 0
  const subtotal = subtotalBruto - desconto
  const shippingQuote = await getShippingQuote(
    subtotal,
    {
      cidade: payload.customer.cidade,
      estado: payload.customer.estado,
      cep: payload.customer.cep,
    },
    payload.items.reduce((sum, item) => sum + item.qty, 0)
  )
  const total = subtotal + shippingQuote.amount

  return {
    ok: true as const,
    products,
    coupons,
    productMap,
    appliedCoupon,
    shippingQuote,
    totals: {
      subtotalBruto,
      desconto,
      subtotal,
      frete: shippingQuote.amount,
      total,
    },
  }
}

export async function createOrder(payload: CreateOrderPayload & { userId?: string | null }) {
  const orders = await readOrders()
  const pricing = await quoteOrderPricing({
    items: payload.items,
    coupon: payload.coupon,
    customer: {
      cidade: payload.customer.cidade,
      estado: payload.customer.estado,
      cep: payload.customer.cep,
    },
  })

  if (!pricing.ok) {
    return pricing
  }

  const orderId = `IN${Date.now().toString().slice(-8)}`
  const createdAt = new Date().toISOString()

  const updatedProducts = pricing.products.map((product) => {
    const orderedItem = payload.items.find((item) => item.product_id === product.id)
    if (!orderedItem) return product

    return {
      ...product,
      stock: product.stock - orderedItem.qty,
    }
  })

  const orderRecord: OrderRecord = {
    id: orderId,
    createdAt,
    status: 'awaiting_payment',
    paymentStatus: 'pending',
    paymentMethod: payload.paymentMethod,
    userId: payload.userId ?? null,
    customer: payload.customer,
    coupon: payload.coupon,
    totals: pricing.totals,
    items: payload.items.map((item) => {
      const product = pricing.productMap.get(item.product_id)!
      return {
        ...item,
        price: product.price,
        product_name: product.name,
      }
    }),
  }

  await writeProducts(updatedProducts)
  await writeOrders([orderRecord, ...orders])

  if (pricing.appliedCoupon) {
    const updatedCoupons = pricing.coupons.map((coupon) =>
      coupon.code === pricing.appliedCoupon?.code ? { ...coupon, uses: coupon.uses + 1 } : coupon
    )
    await writeCoupons(updatedCoupons)
  }

  return {
    ok: true as const,
    order: orderRecord,
  }
}
