import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { deleteProduct, upsertProduct } from '@/lib/server-store'
import type { Product } from '@/lib/types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params
  const body = (await request.json()) as Omit<Product, 'id'>
  const product: Product = {
    ...body,
    id: Number(id),
  }
  await upsertProduct(product)
  return NextResponse.json({ success: true, data: product })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params
  await deleteProduct(Number(id))
  return NextResponse.json({ success: true })
}
