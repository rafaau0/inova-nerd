import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { updateOrderStatus } from '@/lib/server-store'
import type { OrderStatus } from '@/lib/types'

const allowedStatuses: OrderStatus[] = [
  'awaiting_payment',
  'confirmed',
  'in_transit',
  'cancelled',
]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params

  try {
    const body = (await request.json()) as { status?: OrderStatus }

    if (!body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Status invalido.' },
        { status: 400 }
      )
    }

    const order = await updateOrderStatus(id, body.status)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pedido nao encontrado.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { success: false, error: 'Nao foi possivel atualizar o pedido.' },
      { status: 500 }
    )
  }
}
