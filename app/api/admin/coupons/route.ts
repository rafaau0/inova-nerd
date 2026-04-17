import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { readCoupons, upsertCoupon } from '@/lib/server-store'
import type { CreateCouponPayload } from '@/lib/types'

export async function GET() {
  await requireAdmin()
  const coupons = await readCoupons()
  return NextResponse.json({ success: true, data: coupons })
}

export async function POST(request: Request) {
  await requireAdmin()
  const body = (await request.json()) as CreateCouponPayload
  const coupon = await upsertCoupon(body)
  return NextResponse.json({ success: true, data: coupon }, { status: 201 })
}
