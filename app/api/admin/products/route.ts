import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getNextProductId, readProducts, upsertProduct } from '@/lib/server-store'
import type { Product } from '@/lib/types'

export async function GET() {
  await requireAdmin()
  const products = await readProducts()
  return NextResponse.json({ success: true, data: products })
}

export async function POST(request: Request) {
  await requireAdmin()
  const body = (await request.json()) as Omit<Product, 'id'> & { id?: number }
  const id = body.id ?? (await getNextProductId())
  const product: Product = {
    ...body,
    id,
  }
  await upsertProduct(product)
  return NextResponse.json({ success: true, data: product }, { status: 201 })
}
