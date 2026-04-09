'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { PRODUCTS, getAllAnimes } from '@/lib/products'
import type { CatalogFilters } from '@/lib/types'
import { Search } from 'lucide-react'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('categoria')

  const [filters, setFilters] = useState<CatalogFilters>({
    category: 'todos',
    animes: [],
    maxPrice: 500,
    sortBy: 'default',
  })

  // Set category from URL param
  useEffect(() => {
    if (categoryParam === 'camisetas' || categoryParam === 'bonecos') {
      setFilters(prev => ({ ...prev, category: categoryParam }))
    }
  }, [categoryParam])

  const animes = getAllAnimes()

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      if (filters.category !== 'todos' && p.category !== filters.category) return false
      if (filters.animes.length > 0 && !filters.animes.includes(p.anime)) return false
      if (p.price > filters.maxPrice) return false
      return true
    })

    // Sort
    if (filters.sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [filters])

  const toggleAnime = (anime: string) => {
    setFilters(prev => ({
      ...prev,
      animes: prev.animes.includes(anime)
        ? prev.animes.filter(a => a !== anime)
        : [...prev.animes, anime],
    }))
  }

  const resetFilters = () => {
    setFilters({
      category: 'todos',
      animes: [],
      maxPrice: 500,
      sortBy: 'default',
    })
  }

  return (
    <main className="pt-[72px]">
      {/* Page Header */}
      <div className="relative bg-card border-b border-border py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(75,46,131,0.3)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wide text-foreground">
            CATALOGO
          </h1>
          <p className="text-muted-foreground mt-2">Explore nossa colecao completa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-9">
        {/* Sidebar Filters */}
        <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-[96px]">
          {/* Category */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Categoria
            </h3>
            <div className="flex flex-col gap-2.5">
              {['todos', 'camisetas', 'bonecos'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer text-foreground hover:text-orange transition-colors">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilters(prev => ({ ...prev, category: cat as typeof prev.category }))}
                    className="w-4 h-4 accent-orange cursor-pointer"
                  />
                  <span className="capitalize">{cat === 'todos' ? 'Todos' : cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Anime */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Anime
            </h3>
            <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto">
              {animes.map(anime => (
                <label key={anime} className="flex items-center gap-3 cursor-pointer text-foreground hover:text-orange transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.animes.includes(anime)}
                    onChange={() => toggleAnime(anime)}
                    className="w-4 h-4 accent-orange cursor-pointer"
                  />
                  <span className="text-sm">{anime}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Preco
            </h3>
            <input
              type="range"
              min="0"
              max="500"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-orange cursor-pointer"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>R$ 0</span>
              <span className="text-orange font-semibold">R$ {filters.maxPrice}</span>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:border-orange hover:text-orange transition-all"
          >
            Limpar Filtros
          </button>
        </aside>

        {/* Products Grid */}
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-muted-foreground">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as typeof prev.sortBy }))}
              className="bg-card border border-border rounded-lg px-4 py-2 text-foreground cursor-pointer focus:border-orange focus:outline-none"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor preco</option>
              <option value="price-desc">Maior preco</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 0.05} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-6">Tente ajustar os filtros</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl"
              >
                Ver Todos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
