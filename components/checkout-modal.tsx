'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { CreditCard, FileText, QrCode, X } from 'lucide-react'
import { useCart } from './cart-provider'
import { useToast } from './toast-provider'
import { useAuth } from './auth-provider'
import { hasResolvedShippingDestination, isCatalaoGoias } from '@/lib/shipping'
import type {
  CartTotals,
  CustomerInfo,
  PaymentMethod,
  ShippingQuote,
} from '@/lib/types'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CepLookupResponse {
  success: boolean
  error?: string
  data?: {
    cep: string
    endereco: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
}

interface ShippingQuoteResponse {
  success: boolean
  error?: string
  data?: {
    shipping: ShippingQuote
    totals: CartTotals
  }
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isValidCPF = (value: string) =>
  /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) ||
  /^\d{11}$/.test(value.replace(/\D/g, ''))
const isValidCEP = (value: string) => /^\d{5}-?\d{3}$/.test(value)
const isValidPhone = (value: string) => value.replace(/\D/g, '').length >= 10

function maskCPF(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 9) digits = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  else if (digits.length > 6) digits = digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  else if (digits.length > 3) digits = digits.replace(/(\d{3})(\d+)/, '$1.$2')
  return digits
}

function maskPhone(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 10) digits = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  else if (digits.length > 6) digits = digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  else if (digits.length > 2) digits = digits.replace(/(\d{2})(\d+)/, '($1) $2')
  return digits
}

function maskCEP(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) digits = digits.replace(/(\d{5})(\d+)/, '$1-$2')
  return digits
}

const paymentOptions: Array<{
  icon: typeof CreditCard
  label: string
  value: PaymentMethod
}> = [
  { icon: CreditCard, label: 'Cartao de credito', value: 'credit_card' },
  { icon: QrCode, label: 'Pix', value: 'pix' },
  { icon: FileText, label: 'Boleto', value: 'boleto' },
  { icon: CreditCard, label: 'Debito', value: 'debit' },
]

const CHECKOUT_REQUEST_TIMEOUT_MS = 20000

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, coupon, totals, clearCart, setShippingDestination } = useCart()
  const { user: currentUser } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)
  const [shippingTotals, setShippingTotals] = useState<CartTotals | null>(null)
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const [customer, setCustomer] = useState<CustomerInfo>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  useEffect(() => {
    if (!isOpen || !currentUser) return

    const timeout = window.setTimeout(() => {
      setCustomer((prev) => ({
        ...prev,
        nome: prev.nome || currentUser.nome || '',
        email: prev.email || currentUser.email || '',
        cpf: prev.cpf || currentUser.cpf || '',
        telefone: prev.telefone || currentUser.telefone || '',
        cep: prev.cep || currentUser.cep || '',
        endereco: prev.endereco || currentUser.endereco || '',
        numero: prev.numero || currentUser.numero || '',
        complemento: prev.complemento || currentUser.complemento || '',
        bairro: prev.bairro || currentUser.bairro || '',
        cidade: prev.cidade || currentUser.cidade || '',
        estado: prev.estado || currentUser.estado || '',
      }))
    }, 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isOpen, currentUser])

  const resetState = () => {
    setStep(1)
    setPaymentMethod('credit_card')
    setIsProcessing(false)
    setIsLoadingCep(false)
    setCepError(null)
    setIsLoadingShipping(false)
    setShippingTotals(null)
    setShippingQuote(null)
    setShippingDestination(null)
  }

  useEffect(() => {
    const cepDigits = customer.cep.replace(/\D/g, '')

    if (cepDigits.length !== 8) {
      return
    }

    let cancelled = false

    const lookupCep = async () => {
      setIsLoadingCep(true)
      setCepError(null)

      try {
        const response = await fetch(`/api/address/cep/${cepDigits}`)
        const result = (await response.json()) as CepLookupResponse

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Nao foi possivel localizar o CEP.')
        }

        if (cancelled) return

        setCustomer((prev) => ({
          ...prev,
          cep: result.data?.cep || prev.cep,
          endereco: result.data?.endereco || prev.endereco,
          complemento: prev.complemento || result.data?.complemento || '',
          bairro: result.data?.bairro || '',
          cidade: result.data?.cidade || prev.cidade,
          estado: result.data?.estado || prev.estado,
        }))

        setShippingDestination({
          cep: result.data.cep,
          cidade: result.data.cidade,
          estado: result.data.estado,
        })
      } catch (error) {
        if (cancelled) return

        setCepError(
          error instanceof Error ? error.message : 'Nao foi possivel localizar o CEP.'
        )
        setShippingDestination(null)
      } finally {
        if (!cancelled) {
          setIsLoadingCep(false)
        }
      }
    }

    void lookupCep()

    return () => {
      cancelled = true
    }
  }, [customer.cep, setShippingDestination])

  useEffect(() => {
    if (customer.cidade && customer.estado) {
      setShippingDestination({
        cep: customer.cep,
        cidade: customer.cidade,
        estado: customer.estado,
      })
      return
    }

    setShippingDestination(null)
  }, [customer.cidade, customer.estado, customer.cep, setShippingDestination])

  useEffect(() => {
    if (!isOpen || !hasResolvedShippingDestination(customer) || cart.length === 0) {
      return
    }

    let cancelled = false

    const quoteShipping = async () => {
      setIsLoadingShipping(true)

      try {
        const response = await fetch('/api/shipping/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              product_id: item.id,
              variant: item.size,
              qty: item.qty,
              price: item.price,
            })),
            coupon: coupon?.code || null,
            destination: {
              cep: customer.cep,
              cidade: customer.cidade,
              estado: customer.estado,
            },
          }),
        })

        const result = (await response.json()) as ShippingQuoteResponse

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Nao foi possivel atualizar o frete.')
        }

        if (cancelled) return

        setShippingQuote(result.data.shipping)
        setShippingTotals(result.data.totals)
      } catch (error) {
        if (cancelled) return

        setShippingQuote({
          amount: totals.frete,
          source: 'fallback',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel atualizar o frete em tempo real.',
        })
        setShippingTotals(null)
      } finally {
        if (!cancelled) {
          setIsLoadingShipping(false)
        }
      }
    }

    void quoteShipping()

    return () => {
      cancelled = true
    }
  }, [isOpen, customer, cart, coupon, totals.frete])

  const shouldUseRealtimeShipping =
    isOpen && hasResolvedShippingDestination(customer) && cart.length > 0
  const shippingLoading = shouldUseRealtimeShipping && isLoadingShipping
  const effectiveTotals =
    shouldUseRealtimeShipping ? shippingTotals ?? totals : totals
  const shippingMessage =
    shouldUseRealtimeShipping ? shippingQuote?.message || null : null

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current) {
      resetState()
      onClose()
    }
  }

  const validateStep1 = (): boolean => {
    if (!customer.nome || customer.nome.length < 3) {
      showToast('Informe seu nome completo.', 'error')
      return false
    }
    if (!isValidEmail(customer.email)) {
      showToast('E-mail invalido.', 'error')
      return false
    }
    if (!isValidCPF(customer.cpf)) {
      showToast('CPF invalido.', 'error')
      return false
    }
    if (!isValidPhone(customer.telefone)) {
      showToast('Telefone invalido.', 'error')
      return false
    }
    if (!isValidCEP(customer.cep)) {
      showToast('CEP invalido.', 'error')
      return false
    }
    if (!customer.endereco || !customer.numero || !customer.cidade) {
      showToast('Preencha o endereco completo.', 'error')
      return false
    }
    if (!customer.estado || customer.estado.length !== 2) {
      showToast('Informe o estado com 2 letras.', 'error')
      return false
    }
    return true
  }

  const goToStep2 = () => {
    if (shippingLoading) {
      showToast('Aguarde a atualizacao do frete antes de continuar.', 'info')
      return
    }

    if (validateStep1()) {
      setShippingDestination({
        cidade: customer.cidade,
        estado: customer.estado,
        cep: customer.cep,
      })
      setStep(2)
    }
  }

  const finalizePurchase = async () => {
    setIsProcessing(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(
      () => controller.abort(),
      CHECKOUT_REQUEST_TIMEOUT_MS
    )

    try {
      const response = await fetch('/api/payments/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.id,
            variant: item.size,
            qty: item.qty,
            price: item.price,
          })),
          coupon: coupon?.code || null,
          totals: effectiveTotals,
          customer,
          paymentMethod,
        }),
      })

      const result = (await response.json()) as {
        success: boolean
        init_point?: string | null
        error?: string
      }

      if (!response.ok || !result.success || !result.init_point) {
        throw new Error(result.error || 'Nao foi possivel concluir o pedido.')
      }

      track('begin_checkout', {
        paymentMethod,
        total: effectiveTotals.total,
      })
      clearCart()
      window.location.href = result.init_point
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'AbortError'
          ? 'O Mercado Pago demorou para responder. Tente novamente em instantes.'
          : error instanceof Error
            ? error.message
            : 'Nao foi possivel concluir o pedido.'
      showToast(message, 'error')
    } finally {
      window.clearTimeout(timeout)
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  if (!currentUser) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm sm:p-4"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl tracking-wide text-foreground">
            {step === 1 && 'IDENTIFICACAO'}
            {step === 2 && 'PAGAMENTO'}
            {step === 3 && 'PEDIDO CONFIRMADO'}
          </h2>
          <button
            onClick={() => {
              resetState()
              onClose()
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">Seus dados de entrega</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <input
                    type="text"
                    value={customer.nome}
                    onChange={(event) => setCustomer({ ...customer, nome: event.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">E-mail</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                    placeholder="seu@email.com"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">CPF</label>
                  <input
                    type="text"
                    value={customer.cpf}
                    onChange={(event) =>
                      setCustomer({ ...customer, cpf: maskCPF(event.target.value) })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <input
                    type="text"
                    value={customer.telefone}
                    onChange={(event) =>
                      setCustomer({ ...customer, telefone: maskPhone(event.target.value) })
                    }
                    placeholder="(00) 00000-0000"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">CEP</label>
                <input
                  type="text"
                  value={customer.cep}
                  onChange={(event) => {
                    setCepError(null)
                    setCustomer({ ...customer, cep: maskCEP(event.target.value) })
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                />
                <div className="mt-1 text-xs">
                  {isLoadingCep && <span className="text-muted-foreground">Buscando endereco...</span>}
                  {!isLoadingCep && cepError && <span className="text-red-500">{cepError}</span>}
                  {!isLoadingCep &&
                    !cepError &&
                    hasResolvedShippingDestination(customer) && (
                      <span className="text-green-500">
                        Endereco localizado. Atualizando frete para {customer.cidade}/{customer.estado}.
                      </span>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Endereco</label>
                  <input
                    type="text"
                    value={customer.endereco}
                    onChange={(event) =>
                      setCustomer({ ...customer, endereco: event.target.value })
                    }
                    placeholder="Rua, avenida, etc"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Numero</label>
                  <input
                    type="text"
                    value={customer.numero}
                    onChange={(event) => setCustomer({ ...customer, numero: event.target.value })}
                    placeholder="No"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <input
                  type="text"
                  value={customer.bairro}
                  onChange={(event) => setCustomer({ ...customer, bairro: event.target.value })}
                  placeholder="Seu bairro"
                  className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Complemento</label>
                <input
                  type="text"
                  value={customer.complemento}
                  onChange={(event) =>
                    setCustomer({ ...customer, complemento: event.target.value })
                  }
                  placeholder="Apartamento, bloco, referencia"
                  className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Cidade</label>
                  <input
                    type="text"
                    value={customer.cidade}
                    onChange={(event) => setCustomer({ ...customer, cidade: event.target.value })}
                    placeholder="Sua cidade"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <input
                    type="text"
                    value={customer.estado}
                    onChange={(event) =>
                      setCustomer({ ...customer, estado: event.target.value.toUpperCase() })
                    }
                    placeholder="UF"
                    maxLength={2}
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={goToStep2}
                disabled={shippingLoading}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
              >
                {shippingLoading ? 'Atualizando frete...' : 'Continuar para pagamento'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">
                Escolha a forma de pagamento para abrir o Checkout Pro do Mercado Pago.
              </p>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon

                  return (
                    <button
                      key={option.value}
                      onClick={() => setPaymentMethod(option.value)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-sm font-bold transition-all ${
                        paymentMethod === option.value
                          ? 'border-orange text-orange bg-orange/10'
                          : 'border-border text-muted-foreground bg-muted hover:border-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                Os dados de pagamento serao preenchidos com seguranca no Mercado Pago.
              </div>


              <div className="bg-muted border border-border rounded-xl p-4 my-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    R$ {effectiveTotals.subtotalBruto.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {effectiveTotals.desconto > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-green-500">
                    <span>Cupom ({coupon?.code})</span>
                    <span>- R$ {effectiveTotals.desconto.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={effectiveTotals.frete === 0 ? 'text-green-500' : 'text-foreground'}>
                    {shippingLoading
                      ? 'Calculando...'
                      : effectiveTotals.frete === 0
                        ? 'GRATIS'
                        : `R$ ${effectiveTotals.frete.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {hasResolvedShippingDestination(customer) && !shippingLoading && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {isCatalaoGoias(customer)
                      ? 'Frete gratis aplicado para entregas em Catalao/GO.'
                      : shippingMessage || `Frete calculado para ${customer.cidade}/${customer.estado}.`}
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-orange">
                    R$ {effectiveTotals.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-border text-foreground font-bold rounded-xl hover:border-muted-foreground transition-all sm:w-auto"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizePurchase}
                  disabled={isProcessing || shippingLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessing
                    ? 'Abrindo checkout...'
                    : shippingLoading
                      ? 'Atualizando frete...'
                      : `Ir para Mercado Pago R$ ${effectiveTotals.total.toFixed(2).replace('.', ',')}`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">Pedido confirmado</div>
              <h3 className="font-display text-2xl tracking-wide text-foreground mb-2">
                PEDIDO FEITO
              </h3>
              <p className="text-muted-foreground mb-6">
                Seu pedido foi registrado com sucesso. Agora ele ja aparece na base local do
                projeto.
              </p>

              <div className="bg-muted border border-border rounded-xl p-4 mb-6">
                <span className="text-sm text-muted-foreground">Numero do pedido</span>
                <div className="text-xl font-bold text-orange">Verifique na tela de retorno</div>
              </div>

              <div className="text-sm text-muted-foreground mb-6">
                Um status inicial foi gerado conforme a forma de pagamento escolhida.
                <br />
                Pix e boleto ficam como aguardando pagamento.
              </div>

              <button
                onClick={() => {
                  resetState()
                  onClose()
                }}
                className="w-full px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Continuar comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
