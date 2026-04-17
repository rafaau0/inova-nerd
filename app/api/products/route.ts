import { NextResponse } from 'next/server'
import { readProducts } from '@/lib/server-store'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category') || 'todos'
    const animes = searchParams.get('animes')?.split(',').filter(Boolean) || []
    const maxPrice = Number(searchParams.get('maxPrice')) || 500
    const sortBy = searchParams.get('sortBy') || 'default'
    const featured = searchParams.get('featured') === 'true'
    const bestseller = searchParams.get('bestseller') === 'true'
    const inStockOnly = searchParams.get('inStockOnly') !== 'false'

    let result = await readProducts()

    result = result.filter((product) => {
      if (category !== 'todos' && product.category !== category) return false
      if (animes.length > 0 && !animes.includes(product.anime)) return false
      if (product.price > maxPrice) return false
      if (featured && !product.featured) return false
      if (bestseller && !product.bestseller) return false
      if (inStockOnly && product.stock <= 0) return false
      return true
    })

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar produtos.' },
      { status: 500 }
    )
  }
}
