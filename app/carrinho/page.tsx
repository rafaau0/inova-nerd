'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Minus, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/toast-provider'
import { CheckoutModal } from '@/components/checkout-modal'
import { hasResolvedShippingDestination, isCatalaoGoias } from '@/lib/shipping'
import type { AuthUser } from '@/lib/types'

export default function CartPage() {
  const {
    cart,
    coupon,
    totals,
    shippingDestination,
    removeFromCart,
    updateQty,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const { showToast } = useToast()
  const [couponInput, setCouponInput] = useState('')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const result = (await response.json()) as { user: AuthUser | null }
      setCurrentUser(result.user)
    }

    void loadUser()
  }, [])

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      showToast('Digite um codigo de cupom.', 'error')
      return
    }

    setIsApplyingCoupon(true)
    const result = await applyCoupon(couponInput)
    setIsApplyingCoupon(false)

    if (result.ok) {
      showToast(`Cupom aplicado. ${couponInput.toUpperCase()} ativo.`, 'success')
      setCouponInput('')
    } else {
      showToast(result.error || 'Cupom invalido ou expirado.', 'error')
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    showToast('Cupom removido.', 'info')
  }

  const handleRemoveItem = (key: string, name: string) => {
    removeFromCart(key)
    showToast(`${name} removido do carrinho.`, 'info')
  }

  return (
    <main className="pt-[72px]">
      <div className="relative bg-card border-b border-border py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(75,46,131,0.3)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] tracking-wide text-foreground">
            CARRINHO
          </h1>
          <p className="text-muted-foreground mt-2">Revise seus itens antes de finalizar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Seu carrinho esta vazio</h3>
            <p className="text-muted-foreground mb-8">
              Explore nosso catalogo e adicione produtos incriveis.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-all"
            >
              Ver Catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col sm:flex-row gap-4 p-5 bg-card border border-border rounded-2xl"
                >
                  <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {item.emoji}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-purple-light font-semibold uppercase tracking-wider mb-1">
                      {item.anime}
                    </div>
                    <div className="font-bold text-foreground mb-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.size && item.size !== 'N/A'
                        ? `Tamanho: ${item.size}`
                        : 'Boneco colecionavel'}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                    <button
                      onClick={() => handleRemoveItem(item.key, item.name)}
                      className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                      aria-label="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.key, -1)}
                        className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center hover:bg-border transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-foreground">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, 1)}
                        className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center hover:bg-border transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-condensed text-xl font-bold text-orange">
                      R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-[96px]">
              <h2 className="font-display text-xl tracking-wide text-foreground mb-6">RESUMO</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} itens)
                  </span>
                  <span className="text-foreground">
                    R$ {totals.subtotalBruto.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {totals.desconto > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Cupom ({coupon?.code})</span>
                    <span>- R$ {totals.desconto.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span
                    className={totals.frete === 0 ? 'text-green-500 font-semibold' : 'text-foreground'}
                  >
                    {totals.frete === 0
                      ? 'GRATIS'
                      : `R$ ${totals.frete.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                {totals.frete > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {hasResolvedShippingDestination(shippingDestination ?? undefined)
                      ? `Frete calculado para ${shippingDestination?.cidade}/${shippingDestination?.estado}.`
                      : 'Frete estimado. Informe a cidade e o estado no checkout para calcular o valor real.'}
                  </div>
                )}

                {totals.frete === 0 &&
                  hasResolvedShippingDestination(shippingDestination ?? undefined) &&
                  isCatalaoGoias(shippingDestination ?? undefined) && (
                    <div className="text-xs text-green-500">
                      Entrega em Catalao/GO com frete gratis.
                    </div>
                  )}

                {totals.frete > 0 && totals.subtotal < 199 && (
                  <div className="text-xs text-muted-foreground">
                    Falta R$ {(199 - totals.subtotal).toFixed(2).replace('.', ',')} para frete
                    gratis por valor do pedido.
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-t border-border mb-6">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-condensed text-2xl font-bold text-orange">
                  R$ {totals.total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={coupon ? coupon.code : couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={coupon ? `${coupon.code} aplicado` : 'Codigo de cupom'}
                      disabled={!!coupon}
                      className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {coupon ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      Remover
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className="px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-lg hover:border-orange hover:text-orange transition-all disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Validando...' : 'Aplicar'}
                    </button>
                  )}
                </div>
              </div>

              {currentUser ? (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <Lock className="w-5 h-5" />
                  Finalizar Compra
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/cadastro?redirectTo=%2Fcarrinho"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Lock className="w-5 h-5" />
                    Cadastre-se para comprar
                  </Link>
                  <Link
                    href="/entrar?redirectTo=%2Fcarrinho"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-border text-foreground font-bold rounded-xl hover:border-muted-foreground transition-all"
                  >
                    Ja tenho conta
                  </Link>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground mt-4">
                {currentUser
                  ? 'Compra 100% segura - Dados criptografados'
                  : 'Para concluir a compra, entre na sua conta ou crie um cadastro completo.'}
              </p>
            </aside>
          </div>
        )}
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </main>
  )
}
