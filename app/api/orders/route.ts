import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createOrder, getOrdersByUser, readOrders } from '@/lib/server-store'
import type { CreateOrderPayload, OrderResponse } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const payload: CreateOrderPayload = await request.json()
    const currentUser = await getCurrentUser()

    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Carrinho vazio.' },
        { status: 400 }
      )
    }

    if (!payload.customer?.email) {
      return NextResponse.json(
        { success: false, error: 'Dados do cliente incompletos.' },
        { status: 400 }
      )
    }

    const result = await createOrder({
      ...payload,
      userId: currentUser?.id ?? null,
    })

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error } satisfies OrderResponse,
        { status: result.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        order_id: result.order.id,
        message: 'Pedido criado com sucesso.',
      } satisfies OrderResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar pedido.' } satisfies OrderResponse,
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    const orders =
      currentUser?.role === 'admin'
        ? await readOrders()
        : currentUser
          ? await getOrdersByUser(currentUser.id)
          : []

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos.' },
      { status: 500 }
    )
  }
}
