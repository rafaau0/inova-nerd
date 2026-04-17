import 'server-only'

import { MercadoPagoConfig, Preference } from 'mercadopago'
import type { PaymentMethod } from './types'

function getMercadoPagoToken() {
  const accessToken = process.env.MP_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN nao configurado.')
  }

  return accessToken
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export function createMercadoPagoClient() {
  return new MercadoPagoConfig({
    accessToken: getMercadoPagoToken(),
  })
}

function getExcludedPaymentTypes(method: PaymentMethod) {
  switch (method) {
    case 'credit_card':
      return [{ id: 'ticket' }, { id: 'bank_transfer' }, { id: 'debit_card' }]
    case 'debit':
      return [{ id: 'ticket' }, { id: 'bank_transfer' }, { id: 'credit_card' }]
    case 'pix':
      return [{ id: 'ticket' }, { id: 'credit_card' }, { id: 'debit_card' }]
    case 'boleto':
      return [{ id: 'bank_transfer' }, { id: 'credit_card' }, { id: 'debit_card' }]
    default:
      return []
  }
}

export async function createCheckoutPreference(input: {
  orderId: string
  paymentMethod: PaymentMethod
  customer: {
    nome: string
    email: string
  }
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
}) {
  const client = createMercadoPagoClient()
  const preference = new Preference(client)
  const baseUrl = getBaseUrl()

  const response = await preference.create({
    body: {
      external_reference: input.orderId,
      items: input.items.map((item) => ({
        ...item,
        currency_id: 'BRL',
      })),
      payer: {
        name: input.customer.nome,
        email: input.customer.email,
      },
      payment_methods: {
        excluded_payment_types: getExcludedPaymentTypes(input.paymentMethod),
        installments: 12,
      },
      back_urls: {
        success: `${baseUrl}/checkout/retorno?status=success&order_id=${input.orderId}`,
        pending: `${baseUrl}/checkout/retorno?status=pending&order_id=${input.orderId}`,
        failure: `${baseUrl}/checkout/retorno?status=failure&order_id=${input.orderId}`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/payments/webhook`,
      statement_descriptor: 'INOVANERD',
    },
  })

  return response
}
