'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IMAGES } from '@/lib/products'

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

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % carouselData.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + carouselData.length) % carouselData.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500)
    return () => clearInterval(timer)
  }, [nextSlide])

  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${2 + Math.random() * 3}px`,
      height: `${2 + Math.random() * 3}px`,
      background: Math.random() > 0.5 ? '#F59E0B' : '#6B42B8',
      animationDuration: `${4 + Math.random() * 6}s`,
      animationDelay: `${Math.random() * 8}s`,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[120px] pb-20 px-6 bg-background">
      {/* Grid Background */}
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

      {/* Radial Glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(75,46,131,0.4)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* Particles */}
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

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Content */}
        <div className="flex-1 max-w-xl animate-hero-in">
          <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/50 text-orange px-5 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6">
            Nova Colecao 2025
          </div>

          <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] tracking-[2px] text-foreground mb-6">
            SEU UNIVERSO
            <br />
            <span className="text-transparent stroke-orange stroke-3 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]" style={{ WebkitTextStroke: '3px #F59E0B' }}>
              ANIME
            </span>
            <br />
            COMECA AQUI
          </h1>

          <p className="text-muted-foreground text-lg mb-9 leading-relaxed">
            Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos.
            <br />
            Arte que voce pode usar — e exibir.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,158,11,0.55)] transition-all"
            >
              Ver Colecao
            </Link>
            <a
              href="#bestsellers"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-transparent border-2 border-white/30 text-foreground hover:border-orange hover:text-orange hover:-translate-y-0.5 transition-all"
            >
              Mais Vendidos
            </a>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex-1 max-w-md h-[520px] animate-float-slow">
          {/* Glow */}
          <div className="absolute inset-4 rounded-3xl bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_55%)] blur-lg opacity-85 pointer-events-none" />

          {/* Orbs */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-purple/50 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-orange/25 blur-[60px] bottom-[60px] right-[40px]" />

          {/* Frame */}
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
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/8 to-background/90" />

                  {/* Caption */}
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

          {/* Nav Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-background/70 text-foreground flex items-center justify-center backdrop-blur-sm hover:border-orange hover:text-orange hover:scale-105 transition-all z-20"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/15 bg-background/70 text-foreground flex items-center justify-center backdrop-blur-sm hover:border-orange hover:text-orange hover:scale-105 transition-all z-20"
            aria-label="Proximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2.5 z-20">
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
