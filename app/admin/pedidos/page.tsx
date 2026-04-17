import { AdminOrdersClient } from '@/components/admin-orders-client'
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

        <AdminOrdersClient initialOrders={orders} />
      </div>
    </main>
  )
}
