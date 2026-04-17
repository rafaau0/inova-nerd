import { NextResponse } from 'next/server'
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
    const body = (await request.json()) as MercadoPagoWebhookBody
    const externalReference = body.data?.external_reference
    const status = body.data?.status

    if (externalReference && status) {
      await updateOrderPayment(externalReference, {
        paymentProvider: 'mercado_pago',
        paymentReferenceId: body.data?.id ? String(body.data.id) : null,
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
