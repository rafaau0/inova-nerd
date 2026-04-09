'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './cart-provider'
import { IMAGES } from '@/lib/products'
import { Menu, X, ShoppingCart } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/98 shadow-xl'
          : 'bg-background/85 backdrop-blur-xl'
      } border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={IMAGES.logo}
            alt="INOVANERD"
            width={50}
            height={50}
            className="drop-shadow-[0_0_1px_var(--orange)]"
          />
          <span className="font-display text-2xl tracking-[3px] text-foreground">
            INOVA<span className="text-orange">NERD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/catalogo"
              className="px-4 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              Produtos
            </Link>
          </li>
          <li>
            <Link
              href="/carrinho"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange/10 border border-orange/30 text-orange hover:bg-orange/20 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Carrinho
              <span className="bg-orange text-background rounded-full text-xs font-extrabold px-2 py-0.5 min-w-[20px] text-center">
                {cartCount}
              </span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-purple/30 transition-all"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/catalogo"
              className="px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-purple/30 transition-all"
              onClick={() => setMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              href="/carrinho"
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold bg-orange/10 border border-orange/30 text-orange"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="w-4 h-4" />
              Carrinho
              <span className="bg-orange text-background rounded-full text-xs font-extrabold px-2 py-0.5">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
