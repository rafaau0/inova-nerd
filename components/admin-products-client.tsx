'use client'

import { useState } from 'react'
import type { Product } from '@/lib/types'

interface AdminProductsClientProps {
  initialProducts: Product[]
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  anime: '',
  category: 'camisetas',
  price: 0,
  oldPrice: null,
  emoji: '🔥',
  badge: 'new',
  rating: 5,
  reviews: 0,
  sizes: ['P', 'M', 'G', 'GG'],
  description: '',
  tags: [],
  bestseller: false,
  featured: false,
  image: null,
  stock: 1,
}

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [form, setForm] = useState<Omit<Product, 'id'> & { id?: number }>({
    ...emptyProduct,
  })
  const [message, setMessage] = useState('')

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    const payload = {
      ...form,
      tags: Array.isArray(form.tags)
        ? form.tags
        : String(form.tags)
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
      sizes: Array.isArray(form.sizes)
        ? form.sizes
        : String(form.sizes)
            .split(',')
            .map((size) => size.trim())
            .filter(Boolean),
    }

    const isEditing = Boolean(form.id)
    const response = await fetch(
      isEditing ? `/api/admin/products/${form.id}` : '/api/admin/products',
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    const result = (await response.json()) as { success: boolean; data: Product }
    if (result.success) {
      const nextProducts = isEditing
        ? products.map((product) => (product.id === result.data.id ? result.data : product))
        : [...products, result.data].sort((a, b) => a.id - b.id)
      setProducts(nextProducts)
      setForm({ ...emptyProduct })
      setMessage('Produto salvo com sucesso.')
    }
  }

  const editProduct = (product: Product) => {
    setForm(product)
    setMessage('')
  }

  const removeProduct = async (id: number) => {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((product) => product.id !== id))
    setMessage('Produto removido.')
  }

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-8">
      <form onSubmit={saveProduct} className="bg-card border border-border rounded-3xl p-6 space-y-4 h-fit">
        <h2 className="font-display text-2xl text-foreground">
          {form.id ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}
        </h2>

        {[
          ['name', 'Nome'],
          ['anime', 'Anime'],
          ['price', 'Preco'],
          ['oldPrice', 'Preco antigo'],
          ['emoji', 'Emoji'],
          ['rating', 'Nota'],
          ['reviews', 'Avaliacoes'],
          ['stock', 'Estoque'],
          ['image', 'Imagem (URL)'],
        ].map(([key, label]) => (
          <label className="block" key={key}>
            <span className="text-sm font-medium text-foreground">{label}</span>
            <input
              value={String((form as Record<string, unknown>)[key] ?? '')}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  [key]:
                    ['price', 'oldPrice', 'rating', 'reviews', 'stock'].includes(key)
                      ? event.target.value === ''
                        ? null
                        : Number(event.target.value)
                      : event.target.value,
                }))
              }
              className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
            />
          </label>
        ))}

        <label className="block">
          <span className="text-sm font-medium text-foreground">Categoria</span>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as Product['category'],
              }))
            }
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          >
            <option value="camisetas">Camisetas</option>
            <option value="bonecos">Bonecos</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Descricao</span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl min-h-28"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Tags (separadas por virgula)</span>
          <input
            value={Array.isArray(form.tags) ? form.tags.join(', ') : String(form.tags)}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, tags: event.target.value.split(',') as never }))
            }
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">
            Tamanhos (separados por virgula)
          </span>
          <input
            value={Array.isArray(form.sizes) ? form.sizes.join(', ') : String(form.sizes)}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, sizes: event.target.value.split(',') as never }))
            }
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['featured', 'Destaque'],
            ['bestseller', 'Mais vendido'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                checked={Boolean((form as Record<string, unknown>)[key])}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, [key]: event.target.checked }))
                }
              />
              {label}
            </label>
          ))}
        </div>

        {message && <p className="text-sm text-orange">{message}</p>}

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background">
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...emptyProduct })}
            className="px-4 py-3 rounded-xl font-bold border border-border text-foreground"
          >
            Limpar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {products.map((product) => (
          <article key={product.id} className="bg-card border border-border rounded-3xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  #{product.id} {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.category} • estoque {product.stock} • R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => editProduct(product)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground"
                >
                  Editar
                </button>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400"
                >
                  Excluir
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
