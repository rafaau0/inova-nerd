import productsData from '@/data/products.json'
import type { Product } from './types'

export const PRODUCTS: Product[] = productsData as Product[]

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured && product.stock > 0).slice(0, 4)
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((product) => product.bestseller && product.stock > 0).slice(0, 4)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.stock > 0 &&
      (candidate.anime === product.anime || candidate.category === product.category)
  ).slice(0, limit)
}

export function getAllAnimes(): string[] {
  return [...new Set(PRODUCTS.filter((product) => product.stock > 0).map((product) => product.anime))].sort()
}
