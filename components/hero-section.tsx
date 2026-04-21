'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IMAGES } from '@/lib/assets'

const carouselData = [
  {
    image: IMAGES.heroCarousel1,
    title: 'Drop Exclusivo',
    description: 'Arte premium pronta para colecao',
  },
  {
    image: IMAGES.heroCarousel2,
    title: 'Nova Peca',
    description: 'Visual intenso com estetica otaku',
  },
]

interface Particle {
  id: number
  left: string
  width: string
  height: string
  background: string
  animationDuration: string
  animationDelay: string
}

const particles: Particle[] = [
  [6, 2.7, 3.1, '#F59E0B', 6.4, 0.2],
  [13, 4.1, 2.8, '#6B42B8', 8.7, 1.5],
  [19, 3.4, 4.6, '#F59E0B', 5.2, 3.1],
  [24, 2.2, 2.9, '#6B42B8', 9.1, 4.8],
  [31, 4.7, 3.3, '#F59E0B', 7.6, 2.4],
  [38, 3.1, 2.4, '#6B42B8', 4.8, 6.3],
  [43, 2.8, 4.2, '#F59E0B', 9.7, 1.1],
  [49, 4.3, 3.8, '#6B42B8', 6.9, 5.6],
  [56, 3.6, 2.6, '#F59E0B', 8.2, 3.7],
  [62, 2.5, 4.8, '#6B42B8', 5.8, 7.2],
  [69, 4.6, 3.0, '#F59E0B', 7.1, 0.7],
  [74, 3.2, 2.2, '#6B42B8', 9.4, 4.1],
  [81, 2.9, 4.4, '#F59E0B', 6.1, 2.9],
  [87, 4.0, 3.5, '#6B42B8', 8.9, 6.7],
  [94, 3.7, 2.7, '#F59E0B', 5.5, 1.9],
  [3, 2.4, 4.1, '#6B42B8', 7.8, 5.1],
  [16, 4.4, 2.5, '#F59E0B', 6.6, 3.4],
  [28, 3.0, 4.7, '#6B42B8', 9.9, 0.9],
  [35, 2.6, 3.6, '#F59E0B', 4.6, 6.0],
  [52, 4.8, 2.3, '#6B42B8', 8.4, 2.2],
  [58, 3.3, 4.0, '#F59E0B', 7.3, 4.5],
  [66, 2.1, 3.2, '#6B42B8', 5.1, 7.6],
  [72, 4.2, 4.9, '#F59E0B', 9.3, 1.3],
  [79, 3.5, 2.1, '#6B42B8', 6.8, 5.8],
  [85, 2.8, 3.9, '#F59E0B', 8.0, 3.0],
  [91, 4.5, 2.6, '#6B42B8', 5.9, 6.9],
  [10, 3.8, 4.3, '#F59E0B', 7.5, 0.4],
  [22, 2.3, 3.4, '#6B42B8', 9.6, 4.9],
  [46, 4.9, 2.8, '#F59E0B', 6.3, 2.7],
  [97, 3.1, 4.5, '#6B42B8', 8.6, 7.4],
].map(([left, width, height, background, duration, delay], id) => ({
  id,
  left: `${left}%`,
  width: `${width}px`,
  height: `${height}px`,
  background: String(background),
  animationDuration: `${duration}s`,
  animationDelay: `${delay}s`,
}))

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500)
    return () => clearInterval(timer)
  }, [nextSlide])
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20 lg:pt-[120px] pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-6 bg-background">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(75, 46, 131, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75, 46, 131, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridShift 20s linear infinite',
        }}
      />

      <div className="hidden lg:block absolute top-[-200px] left-[-200px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(75,46,131,0.4)_0%,transparent_70%)] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-0 animate-float"
            style={{
              left: particle.left,
              width: particle.width,
              height: particle.height,
              background: particle.background,
              animationDuration: particle.animationDuration,
              animationDelay: particle.animationDelay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
        <div className="flex-1 max-w-xl animate-hero-in">
          <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/50 text-orange px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide mb-4 md:mb-6">
            Nova Colecao 2026
          </div>

          <h1 className="font-display text-[clamp(2rem,6vw,5.5rem)] sm:text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.0] tracking-[1px] sm:tracking-[2px] text-foreground mb-4 md:mb-6">
            SEU UNIVERSO
            <br />
            <span
              className="text-transparent stroke-orange stroke-3 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]"
              style={{ WebkitTextStroke: '3px #F59E0B' }}
            >
              ANIME
            </span>
            <br />
            COMECA AQUI
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 md:mb-9 leading-relaxed">
            Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos.
            <br />
            Arte que voce pode usar e exibir.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold bg-gradient-to-br from-orange to-orange-dark text-background shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,158,11,0.55)] transition-all"
            >
              Ver Colecao
            </Link>
            <a
              href="#bestsellers"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold bg-transparent border-2 border-white/30 text-foreground hover:border-orange hover:text-orange hover:-translate-y-0.5 transition-all"
            >
              Mais Vendidos
            </a>
          </div>
        </div>

        <div className="relative flex-1 w-full max-w-sm md:max-w-md h-[280px] sm:h-[380px] md:h-[450px] lg:h-[520px] animate-float-slow">
          <div className="absolute inset-4 rounded-3xl bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_55%)] blur-lg opacity-85 pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-purple/50 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-orange/25 blur-[60px] bottom-[60px] right-[40px]" />

          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border bg-gradient-to-b from-card/95 to-background/95 shadow-xl backdrop-blur-lg">
            <div
              className="flex w-full h-full transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselData.map((slide, index) => (
                <div key={index} className="relative min-w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover scale-[1.02]"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/8 to-background/90" />

                  <div className="absolute left-4 right-4 bottom-4 flex flex-col gap-1 p-4 border border-white/15 rounded-2xl bg-background/55 backdrop-blur-lg z-10">
                    <span className="text-xs uppercase tracking-wider text-orange font-bold">
                      {slide.title}
                    </span>
                    <strong className="text-foreground text-base">{slide.description}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-white/15 bg-background/70 text-foreground flex items-center justify-center backdrop-blur-sm hover:border-orange hover:text-orange hover:scale-105 transition-all z-20"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-white/15 bg-background/70 text-foreground flex items-center justify-center backdrop-blur-sm hover:border-orange hover:text-orange hover:scale-105 transition-all z-20"
            aria-label="Proximo"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          <div className="absolute left-1/2 bottom-2 sm:bottom-4 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 z-20">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === index
                    ? 'w-7 bg-orange shadow-[0_0_0_4px_rgba(245,158,11,0.18)]'
                    : 'w-2.5 bg-white/35'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
