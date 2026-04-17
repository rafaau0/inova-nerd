import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { getOrdersByUser } from '@/lib/server-store'

export default async function AccountPage() {
  const user = await requireUser()
  const orders = await getOrdersByUser(user.id)

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-card border border-border rounded-3xl p-8">
          <span className="inline-flex px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-semibold mb-4">
            Minha conta
          </span>
          <h1 className="font-display text-4xl text-foreground mb-2">OLA, {user.nome.toUpperCase()}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.role === 'admin' && (
            <div className="mt-5">
              <Link href="/admin" className="text-orange font-semibold">
                Ir para o painel administrativo
              </Link>
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-3xl p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-3xl text-foreground">MEUS PEDIDOS</h2>
              <p className="text-muted-foreground mt-2">
                Acompanhe o status dos pedidos feitos com sua conta.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">
              Nenhum pedido vinculado a esta conta ainda.
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
                      <span className="mr-4">Status: {order.status}</span>
                      <span>Pagamento: {order.paymentStatus}</span>
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
          )}
        </section>
      </div>
    </main>
  )
}
