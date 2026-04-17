import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { isProductionJsonDataStore } from '@/lib/data'
import { deleteProduct, upsertProduct } from '@/lib/server-store'
import type { Product } from '@/lib/types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  try {
    const { id } = await params
    const body = (await request.json()) as Omit<Product, 'id'>
    const product: Product = {
      ...body,
      id: Number(id),
    }
    await upsertProduct(product)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error updating product:', error)
    const message = isProductionJsonDataStore()
      ? 'Edicao de produto indisponivel nesta configuracao online. Ative um banco de dados para persistencia em producao.'
      : 'Nao foi possivel atualizar o produto.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  try {
    const { id } = await params
    await deleteProduct(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    const message = isProductionJsonDataStore()
      ? 'Exclusao de produto indisponivel nesta configuracao online. Ative um banco de dados para persistencia em producao.'
      : 'Nao foi possivel excluir o produto.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
