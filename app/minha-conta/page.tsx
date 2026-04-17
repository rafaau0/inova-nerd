import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { getOrdersByUser } from '@/lib/server-store'
import type { OrderRecord, OrderStatus } from '@/lib/types'

const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: 'Pendente',
  confirmed: 'Confirmado',
  in_transit: 'Em transito',
  cancelled: 'Cancelado',
}

function renderOrders(title: string, description: string, orders: OrderRecord[]) {
  return (
    <section className="bg-card border border-border rounded-3xl p-8">
      <div className="mb-6">
        <h2 className="font-display text-3xl text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">
          Nenhum pedido nesta etapa no momento.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border p-5 bg-muted/30">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">Pedido #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="mr-4">Status: {statusLabels[order.status]}</span>
                  <span>Pagamento: {order.paymentStatus}</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {order.items.map((item) => `${item.product_name} x${item.qty}`).join(' • ')}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Entrega em {order.customer.cidade}/{order.customer.estado}
              </div>
              <div className="mt-4 font-bold text-orange">
                Total: R$ {order.totals.total.toFixed(2).replace('.', ',')}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default async function AccountPage() {
  const user = await requireUser()
  const orders = await getOrdersByUser(user.id)

  const pendingOrders = orders.filter(
    (order) => order.status === 'awaiting_payment' || order.status === 'confirmed'
  )
  const inTransitOrders = orders.filter((order) => order.status === 'in_transit')
  const historyOrders = orders.filter((order) => order.status === 'cancelled')

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-card border border-border rounded-3xl p-8">
          <span className="inline-flex px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-semibold mb-4">
            Minha conta
          </span>
          <h1 className="font-display text-4xl text-foreground mb-2">
            OLA, {user.nome.toUpperCase()}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>CPF: {user.cpf || 'Nao informado'}</p>
            <p>Telefone: {user.telefone || 'Nao informado'}</p>
            <p>
              Endereco:{' '}
              {user.endereco
                ? `${user.endereco}, ${user.numero} - ${user.bairro}, ${user.cidade}/${user.estado}`
                : 'Nao informado'}
            </p>
          </div>
          {user.role === 'admin' && (
            <div className="mt-5">
              <Link href="/admin" className="text-orange font-semibold">
                Ir para o painel administrativo
              </Link>
            </div>
          )}
        </section>

        {renderOrders(
          'PEDIDOS PENDENTES',
          'Pedidos aguardando pagamento ou separacao.',
          pendingOrders
        )}

        {renderOrders(
          'EM TRANSITO',
          'Pedidos que ja sairam para entrega.',
          inTransitOrders
        )}

        {renderOrders(
          'HISTORICO',
          'Pedidos cancelados vinculados a sua conta.',
          historyOrders
        )}
      </div>
    </main>
  )
}
