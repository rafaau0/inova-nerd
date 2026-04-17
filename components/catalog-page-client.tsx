'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { CatalogFilters, Product } from '@/lib/types'

interface CatalogPageClientProps {
  products: Product[]
  initialCategory?: string
}

export function CatalogPageClient({
  products,
  initialCategory,
}: CatalogPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CatalogFilters>({
    category:
      initialCategory === 'camisetas' || initialCategory === 'bonecos'
        ? initialCategory
        : 'todos',
    animes: [],
    maxPrice: 500,
    sortBy: 'default',
  })

  const animes = useMemo(
    () =>
      [...new Set(products.filter((product) => product.stock > 0).map((product) => product.anime))].sort(),
    [products]
  )

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (product.stock <= 0) return false
      if (filters.category !== 'todos' && product.category !== filters.category) return false
      if (filters.animes.length > 0 && !filters.animes.includes(product.anime)) return false
      if (product.price > filters.maxPrice) return false
      if (
        searchTerm &&
        !`${product.name} ${product.anime} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return true
    })

    if (filters.sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [filters, products, searchTerm])

  const toggleAnime = (anime: string) => {
    setFilters((prev) => ({
      ...prev,
      animes: prev.animes.includes(anime)
        ? prev.animes.filter((item) => item !== anime)
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
        <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-[96px]">
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Categoria
            </h3>
            <div className="flex flex-col gap-2.5">
              {['todos', 'camisetas', 'bonecos'].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer text-foreground hover:text-orange transition-colors"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: cat as typeof prev.category,
                      }))
                    }
                    className="w-4 h-4 accent-orange cursor-pointer"
                  />
                  <span className="capitalize">{cat === 'todos' ? 'Todos' : cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Anime
            </h3>
            <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto">
              {animes.map((anime) => (
                <label
                  key={anime}
                  className="flex items-center gap-3 cursor-pointer text-foreground hover:text-orange transition-colors"
                >
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

          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b border-border">
              Preco
            </h3>
            <input
              type="range"
              min="0"
              max="500"
              value={filters.maxPrice}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) }))
              }
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
            Limpar filtros
          </button>
        </aside>

        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <span className="text-muted-foreground">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}{' '}
              encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome, anime ou tag"
                className="bg-card border border-border rounded-lg px-4 py-2 text-foreground min-w-[260px]"
              />
              <select
                value={filters.sortBy}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: event.target.value as typeof prev.sortBy,
                  }))
                }
                className="bg-card border border-border rounded-lg px-4 py-2 text-foreground cursor-pointer focus:border-orange focus:outline-none"
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Menor preco</option>
                <option value="price-desc">Maior preco</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 0.05} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-6">Tente ajustar os filtros.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
