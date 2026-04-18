import 'server-only'

import crypto from 'node:crypto'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { getAppBaseUrl, getMercadoPagoWebhookSecret, isProductionEnvironment } from './env'
import type { PaymentMethod } from './types'

function getMercadoPagoToken() {
  const accessToken = process.env.MP_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN nao configurado.')
  }

  return accessToken
}

export function createMercadoPagoClient() {
  return new MercadoPagoConfig({
    accessToken: getMercadoPagoToken(),
  })
}

function getMercadoPagoApiBaseUrl() {
  return 'https://api.mercadopago.com'
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
  const baseUrl = getAppBaseUrl()

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

function parseSignatureHeader(signatureHeader: string | null) {
  if (!signatureHeader) {
    return null
  }

  const parts = signatureHeader.split(',')
  let timestamp: string | null = null
  let signature: string | null = null

  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=')
    const key = rawKey?.trim()
    const value = rawValue?.trim()

    if (!key || !value) {
      continue
    }

    if (key === 'ts') {
      timestamp = value
    }

    if (key === 'v1') {
      signature = value
    }
  }

  if (!timestamp || !signature) {
    return null
  }

  return { timestamp, signature }
}

export function verifyMercadoPagoWebhookSignature(request: Request) {
  const secret = getMercadoPagoWebhookSecret()

  if (!secret) {
    return !isProductionEnvironment()
  }

  const parsedSignature = parseSignatureHeader(request.headers.get('x-signature'))
  const requestId = request.headers.get('x-request-id')
  const dataId = new URL(request.url).searchParams.get('data.id')

  if (!parsedSignature || !requestId || !dataId) {
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${parsedSignature.timestamp};`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  if (expectedSignature.length !== parsedSignature.signature.length) {
    return false
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(parsedSignature.signature, 'hex')
  )
}

type MercadoPagoPaymentApiResponse = {
  id?: string | number
  status?: string
  external_reference?: string
}

export async function getMercadoPagoPayment(paymentId: string) {
  const response = await fetch(`${getMercadoPagoApiBaseUrl()}/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${getMercadoPagoToken()}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar o pagamento no Mercado Pago.')
  }

  return (await response.json()) as MercadoPagoPaymentApiResponse
}
