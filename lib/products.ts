// ═══════════════════════════════════════════════════════════
// INOVANERD — Dados dos Produtos
// TODO (backend): Substituir por fetch da API/banco de dados
// ═══════════════════════════════════════════════════════════

import type { Product } from './types'

// URLs das imagens fornecidas pelo usuário
const IMAGES = {
  samurai: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-01.png-8eYKO9iBXMbvSdpWrrQfkyeQ4cKDe1.jpeg',
  freedomWings: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-02.png-2ixryaRpUqmWRVvz3IQDtDcluc5BYw.jpeg',
  voidMage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-03.png-guaOkmChGobIp0zSzdgdQxfXsucPxc.jpeg',
  riseShadow: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-04.png-Gssw0ce54z4iuhOH7N2yWL0ELCqFUb.jpeg',
  rubberHero: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-05.png-VH0cazD20ptvXDkWTwTg0V30vziLlq.jpeg',
  shadowSoldier: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-06.png-Ge89NgpCgGdYwWcxWHRJWx9iwX3XhY.jpeg',
  nothingHappened: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-07.png-tGytSyi8Cfo5yf5cbF99EVmAxAe5b9.jpeg',
  itachi: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-08.png-qwdUxvRKFwwjEBCVUMPc4pELhKQBiF.jpeg',
  seraphina: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-id-09.png-vGHh4SpEvTWff838wNnDXA4uOpz35K.jpeg',
  heroCarousel1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SaveClip.App_541845344_17924621127101886_4256484301558237946_n-ZFt9AWoMZcJ09YiyMU85EITqVcpv1j.jpg',
  heroCarousel2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SaveClip.App_541692725_17924621136101886_7263608657061485053_n-RSH00MlL6JqWhmLBx8EsSVpparjHi8.jpg',
  logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-1000x1000-6tjLo2yxeQMs5E7GRStyp5JjcH6DXt.png',
  logoSmall: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_32px-wvug0jfzI8uDFYucoNtcO40u4ClFvw.png',
}

export { IMAGES }

export const PRODUCTS: Product[] = [
  // ── CAMISETAS ──────────────────────────────
  {
    id: 1,
    name: 'Camiseta Samurai of Fire',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 89.90,
    oldPrice: 119.90,
    emoji: '🔥',
    badge: 'new',
    rating: 4.9,
    reviews: 201,
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'O guerreiro das chamas em toda a sua gloria! Camiseta preta com estampa epica de samurai envolto em fogo, arte em alta resolucao com cores vibrantes. Material premium anti-pilling, cor nao desbota.',
    tags: ['samurai', 'fogo', 'epico', 'premium'],
    bestseller: true,
    featured: true,
    image: IMAGES.samurai,
  },
  {
    id: 2,
    name: 'Camiseta Freedom Wings',
    anime: 'Estilo Streetwear',
    category: 'camisetas',
    price: 79.90,
    oldPrice: null,
    emoji: '🦅',
    badge: 'new',
    rating: 4.9,
    reviews: 201,
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Espirito indomavel em cada fio! Camiseta oversized preta com estampa militar "Freedom Wings — Unyielding Spirit Est. 2023". Design com escudo e asas em tons verde-oliva. Perfeita para quem nao cede.',
    tags: ['oversized', 'streetwear', 'militar', 'wings'],
    bestseller: true,
    featured: true,
    image: IMAGES.freedomWings,
  },
  {
    id: 3,
    name: 'Camiseta Void Mage',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 94.90,
    oldPrice: 129.90,
    emoji: '💫',
    badge: 'hot',
    rating: 5.0,
    reviews: 487,
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    description: 'O mago do vazio domina as energias do mundo. Estampa neon azul vibrante com personagem vendado conjurando poderes cosmicos. Edicao especial VOID WEAR — producao limitada.',
    tags: ['void', 'mago', 'neon', 'limitada'],
    bestseller: true,
    featured: true,
    image: IMAGES.voidMage,
  },
  {
    id: 4,
    name: 'Camiseta Rise of The Shadow',
    anime: 'Ninja Original',
    category: 'camisetas',
    price: 69.90,
    oldPrice: null,
    emoji: '🥷',
    badge: null,
    rating: 4.7,
    reviews: 598,
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    description: 'A ascensao das sombras comeca aqui! Camiseta preta com arte ninja dinamica em laranja e preto, kanji japones e a frase "Rise of The Shadow". Um must-have para fas de ninja.',
    tags: ['ninja', 'sombra', 'kanji', 'must-have'],
    bestseller: false,
    featured: true,
    image: IMAGES.riseShadow,
  },
  {
    id: 5,
    name: 'Camiseta Rubber Hero — Joyful Boom!',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 99.90,
    oldPrice: 129.90,
    emoji: '💥',
    badge: 'hot',
    rating: 4.9,
    reviews: 441,
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Alegria maxima em cada fibra! Camiseta branca com estampa colorida da super-heroina "Rubber Hero" em plena acao — explosao de cores, sparkles e a grita "Joyful Boom!". Arte vibrante e durabilidade garantida.',
    tags: ['superhero', 'colorida', 'joyful', 'fun'],
    bestseller: true,
    featured: false,
    image: IMAGES.rubberHero,
  },
  {
    id: 6,
    name: 'Camiseta Shadow Soldier',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 84.90,
    oldPrice: null,
    emoji: '🎖️',
    badge: 'new',
    rating: 4.8,
    reviews: 267,
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    description: 'O guerreiro silencioso pronto para a missao. Estampa artistica de soldado anime com manto verde e rifle de precisao. Design serio e detalhado em preto e verde, ideal para fas de estetica militar.',
    tags: ['soldado', 'militar', 'arte', 'dark'],
    bestseller: false,
    featured: true,
    image: IMAGES.shadowSoldier,
  },
  {
    id: 7,
    name: 'Camiseta Nothing Happened',
    anime: 'Anime Original',
    category: 'camisetas',
    price: 89.90,
    oldPrice: 110.00,
    emoji: '🗡️',
    badge: 'sale',
    rating: 4.6,
    reviews: 183,
    sizes: ['M', 'G', 'GG'],
    description: '"Nothing Happened." A iconica frase do ninja das sombras agora em camiseta verde com estampa do guerreiro encapuzado cruzando duas katanas. Corte regular, otima para o dia a dia ou eventos otaku.',
    tags: ['ninja', 'katana', 'iconic', 'verde'],
    bestseller: false,
    featured: false,
    image: IMAGES.nothingHappened,
  },
  {
    id: 8,
    name: 'Camiseta Itachi Uchiha — Akatsuki',
    anime: 'Naruto',
    category: 'camisetas',
    price: 74.90,
    oldPrice: null,
    emoji: '🎴',
    badge: null,
    rating: 4.9,
    reviews: 376,
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Itachi Uchiha — Member of Akatsuki. O Sharingan eterno em sua camiseta. Arte premium do shinobi mais enigmatico do universo Naruto, rodeado por corvos e chamas vermelhas. Edicao permanente do catalogo INOVANERD.',
    tags: ['sharingan', 'akatsuki', 'itachi', 'uchiha'],
    bestseller: false,
    featured: false,
    image: IMAGES.itachi,
  },

  // ── BONECOS ────────────────────────────────
  {
    id: 9,
    name: 'Figure Seraphina Battle Maid — 1/7 Scale',
    anime: 'Original Character',
    category: 'bonecos',
    price: 349.90,
    oldPrice: null,
    emoji: '🌸',
    badge: null,
    rating: 4.9,
    reviews: 143,
    sizes: [],
    description: "Seraphina — Battle Maid. Figure colecionavel em escala 1/7 com detalhes impressionantes: vestido de maid azul e branco, cabelos azuis e sua iconica foice \"Seraphina's Blade\". Base decorada com flores brancas e azuis. Peca premium para exibir na estante.",
    tags: ['figure', 'maid', 'seraphina', 'colecionavel', '1/7'],
    bestseller: false,
    featured: true,
    image: IMAGES.seraphina,
  },
]

// ─── Helpers ─────────────────────────────────
export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured).slice(0, 4)
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter(p => p.bestseller).slice(0, 4)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS
    .filter(p => p.id !== product.id && (p.anime === product.anime || p.category === product.category))
    .slice(0, limit)
}

export function getAllAnimes(): string[] {
  return [...new Set(PRODUCTS.map(p => p.anime))].sort()
}
