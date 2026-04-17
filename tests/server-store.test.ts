import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

async function seedTempData(tempDir: string) {
  await writeFile(
    path.join(tempDir, 'products.json'),
    JSON.stringify([
      {
        id: 1,
        name: 'Produto',
        anime: 'Anime',
        category: 'camisetas',
        price: 100,
        oldPrice: null,
        emoji: '🔥',
        badge: null,
        rating: 5,
        reviews: 1,
        sizes: ['M'],
        description: 'Teste',
        tags: ['tag'],
        bestseller: false,
        featured: false,
        image: null,
        stock: 5,
      },
    ]),
    'utf-8'
  )
  await writeFile(
    path.join(tempDir, 'coupons.json'),
    JSON.stringify([{ code: 'TESTE10', pct: 10, minValue: null, active: true, maxUses: null, uses: 0 }]),
    'utf-8'
  )
  await writeFile(path.join(tempDir, 'orders.json'), '[]', 'utf-8')
  await writeFile(path.join(tempDir, 'users.json'), '[]', 'utf-8')
  await writeFile(path.join(tempDir, 'sessions.json'), '[]', 'utf-8')
}

describe('server-store', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('creates an order and decreases stock', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'inovanerd-'))
    process.env.INOVANERD_DATA_DIR = tempDir
    await seedTempData(tempDir)

    const { createOrder, readProducts, readOrders } = await import('@/lib/server-store')
    const result = await createOrder({
      items: [{ product_id: 1, variant: 'M', qty: 2, price: 100 }],
      coupon: 'TESTE10',
      totals: { subtotalBruto: 0, desconto: 0, subtotal: 0, frete: 0, total: 0 },
      customer: {
        nome: 'Cliente',
        email: 'cliente@teste.com',
        cpf: '00000000000',
        telefone: '62999999999',
        cep: '74000000',
        endereco: 'Rua Teste',
        numero: '10',
        cidade: 'Goiania',
        estado: 'GO',
      },
      paymentMethod: 'pix',
      userId: 'usr_1',
    })

    expect(result.ok).toBe(true)

    const products = await readProducts()
    expect(products[0]?.stock).toBe(3)

    const orders = await readOrders()
    expect(orders).toHaveLength(1)
    expect(orders[0]?.coupon).toBe('TESTE10')
  })
})
