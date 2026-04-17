import { NextResponse } from 'next/server'
import { quoteOrderPricing } from '@/lib/server-store'
import type { OrderItem } from '@/lib/types'

interface ShippingQuotePayload {
  items: OrderItem[]
  coupon: string | null
  destination: {
    cep?: string
    cidade?: string
    estado?: string
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ShippingQuotePayload

    if (!payload.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Carrinho vazio.' },
        { status: 400 }
      )
    }

    const result = await quoteOrderPricing({
      items: payload.items,
      coupon: payload.coupon,
      customer: {
        cep: payload.destination?.cep || '',
        cidade: payload.destination?.cidade || '',
        estado: payload.destination?.estado || '',
      },
    })

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        shipping: result.shippingQuote,
        totals: result.totals,
      },
    })
  } catch (error) {
    console.error('Error quoting shipping:', error)
    return NextResponse.json(
      { success: false, error: 'Nao foi possivel calcular o frete.' },
      { status: 500 }
    )
  }
}
