import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { isProductionJsonDataStore } from '@/lib/data'
import { getNextProductId, readProducts, upsertProduct } from '@/lib/server-store'
import type { Product } from '@/lib/types'

export async function GET() {
  await requireAdmin()
  const products = await readProducts()
  return NextResponse.json({ success: true, data: products })
}

export async function POST(request: Request) {
  await requireAdmin()
  try {
    const body = (await request.json()) as Omit<Product, 'id'> & { id?: number }
    const id = body.id ?? (await getNextProductId())
    const product: Product = {
      ...body,
      id,
    }
    await upsertProduct(product)
    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    const message = isProductionJsonDataStore()
      ? 'Criacao de produto indisponivel nesta configuracao online. Ative um banco de dados para persistencia em producao.'
      : 'Nao foi possivel criar o produto.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
