'use client'

import { useState, useRef, useEffect } from 'react'
import { X, CreditCard, QrCode, FileText } from 'lucide-react'
import { useCart } from './cart-provider'
import { useToast } from './toast-provider'
import type { CustomerInfo } from '@/lib/types'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

// Validadores
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isValidCPF = (v: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || /^\d{11}$/.test(v.replace(/\D/g, ''))
const isValidCEP = (v: string) => /^\d{5}-?\d{3}$/.test(v)
const isValidPhone = (v: string) => v.replace(/\D/g, '').length >= 10

// Mascaras
function maskCPF(v: string): string {
  let digits = v.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 9) digits = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  else if (digits.length > 6) digits = digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  else if (digits.length > 3) digits = digits.replace(/(\d{3})(\d+)/, '$1.$2')
  return digits
}

function maskPhone(v: string): string {
  let digits = v.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 10) digits = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  else if (digits.length > 6) digits = digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  else if (digits.length > 2) digits = digits.replace(/(\d{2})(\d+)/, '($1) $2')
  return digits
}

function maskCEP(v: string): string {
  let digits = v.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) digits = digits.replace(/(\d{5})(\d+)/, '$1-$2')
  return digits
}

function maskCard(v: string): string {
  let digits = v.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function maskValidity(v: string): string {
  let digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) digits = digits.replace(/(\d{2})(\d+)/, '$1/$2')
  return digits
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, coupon, totals, clearCart } = useCart()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // Form State
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

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setPaymentMethod(0)
      setIsProcessing(false)
    }
  }, [isOpen])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // Validate Step 1
  const validateStep1 = (): boolean => {
    if (!customer.nome || customer.nome.length < 3) {
      showToast('Informe seu nome completo', 'error')
      return false
    }
    if (!isValidEmail(customer.email)) {
      showToast('E-mail invalido', 'error')
      return false
    }
    if (!isValidCPF(customer.cpf)) {
      showToast('CPF invalido (use 000.000.000-00)', 'error')
      return false
    }
    if (!isValidPhone(customer.telefone)) {
      showToast('Telefone invalido', 'error')
      return false
    }
    if (!isValidCEP(customer.cep)) {
      showToast('CEP invalido (use 00000-000)', 'error')
      return false
    }
    if (!customer.endereco) {
      showToast('Informe o endereco', 'error')
      return false
    }
    if (!customer.numero) {
      showToast('Informe o numero', 'error')
      return false
    }
    if (!customer.cidade) {
      showToast('Informe a cidade', 'error')
      return false
    }
    if (!customer.estado || customer.estado.length !== 2) {
      showToast('Informe o estado (UF)', 'error')
      return false
    }
    return true
  }

  // Validate Step 2
  const validateStep2 = (): boolean => {
    // Pix ou Boleto nao precisa validar cartao
    if (paymentMethod === 1 || paymentMethod === 2) return true

    if (!card.numero || card.numero.replace(/\s/g, '').length < 13) {
      showToast('Numero do cartao invalido', 'error')
      return false
    }
    if (!/^\d{2}\/\d{2}$/.test(card.validade)) {
      showToast('Validade invalida (MM/AA)', 'error')
      return false
    }
    if (!card.cvv || card.cvv.length < 3) {
      showToast('CVV invalido', 'error')
      return false
    }
    if (!card.nome || card.nome.length < 3) {
      showToast('Informe o nome no cartao', 'error')
      return false
    }
    return true
  }

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const finalizePurchase = async () => {
    if (!validateStep2()) return

    setIsProcessing(true)

    // TODO (backend): Substituir por fetch real
    // const payload = {
    //   items: cart.map(i => ({ product_id: i.id, variant: i.size, qty: i.qty, price: i.price })),
    //   coupon: coupon?.code || null,
    //   totals,
    //   customer,
    // }
    // const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) })

    await new Promise(resolve => setTimeout(resolve, 2000))

    const orderId = 'IN' + Date.now().toString().slice(-6)
    setOrderNumber(orderId)
    clearCart()
    setStep(3)
    setIsProcessing(false)
  }

  if (!isOpen) return null

  const paymentMethods = [
    { icon: CreditCard, label: 'Cartao de Credito' },
    { icon: QrCode, label: 'Pix' },
    { icon: FileText, label: 'Boleto' },
    { icon: CreditCard, label: 'Debito' },
  ]

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl tracking-wide text-foreground">
            {step === 1 && 'IDENTIFICACAO'}
            {step === 2 && 'PAGAMENTO'}
            {step === 3 && 'PEDIDO CONFIRMADO'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step 1: Identificacao */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">Seus dados de entrega</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <input
                    type="text"
                    value={customer.nome}
                    onChange={e => setCustomer({ ...customer, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">E-mail</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
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
                    onChange={e => setCustomer({ ...customer, cpf: maskCPF(e.target.value) })}
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
                    onChange={e => setCustomer({ ...customer, telefone: maskPhone(e.target.value) })}
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
                  onChange={e => setCustomer({ ...customer, cep: maskCEP(e.target.value) })}
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
                    onChange={e => setCustomer({ ...customer, endereco: e.target.value })}
                    placeholder="Rua, Av., etc"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Numero</label>
                  <input
                    type="text"
                    value={customer.numero}
                    onChange={e => setCustomer({ ...customer, numero: e.target.value })}
                    placeholder="No"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Cidade</label>
                  <input
                    type="text"
                    value={customer.cidade}
                    onChange={e => setCustomer({ ...customer, cidade: e.target.value })}
                    placeholder="Sua cidade"
                    className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <input
                    type="text"
                    value={customer.estado}
                    onChange={e => setCustomer({ ...customer, estado: e.target.value.toUpperCase() })}
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

          {/* Step 2: Pagamento */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm mb-4">Forma de pagamento</p>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((method, i) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={i}
                      onClick={() => setPaymentMethod(i)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-sm font-bold transition-all ${
                        paymentMethod === i
                          ? 'border-orange text-orange bg-orange/10'
                          : 'border-border text-muted-foreground bg-muted hover:border-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {method.label}
                    </button>
                  )
                })}
              </div>

              {/* Card Fields (only for card methods) */}
              {(paymentMethod === 0 || paymentMethod === 3) && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground">Numero do Cartao</label>
                    <input
                      type="text"
                      value={card.numero}
                      onChange={e => setCard({ ...card, numero: maskCard(e.target.value) })}
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
                        onChange={e => setCard({ ...card, validade: maskValidity(e.target.value) })}
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
                        onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        placeholder="000"
                        maxLength={3}
                        className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Nome no Cartao</label>
                    <input
                      type="text"
                      value={card.nome}
                      onChange={e => setCard({ ...card, nome: e.target.value.toUpperCase() })}
                      placeholder="Como aparece no cartao"
                      className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Summary */}
              <div className="bg-muted border border-border rounded-xl p-4 my-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R$ {totals.subtotalBruto.toFixed(2).replace('.', ',')}</span>
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-orange">R$ {totals.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Actions */}
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
                  {isProcessing ? 'Processando...' : `Confirmar Pagamento R$ ${totals.total.toFixed(2).replace('.', ',')}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Sucesso */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-display text-2xl tracking-wide text-foreground mb-2">PEDIDO FEITO!</h3>
              <p className="text-muted-foreground mb-6">
                Seu pedido foi confirmado com sucesso. Prepare-se para receber seus produtos otaku!
              </p>

              <div className="bg-muted border border-border rounded-xl p-4 mb-6">
                <span className="text-sm text-muted-foreground">Numero do Pedido</span>
                <div className="text-xl font-bold text-orange">#{orderNumber}</div>
              </div>

              <div className="text-sm text-muted-foreground mb-6">
                Voce recebera um e-mail de confirmacao em breve
                <br />
                Prazo estimado de entrega: 3 a 7 dias uteis
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-br from-orange to-orange-dark text-background font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
