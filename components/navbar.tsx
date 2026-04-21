'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from './cart-provider'
import { useAuth } from './auth-provider'
import { IMAGES } from '@/lib/assets'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user: currentUser, setUser } = useAuth()
  const { cartCount, wishlist, clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const accountHref = useMemo(() => {
    if (!currentUser) return '/entrar'
    return currentUser.role === 'admin' ? '/admin' : '/minha-conta'
  }, [currentUser])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      clearCart()
      setUser(null)
      setMenuOpen(false)
      router.push('/')
      router.refresh()
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/98 shadow-xl' : 'bg-background/85 backdrop-blur-xl'
      } border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Image
            src={IMAGES.logo}
            alt="INOVANERD"
            width={40}
            height={40}
            className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_1px_var(--orange)]"
          />
          <span className="font-display text-base sm:text-lg lg:text-2xl tracking-[1px] sm:tracking-[2px] lg:tracking-[3px] text-foreground">
            INOVA<span className="text-orange">NERD</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          <li>
            <Link
              href="/"
              className="px-2.5 sm:px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/catalogo"
              className="px-2.5 sm:px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              Catalogo
            </Link>
          </li>
          <li>
            <Link
              href="/favoritos"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Favoritos
              <span className="text-xs text-orange">{wishlist.length}</span>
            </Link>
          </li>
          <li>
            <Link
              href="/carrinho"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base bg-orange/10 border border-orange/30 text-orange hover:bg-orange/20 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Carrinho
              <span className="bg-orange text-background rounded-full text-xs font-extrabold px-1.5 sm:px-2 py-0.5 min-w-[20px] text-center">
                {cartCount}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={accountHref}
              className="flex max-w-[140px] sm:max-w-[160px] lg:max-w-[190px] items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3 lg:px-4 py-2 font-semibold text-sm lg:text-base text-muted-foreground transition-all hover:bg-purple/30 hover:text-foreground"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">
                {currentUser ? currentUser.nome.split(' ')[0] : 'Entrar'}
              </span>
            </Link>
          </li>
          {currentUser && (
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-red-500/30 px-2.5 sm:px-3 lg:px-4 py-2 font-semibold text-sm lg:text-base text-red-300 transition-all hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sair
              </button>
            </li>
          )}
        </ul>

        <button className="p-1.5 sm:p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-card shadow-2xl lg:hidden">
          <div className="flex flex-col gap-1 px-3 sm:px-4 py-3 sm:py-4">
            {[
              ['/', 'Home'],
              ['/catalogo', 'Catalogo'],
              ['/favoritos', 'Favoritos'],
              ['/carrinho', `Carrinho (${cartCount})`],
              [accountHref, currentUser ? 'Minha conta' : 'Entrar'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-sm sm:text-base text-foreground transition-all hover:bg-purple/30"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  void logout()
                }}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 sm:px-4 py-2.5 sm:py-3 text-left font-semibold text-sm sm:text-base text-red-300 transition-all hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
