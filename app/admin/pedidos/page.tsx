import { requireAdmin } from '@/lib/auth'
import { readOrders } from '@/lib/server-store'

export default async function AdminOrdersPage() {
  await requireAdmin()
  const orders = await readOrders()

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-4xl text-foreground">PEDIDOS</h1>
          <p className="text-muted-foreground mt-2">
            Visualize pagamentos, clientes e status da loja.
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="bg-card border border-border rounded-3xl p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">#{order.id}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customer.nome} • {order.customer.email}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Status: {order.status}</div>
                  <div>Pagamento: {order.paymentStatus}</div>
                  <div>Metodo: {order.paymentMethod}</div>
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
      </div>
    </main>
  )
}
