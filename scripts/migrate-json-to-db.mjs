import { promises as fs } from 'node:fs'
import path from 'node:path'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL nao configurada.')
}

const dataDir = process.env.INOVANERD_DATA_DIR || path.join(process.cwd(), 'data')
const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
})

function toJsonValue(value) {
  return JSON.parse(JSON.stringify(value))
}

async function readJson(name, fallback) {
  try {
    const raw = await fs.readFile(path.join(dataDir, name), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const products = await readJson('products.json', [])
const coupons = await readJson('coupons.json', [])
const users = await readJson('users.json', [])
const orders = await readJson('orders.json', [])
const sessions = await readJson('sessions.json', [])

await sql.begin(async (tx) => {
  await tx`delete from order_items`
  await tx`delete from orders`
  await tx`delete from sessions`
  await tx`delete from users`
  await tx`delete from coupons`
  await tx`delete from products`

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
    `
  }

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
    `
  }

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
    `
  }

  for (const session of sessions) {
    await tx`
      insert into sessions (token, user_id, created_at, expires_at)
      values (${session.token}, ${session.userId}, ${session.createdAt}, ${session.expiresAt})
    `
  }

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
    `

    for (const item of order.items) {
      await tx`
        insert into order_items (order_id, product_id, product_name, variant, qty, price)
        values (
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
})

await sql.end()
console.log('Migracao JSON -> banco concluida com sucesso.')
