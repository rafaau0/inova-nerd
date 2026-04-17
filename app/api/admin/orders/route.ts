import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { readOrders } from '@/lib/server-store'

export async function GET() {
  await requireAdmin()
  const orders = await readOrders()
  return NextResponse.json({ success: true, data: orders })
}
