import { NextResponse } from 'next/server'
import { readProducts } from '@/lib/server-store'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const products = await readProducts()
    const product = products.find((item) => item.id === Number(id))

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produto nao encontrado.' },
        { status: 404 }
      )
    }

    const related = products
      .filter(
        (item) =>
          item.id !== product.id &&
          item.stock > 0 &&
          (item.anime === product.anime || item.category === product.category)
      )
      .slice(0, 4)

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
      { success: false, error: 'Erro ao buscar produto.' },
      { status: 500 }
    )
  }
}
