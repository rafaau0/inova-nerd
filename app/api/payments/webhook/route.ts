import { NextResponse } from 'next/server'
import {
  getMercadoPagoPayment,
  verifyMercadoPagoWebhookSignature,
} from '@/lib/mercadopago'
import { updateOrderPayment } from '@/lib/server-store'

interface MercadoPagoWebhookBody {
  action?: string
  data?: {
    external_reference?: string
    id?: string | number
    status?: string
  }
  type?: string
}

export async function POST(request: Request) {
  try {
    if (!verifyMercadoPagoWebhookSignature(request)) {
      return NextResponse.json({ received: false, error: 'Assinatura invalida.' }, { status: 401 })
    }

    const body = (await request.json()) as MercadoPagoWebhookBody
    const paymentId = body.data?.id ? String(body.data.id) : null

    if (body.type !== 'payment' || !paymentId) {
      return NextResponse.json({ received: true, ignored: true })
    }

    const payment = await getMercadoPagoPayment(paymentId)
    const externalReference = payment.external_reference
    const status = payment.status

    if (externalReference && status) {
      await updateOrderPayment(externalReference, {
        paymentProvider: 'mercado_pago',
        paymentReferenceId: payment.id ? String(payment.id) : paymentId,
        paymentStatus: status === 'approved' ? 'paid' : status === 'rejected' ? 'failed' : 'pending',
        status: status === 'approved' ? 'confirmed' : status === 'rejected' ? 'cancelled' : 'awaiting_payment',
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling Mercado Pago webhook:', error)
    return NextResponse.json({ received: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ received: true })
}
