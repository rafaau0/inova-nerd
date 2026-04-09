import Link from 'next/link'
import { HeroSection } from '@/components/hero-section'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts, getBestsellers } from '@/lib/products'
import { Shirt, Trophy, Star, Truck, Shield, RefreshCw } from 'lucide-react'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const bestsellers = getBestsellers()

  return (
    <main>
      {/* Hero */}
      <HeroSection />

      {/* Categories Strip */}
      <section className="bg-card border-y border-border py-7">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/catalogo?categoria=camisetas"
              className="group flex items-center gap-4 px-6 py-5 bg-muted border border-border rounded-xl transition-all hover:border-orange hover:-translate-y-0.5"
            >
              <Shirt className="w-8 h-8 text-orange" />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Camisetas</h3>
                <p className="text-sm text-muted-foreground">Exclusivas & Originais</p>
              </div>
              <span className="text-muted-foreground group-hover:text-orange group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>

            <Link
              href="/catalogo?categoria=bonecos"
              className="group flex items-center gap-4 px-6 py-5 bg-muted border border-border rounded-xl transition-all hover:border-orange hover:-translate-y-0.5"
            >
              <Trophy className="w-8 h-8 text-orange" />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Bonecos Colecionaveis</h3>
                <p className="text-sm text-muted-foreground">Edicoes Limitadas</p>
              </div>
              <span className="text-muted-foreground group-hover:text-orange group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>

            <Link
              href="/catalogo"
              className="group flex items-center gap-4 px-6 py-5 bg-muted border border-border rounded-xl transition-all hover:border-orange hover:-translate-y-0.5"
            >
              <Star className="w-8 h-8 text-orange" />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Ver Tudo</h3>
                <p className="text-sm text-muted-foreground">Catalogo completo</p>
              </div>
              <span className="text-muted-foreground group-hover:text-orange group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange/15 border border-orange/40 text-orange px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              Em destaque
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-wide text-foreground mb-3">
              NOVIDADES DA SEMANA
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Os lancamentos que estao bombando no universo otaku
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section id="bestsellers" className="py-20 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange/15 border border-orange/40 text-orange px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              Hot
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-wide text-foreground mb-3">
              MAIS VENDIDOS
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Os favoritos da nossa comunidade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.1} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,158,11,0.55)] transition-all"
            >
              Ver Catalogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="relative py-16 px-6 bg-purple-dark overflow-hidden">
        {/* BG Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(245,158,11,0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(75,46,131,0.5)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-white tracking-wide mb-2">
              FRETE GRATIS <span className="text-orange">ACIMA DE R$ 199</span>
            </h2>
            <p className="text-white/70">
              Entregamos para todo o Brasil. Embalagem especial para colecionaveis.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-xl text-white font-bold text-sm">
              <Truck className="w-5 h-5" />
              Frete Gratis
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-xl text-white font-bold text-sm">
              <Shield className="w-5 h-5" />
              Compra Segura
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-xl text-white font-bold text-sm">
              <RefreshCw className="w-5 h-5" />
              Troca Facil
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
