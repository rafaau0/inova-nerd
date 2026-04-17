import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createCheckoutPreference } from '@/lib/mercadopago'
import { createOrder, updateOrderPayment } from '@/lib/server-store'
import type { CheckoutPreferencePayload } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const payload: CheckoutPreferencePayload = await request.json()
    const currentUser = await getCurrentUser()

    const orderResult = await createOrder({
      ...payload,
      userId: currentUser?.id ?? null,
    })

    if (!orderResult.ok) {
      return NextResponse.json(
        { success: false, error: orderResult.error },
        { status: orderResult.status }
      )
    }

    const preference = await createCheckoutPreference({
      orderId: orderResult.order.id,
      paymentMethod: payload.paymentMethod,
      customer: {
        nome: payload.customer.nome,
        email: payload.customer.email,
      },
      items: orderResult.order.items.map((item) => ({
        id: String(item.product_id),
        title: item.product_name,
        quantity: item.qty,
        unit_price: item.price,
      })),
    })

    const preferenceId = preference.id ?? null
    const checkoutUrl =
      preference.init_point ?? preference.sandbox_init_point ?? null

    await updateOrderPayment(orderResult.order.id, {
      paymentProvider: 'mercado_pago',
      paymentReferenceId: preferenceId,
      paymentUrl: checkoutUrl,
    })

    return NextResponse.json({
      success: true,
      order_id: orderResult.order.id,
      preference_id: preferenceId,
      init_point: checkoutUrl,
    })
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao iniciar pagamento com Mercado Pago.',
      },
      { status: 500 }
    )
  }
}
