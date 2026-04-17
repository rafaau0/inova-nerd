import { NextResponse } from 'next/server'
import { readCoupons } from '@/lib/server-store'

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Codigo do cupom e obrigatorio.' },
        { status: 400 }
      )
    }

    const upperCode = String(code).trim().toUpperCase()
    const coupons = await readCoupons()
    const coupon = coupons.find((item) => item.code === upperCode)

    if (!coupon || !coupon.active) {
      return NextResponse.json(
        { success: false, error: 'Cupom invalido ou inativo.' },
        { status: 404 }
      )
    }

    if (coupon.minValue && Number(cartTotal) < coupon.minValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Valor minimo para este cupom: R$ ${coupon.minValue
            .toFixed(2)
            .replace('.', ',')}`,
        },
        { status: 400 }
      )
    }

    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return NextResponse.json(
        { success: false, error: 'Cupom esgotado.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        pct: coupon.pct,
        minValue: coupon.minValue,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao validar cupom.' },
      { status: 500 }
    )
  }
}
