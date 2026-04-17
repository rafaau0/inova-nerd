'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from './cart-provider'
import { IMAGES } from '@/lib/assets'
import type { AuthUser } from '@/lib/types'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const { cartCount, wishlist } = useCart()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const result = (await response.json()) as { user: AuthUser | null }
      setCurrentUser(result.user)
    }

    void loadUser()
  }, [])

  const accountHref = useMemo(() => {
    if (!currentUser) return '/entrar'
    return currentUser.role === 'admin' ? '/admin' : '/minha-conta'
  }, [currentUser])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/98 shadow-xl' : 'bg-background/85 backdrop-blur-xl'
      } border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
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
              Catalogo
            </Link>
          </li>
          <li>
            <Link
              href="/favoritos"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              <Heart className="w-4 h-4" />
              Favoritos
              <span className="text-xs text-orange">{wishlist.length}</span>
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
          <li>
            <Link
              href={accountHref}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
            >
              <User className="w-4 h-4" />
              {currentUser ? currentUser.nome.split(' ')[0] : 'Entrar'}
            </Link>
          </li>
          {currentUser && (
            <li>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-purple/30 transition-all"
              >
                Sair
              </button>
            </li>
          )}
        </ul>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-2">
            {[
              ['/', 'Home'],
              ['/catalogo', 'Catalogo'],
              ['/favoritos', 'Favoritos'],
              ['/carrinho', `Carrinho (${cartCount})`],
              [accountHref, currentUser ? currentUser.nome.split(' ')[0] : 'Entrar'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-purple/30 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  void logout()
                }}
                className="px-4 py-3 rounded-lg font-semibold text-left text-foreground hover:bg-purple/30 transition-all"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
