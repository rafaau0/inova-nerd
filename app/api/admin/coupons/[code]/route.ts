import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { deleteCoupon, upsertCoupon } from '@/lib/server-store'
import type { CreateCouponPayload } from '@/lib/types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  await requireAdmin()
  const { code } = await params
  const body = (await request.json()) as Omit<CreateCouponPayload, 'code'>
  const coupon = await upsertCoupon({
    ...body,
    code,
  })
  return NextResponse.json({ success: true, data: coupon })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  await requireAdmin()
  const { code } = await params
  await deleteCoupon(code)
  return NextResponse.json({ success: true })
}
