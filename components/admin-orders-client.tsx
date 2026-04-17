'use client'

import { useState } from 'react'
import type { OrderRecord, OrderStatus } from '@/lib/types'

interface AdminOrdersClientProps {
  initialOrders: OrderRecord[]
}

const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: 'Pendente',
  confirmed: 'Confirmado',
  in_transit: 'Em transito',
  cancelled: 'Cancelado',
}

export function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [message, setMessage] = useState('')

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setMessage('')

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    const result = (await response.json()) as {
      success: boolean
      error?: string
      data?: OrderRecord
    }

    if (!response.ok || !result.success || !result.data) {
      setMessage(result.error || 'Nao foi possivel atualizar o pedido.')
      return
    }

    setOrders((prev) => prev.map((order) => (order.id === orderId ? result.data! : order)))
    setMessage(`Pedido ${orderId} atualizado para ${statusLabels[status]}.`)
  }

  return (
    <div className="space-y-4">
      {message && <p className="text-sm text-orange">{message}</p>}

      {orders.map((order) => (
        <article key={order.id} className="bg-card border border-border rounded-3xl p-6">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h2 className="font-semibold text-foreground">#{order.id}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {order.customer.nome} • {order.customer.email}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.customer.endereco}, {order.customer.numero} - {order.customer.bairro},{' '}
                {order.customer.cidade}/{order.customer.estado}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div>Pagamento: {order.paymentStatus}</div>
              <div>Metodo: {order.paymentMethod}</div>
              <label className="flex items-center gap-2">
                <span>Status</span>
                <select
                  value={order.status}
                  onChange={(event) =>
                    void updateStatus(order.id, event.target.value as OrderStatus)
                  }
                  className="px-3 py-2 bg-muted border border-border rounded-xl text-foreground"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {order.items.map((item) => `${item.product_name} x${item.qty}`).join(' • ')}
          </div>
          <div className="mt-4 font-bold text-orange">
            Total: R$ {order.totals.total.toFixed(2).replace('.', ',')}
          </div>
        </article>
      ))}
    </div>
  )
}
