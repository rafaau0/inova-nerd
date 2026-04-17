import { AdminCouponsClient } from '@/components/admin-coupons-client'
import { requireAdmin } from '@/lib/auth'
import { readCoupons } from '@/lib/server-store'

export default async function AdminCouponsPage() {
  await requireAdmin()
  const coupons = await readCoupons()

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-4xl text-foreground">CUPONS</h1>
          <p className="text-muted-foreground mt-2">
            Crie e ajuste descontos sem depender do codigo.
          </p>
        </div>
        <AdminCouponsClient initialCoupons={coupons} />
      </div>
    </main>
  )
}
