'use client'

import { useState } from 'react'
import type { CouponDefinition } from '@/lib/types'

interface AdminCouponsClientProps {
  initialCoupons: CouponDefinition[]
}

export function AdminCouponsClient({ initialCoupons }: AdminCouponsClientProps) {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [form, setForm] = useState({
    code: '',
    pct: 10,
    minValue: '',
    active: true,
    maxUses: '',
  })
  const [message, setMessage] = useState('')

  const saveCoupon = async (event: React.FormEvent) => {
    event.preventDefault()
    const payload = {
      code: form.code,
      pct: Number(form.pct),
      minValue: form.minValue ? Number(form.minValue) : null,
      active: form.active,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
    }

    const response = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = (await response.json()) as { success: boolean; data: CouponDefinition }
    if (result.success) {
      const exists = coupons.some((coupon) => coupon.code === result.data.code)
      setCoupons((prev) =>
        exists
          ? prev.map((coupon) => (coupon.code === result.data.code ? result.data : coupon))
          : [...prev, result.data]
      )
      setMessage('Cupom salvo com sucesso.')
      setForm({
        code: '',
        pct: 10,
        minValue: '',
        active: true,
        maxUses: '',
      })
    }
  }

  const removeCoupon = async (code: string) => {
    await fetch(`/api/admin/coupons/${code}`, { method: 'DELETE' })
    setCoupons((prev) => prev.filter((coupon) => coupon.code !== code))
    setMessage('Cupom removido.')
  }

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      <form onSubmit={saveCoupon} className="bg-card border border-border rounded-3xl p-6 space-y-4 h-fit">
        <h2 className="font-display text-2xl text-foreground">NOVO CUPOM</h2>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Codigo</span>
          <input
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Desconto (%)</span>
          <input
            type="number"
            value={form.pct}
            onChange={(event) => setForm((prev) => ({ ...prev, pct: Number(event.target.value) }))}
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Valor minimo</span>
          <input
            value={form.minValue}
            onChange={(event) => setForm((prev) => ({ ...prev, minValue: event.target.value }))}
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Maximo de usos</span>
          <input
            value={form.maxUses}
            onChange={(event) => setForm((prev) => ({ ...prev, maxUses: event.target.value }))}
            className="w-full mt-1 px-3 py-2 bg-muted border border-border rounded-xl"
          />
        </label>

        <label className="flex items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
          />
          Cupom ativo
        </label>

        {message && <p className="text-sm text-orange">{message}</p>}

        <button className="w-full px-4 py-3 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background">
          Salvar cupom
        </button>
      </form>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <article key={coupon.code} className="bg-card border border-border rounded-3xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">{coupon.code}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {coupon.pct}% • min. {coupon.minValue ? `R$ ${coupon.minValue}` : 'sem minimo'} • usos {coupon.uses}
                </p>
              </div>
              <button
                onClick={() => removeCoupon(coupon.code)}
                className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400"
              >
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
