'use client'

import { useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { CreditCard, FileText, QrCode, X } from 'lucide-react'
import { useCart } from './cart-provider'
import { useToast } from './toast-provider'
import { hasResolvedShippingDestination, isCatalaoGoias } from '@/lib/shipping'
import type { CustomerInfo, PaymentMethod } from '@/lib/types'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
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

function maskCard(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function maskValidity(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) digits = digits.replace(/(\d{2})(\d+)/, '$1/$2')
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

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, coupon, totals, clearCart, setShippingDestination } = useCart()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
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
    cidade: '',
    estado: '',
  })

  const [card, setCard] = useState({
    numero: '',
    validade: '',
    cvv: '',
    nome: '',
  })

  const resetState = () => {
    setStep(1)
    setPaymentMethod('credit_card')
    setIsProcessing(false)
    setShippingDestination(null)
    setCard({
      numero: '',
      validade: '',
      cvv: '',
      nome: '',
    })
  }

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

  const validateStep2 = (): boolean => {
    if (paymentMethod === 'pix' || paymentMethod === 'boleto') return true

    if (!card.numero || card.numero.replace(/\s/g, '').length < 13) {
      showToast('Numero do cartao invalido.', 'error')
      return false
    }
    if (!/^\d{2}\/\d{2}$/.test(card.validade)) {
      showToast('Validade invalida.', 'error')
      return false
    }
    if (!card.cvv || card.cvv.length < 3) {
      showToast('CVV invalido.', 'error')
      return false
    }
    if (!card.nome || card.nome.length < 3) {
      showToast('Informe o nome do titular.', 'error')
      return false
    }
    return true
  }

  const goToStep2 = () => {
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
    if (!validateStep2()) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/payments/preference', {
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
          totals,
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
        total: totals.total,
      })
      clearCart()
      window.location.href = result.init_point
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nao foi possivel concluir o pedido.'
      showToast(message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
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

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">Seus dados de entrega</p>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                  onChange={(event) => setCustomer({ ...customer, cep: maskCEP(event.target.value) })}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
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

              <div className="grid grid-cols-2 gap-4">
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
                className="w-full mt-4 px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Continuar para pagamento
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">
                Escolha a forma de pagamento para abrir o Checkout Pro do Mercado Pago.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
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

              {(paymentMethod === 'credit_card' || paymentMethod === 'debit') && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground">Numero do cartao</label>
                    <input
                      type="text"
                      value={card.numero}
                      onChange={(event) =>
                        setCard({ ...card, numero: maskCard(event.target.value) })
                      }
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Validade</label>
                      <input
                        type="text"
                        value={card.validade}
                        onChange={(event) =>
                          setCard({ ...card, validade: maskValidity(event.target.value) })
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">CVV</label>
                      <input
                        type="text"
                        value={card.cvv}
                        onChange={(event) =>
                          setCard({
                            ...card,
                            cvv: event.target.value.replace(/\D/g, '').slice(0, 3),
                          })
                        }
                        placeholder="000"
                        maxLength={3}
                        className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Nome no cartao</label>
                    <input
                      type="text"
                      value={card.nome}
                      onChange={(event) =>
                        setCard({ ...card, nome: event.target.value.toUpperCase() })
                      }
                      placeholder="Como aparece no cartao"
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="bg-muted border border-border rounded-xl p-4 my-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    R$ {totals.subtotalBruto.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {totals.desconto > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-green-500">
                    <span>Cupom ({coupon?.code})</span>
                    <span>- R$ {totals.desconto.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={totals.frete === 0 ? 'text-green-500' : 'text-foreground'}>
                    {totals.frete === 0 ? 'GRATIS' : `R$ ${totals.frete.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {hasResolvedShippingDestination(customer) && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {isCatalaoGoias(customer)
                      ? 'Frete gratis aplicado para entregas em Catalao/GO.'
                      : `Frete calculado para ${customer.cidade}/${customer.estado}.`}
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-orange">R$ {totals.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-border text-foreground font-bold rounded-xl hover:border-muted-foreground transition-all"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizePurchase}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessing
                    ? 'Abrindo checkout...'
                    : `Ir para Mercado Pago R$ ${totals.total.toFixed(2).replace('.', ',')}`}
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
