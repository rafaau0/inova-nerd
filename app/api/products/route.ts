import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'
import type { CatalogFilters } from '@/lib/types'

// ═══════════════════════════════════════════════════════════
// GET /api/products
// Retorna lista de produtos com filtros opcionais
// 
// TODO (backend): Conectar com banco de dados (Supabase/Neon)
// Exemplo com Supabase:
// const { data, error } = await supabase
//   .from('products')
//   .select('*')
//   .eq('category', category)
//   .lte('price', maxPrice)
//   .order('created_at', { ascending: false })
// ═══════════════════════════════════════════════════════════

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category') || 'todos'
    const animes = searchParams.get('animes')?.split(',').filter(Boolean) || []
    const maxPrice = Number(searchParams.get('maxPrice')) || 500
    const sortBy = searchParams.get('sortBy') || 'default'
    const featured = searchParams.get('featured') === 'true'
    const bestseller = searchParams.get('bestseller') === 'true'

    let result = PRODUCTS.filter(p => {
      if (category !== 'todos' && p.category !== category) return false
      if (animes.length > 0 && !animes.includes(p.anime)) return false
      if (p.price > maxPrice) return false
      if (featured && !p.featured) return false
      if (bestseller && !p.bestseller) return false
      return true
    })

    // Ordenacao
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
      { success: false, error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
