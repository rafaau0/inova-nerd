import { NextResponse } from 'next/server'
import { getProductById, getRelatedProducts } from '@/lib/products'

// ═══════════════════════════════════════════════════════════
// GET /api/products/[id]
// Retorna um produto especifico por ID com produtos relacionados
// 
// TODO (backend): Conectar com banco de dados
// const { data, error } = await supabase
//   .from('products')
//   .select('*')
//   .eq('id', id)
//   .single()
// ═══════════════════════════════════════════════════════════

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = getProductById(Number(id))

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produto nao encontrado' },
        { status: 404 }
      )
    }

    const related = getRelatedProducts(product)

    return NextResponse.json({
      success: true,
      data: {
        product,
        related,
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar produto' },
      { status: 500 }
    )
  }
}
