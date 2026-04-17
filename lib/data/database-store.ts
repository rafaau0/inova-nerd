import 'server-only'

import type { Sql } from 'postgres'
import type { DataStore } from './contracts'
import { getDb } from '@/lib/db'
import type {
  CouponDefinition,
  CustomerInfo,
  OrderItemRecord,
  OrderRecord,
  Product,
  SessionRecord,
  UserRecord,
} from '@/lib/types'

type ProductRow = {
  id: number
  name: string
  anime: string
  category: Product['category']
  price: string | number
  old_price: string | number | null
  emoji: string
  badge: Product['badge']
  rating: string | number
  reviews: number
  sizes: string[] | string
  description: string
  tags: string[] | string
  bestseller: boolean
  featured: boolean
  image: string | null
  stock: number
}

type CouponRow = {
  code: string
  pct: string | number
  min_value: string | number | null
  active: boolean
  max_uses: number | null
  uses: number
}

type UserRow = {
  id: string
  nome: string
  email: string
  cpf: string | null
  telefone: string | null
  cep: string | null
  endereco: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  password_hash: string
  role: UserRecord['role']
  created_at: string | Date
}

type SessionRow = {
  token: string
  user_id: string
  created_at: string | Date
  expires_at: string | Date
}

type OrderRow = {
  id: string
  created_at: string | Date
  status: OrderRecord['status']
  payment_status: OrderRecord['paymentStatus']
  payment_method: OrderRecord['paymentMethod']
  payment_provider: OrderRecord['paymentProvider'] | null
  payment_reference_id: string | null
  payment_url: string | null
  user_id: string | null
  customer: CustomerInfo | string
  coupon: string | null
  totals: OrderRecord['totals'] | string
}

type OrderItemRow = {
  order_id: string
  product_id: number
  product_name: string
  variant: string | null
  qty: number
  price: string | number
}

function ensureArray<T>(value: T[] | string | null | undefined): T[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T[]
    } catch {
      return []
    }
  }
  return []
}

function ensureObject<T>(value: T | string): T {
  if (typeof value === 'string') {
    return JSON.parse(value) as T
  }
  return value
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

function toIsoString(value: string | Date) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function toJsonValue<T>(value: T) {
  return JSON.parse(JSON.stringify(value))
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    anime: row.anime,
    category: row.category,
    price: toNumber(row.price),
    oldPrice: row.old_price === null ? null : toNumber(row.old_price),
    emoji: row.emoji,
    badge: row.badge,
    rating: toNumber(row.rating),
    reviews: row.reviews,
    sizes: ensureArray<string>(row.sizes),
    description: row.description,
    tags: ensureArray<string>(row.tags),
    bestseller: row.bestseller,
    featured: row.featured,
    image: row.image,
    stock: row.stock,
  }
}

function mapCoupon(row: CouponRow): CouponDefinition {
  return {
    code: row.code,
    pct: toNumber(row.pct),
    minValue: row.min_value === null ? null : toNumber(row.min_value),
    active: row.active,
    maxUses: row.max_uses,
    uses: row.uses,
  }
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    cpf: row.cpf || '',
    telefone: row.telefone || '',
    cep: row.cep || '',
    endereco: row.endereco || '',
    numero: row.numero || '',
    complemento: row.complemento || '',
    bairro: row.bairro || '',
    cidade: row.cidade || '',
    estado: row.estado || '',
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: toIsoString(row.created_at),
  }
}

function mapSession(row: SessionRow): SessionRecord {
  return {
    token: row.token,
    userId: row.user_id,
    createdAt: toIsoString(row.created_at),
    expiresAt: toIsoString(row.expires_at),
  }
}

function mapOrders(orderRows: OrderRow[], itemRows: OrderItemRow[]): OrderRecord[] {
  const itemsByOrder = new Map<string, OrderItemRecord[]>()

  for (const row of itemRows) {
    const current = itemsByOrder.get(row.order_id) || []
    current.push({
      product_id: row.product_id,
      product_name: row.product_name,
      variant: row.variant,
      qty: row.qty,
      price: toNumber(row.price),
    })
    itemsByOrder.set(row.order_id, current)
  }

  return orderRows.map((row) => ({
    id: row.id,
    createdAt: toIsoString(row.created_at),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    paymentProvider: row.payment_provider || undefined,
    paymentReferenceId: row.payment_reference_id,
    paymentUrl: row.payment_url,
    userId: row.user_id,
    customer: ensureObject<CustomerInfo>(row.customer),
    coupon: row.coupon,
    totals: ensureObject<OrderRecord['totals']>(row.totals),
    items: itemsByOrder.get(row.id) || [],
  }))
}

async function syncProducts(sql: Sql, products: Product[]) {
  await sql.begin(async (tx) => {
    for (const product of products) {
      await tx`
        insert into products (
          id, name, anime, category, price, old_price, emoji, badge, rating, reviews,
          sizes, description, tags, bestseller, featured, image, stock
        ) values (
          ${product.id},
          ${product.name},
          ${product.anime},
          ${product.category},
          ${product.price},
          ${product.oldPrice},
          ${product.emoji},
          ${product.badge},
          ${product.rating},
          ${product.reviews},
          ${tx.json(product.sizes)},
          ${product.description},
          ${tx.json(product.tags)},
          ${product.bestseller},
          ${product.featured},
          ${product.image},
          ${product.stock}
        )
        on conflict (id) do update set
          name = excluded.name,
          anime = excluded.anime,
          category = excluded.category,
          price = excluded.price,
          old_price = excluded.old_price,
          emoji = excluded.emoji,
          badge = excluded.badge,
          rating = excluded.rating,
          reviews = excluded.reviews,
          sizes = excluded.sizes,
          description = excluded.description,
          tags = excluded.tags,
          bestseller = excluded.bestseller,
          featured = excluded.featured,
          image = excluded.image,
          stock = excluded.stock,
          updated_at = now()
      `
    }

    const ids = products.map((product) => product.id)
    if (ids.length > 0) {
      await tx`delete from products where id not in ${tx(ids)}`
    } else {
      await tx`delete from products`
    }
  })
}

async function syncCoupons(sql: Sql, coupons: CouponDefinition[]) {
  await sql.begin(async (tx) => {
    for (const coupon of coupons) {
      await tx`
        insert into coupons (code, pct, min_value, active, max_uses, uses)
        values (
          ${coupon.code},
          ${coupon.pct},
          ${coupon.minValue},
          ${coupon.active},
          ${coupon.maxUses},
          ${coupon.uses}
        )
        on conflict (code) do update set
          pct = excluded.pct,
          min_value = excluded.min_value,
          active = excluded.active,
          max_uses = excluded.max_uses,
          uses = excluded.uses,
          updated_at = now()
      `
    }

    const codes = coupons.map((coupon) => coupon.code)
    if (codes.length > 0) {
      await tx`delete from coupons where code not in ${tx(codes)}`
    } else {
      await tx`delete from coupons`
    }
  })
}

async function syncUsers(sql: Sql, users: UserRecord[]) {
  await sql.begin(async (tx) => {
    for (const user of users) {
      await tx`
        insert into users (
          id, nome, email, cpf, telefone, cep, endereco, numero, complemento,
          bairro, cidade, estado, password_hash, role, created_at
        ) values (
          ${user.id},
          ${user.nome},
          ${user.email},
          ${user.cpf || null},
          ${user.telefone || null},
          ${user.cep || null},
          ${user.endereco || null},
          ${user.numero || null},
          ${user.complemento || null},
          ${user.bairro || null},
          ${user.cidade || null},
          ${user.estado || null},
          ${user.passwordHash},
          ${user.role},
          ${user.createdAt}
        )
        on conflict (id) do update set
          nome = excluded.nome,
          email = excluded.email,
          cpf = excluded.cpf,
          telefone = excluded.telefone,
          cep = excluded.cep,
          endereco = excluded.endereco,
          numero = excluded.numero,
          complemento = excluded.complemento,
          bairro = excluded.bairro,
          cidade = excluded.cidade,
          estado = excluded.estado,
          password_hash = excluded.password_hash,
          role = excluded.role,
          updated_at = now()
      `
    }

    const ids = users.map((user) => user.id)
    if (ids.length > 0) {
      await tx`delete from users where id not in ${tx(ids)}`
    } else {
      await tx`delete from users`
    }
  })
}

async function syncSessions(sql: Sql, sessions: SessionRecord[]) {
  await sql.begin(async (tx) => {
    for (const session of sessions) {
      await tx`
        insert into sessions (token, user_id, created_at, expires_at)
        values (${session.token}, ${session.userId}, ${session.createdAt}, ${session.expiresAt})
        on conflict (token) do update set
          user_id = excluded.user_id,
          created_at = excluded.created_at,
          expires_at = excluded.expires_at
      `
    }

    const tokens = sessions.map((session) => session.token)
    if (tokens.length > 0) {
      await tx`delete from sessions where token not in ${tx(tokens)}`
    } else {
      await tx`delete from sessions`
    }
  })
}

async function syncOrders(sql: Sql, orders: OrderRecord[]) {
  await sql.begin(async (tx) => {
    for (const order of orders) {
      await tx`
        insert into orders (
          id, created_at, status, payment_status, payment_method, payment_provider,
          payment_reference_id, payment_url, user_id, customer, coupon, totals
        ) values (
          ${order.id},
          ${order.createdAt},
          ${order.status},
          ${order.paymentStatus},
          ${order.paymentMethod},
          ${order.paymentProvider || null},
          ${order.paymentReferenceId || null},
          ${order.paymentUrl || null},
          ${order.userId || null},
          ${tx.json(toJsonValue(order.customer))},
          ${order.coupon || null},
          ${tx.json(toJsonValue(order.totals))}
        )
        on conflict (id) do update set
          created_at = excluded.created_at,
          status = excluded.status,
          payment_status = excluded.payment_status,
          payment_method = excluded.payment_method,
          payment_provider = excluded.payment_provider,
          payment_reference_id = excluded.payment_reference_id,
          payment_url = excluded.payment_url,
          user_id = excluded.user_id,
          customer = excluded.customer,
          coupon = excluded.coupon,
          totals = excluded.totals
      `

      await tx`delete from order_items where order_id = ${order.id}`

      for (const item of order.items) {
        await tx`
          insert into order_items (
            order_id, product_id, product_name, variant, qty, price
          ) values (
            ${order.id},
            ${item.product_id},
            ${item.product_name},
            ${item.variant},
            ${item.qty},
            ${item.price}
          )
        `
      }
    }

    const ids = orders.map((order) => order.id)
    if (ids.length > 0) {
      await tx`delete from orders where id not in ${tx(ids)}`
    } else {
      await tx`delete from orders`
    }
  })
}

export function createDatabaseDataStore(): DataStore {
  const sql = getDb()

  return {
    async readProducts() {
      const rows = await sql<ProductRow[]>`select * from products order by id asc`
      return rows.map(mapProduct)
    },
    async writeProducts(products) {
      await syncProducts(sql, products)
    },
    async readCoupons() {
      const rows = await sql<CouponRow[]>`select * from coupons order by code asc`
      return rows.map(mapCoupon)
    },
    async writeCoupons(coupons) {
      await syncCoupons(sql, coupons)
    },
    async readOrders() {
      const orders = await sql<OrderRow[]>`select * from orders order by created_at desc`
      const items = await sql<OrderItemRow[]>`
        select order_id, product_id, product_name, variant, qty, price
        from order_items
        order by id asc
      `
      return mapOrders(orders, items)
    },
    async writeOrders(orders) {
      await syncOrders(sql, orders)
    },
    async readUsers() {
      const rows = await sql<UserRow[]>`select * from users order by created_at desc`
      return rows.map(mapUser)
    },
    async writeUsers(users) {
      await syncUsers(sql, users)
    },
    async readSessions() {
      const rows = await sql<SessionRow[]>`select * from sessions order by created_at desc`
      return rows.map(mapSession)
    },
    async writeSessions(sessions) {
      await syncSessions(sql, sessions)
    },
  }
}
