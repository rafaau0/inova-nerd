import { NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════
// POST /api/coupons/validate
// Valida um cupom de desconto
// 
// TODO (backend): Conectar com banco de dados
// const { data, error } = await supabase
//   .from('coupons')
//   .select('*')
//   .eq('code', code.toUpperCase())
//   .eq('active', true)
//   .gte('expires_at', new Date().toISOString())
//   .single()
// ═══════════════════════════════════════════════════════════

// Cupons validos (mover para banco de dados em producao)
const VALID_COUPONS: Record<string, { pct: number; minValue?: number; maxUses?: number }> = {
  'OTAKU10': { pct: 10 },
  'ANIME20': { pct: 20, minValue: 150 },
  'VERSE15': { pct: 15 },
  'PRIMEIRA': { pct: 10 }, // Cupom para primeira compra
}

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Codigo do cupom e obrigatorio' },
        { status: 400 }
      )
    }

    const upperCode = code.trim().toUpperCase()
    const coupon = VALID_COUPONS[upperCode]

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Cupom invalido ou expirado' },
        { status: 404 }
      )
    }

    // Verifica valor minimo
    if (coupon.minValue && cartTotal && cartTotal < coupon.minValue) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Valor minimo para este cupom: R$ ${coupon.minValue.toFixed(2).replace('.', ',')}` 
        },
        { status: 400 }
      )
    }

    // TODO: Verificar se o cupom ja foi usado pelo usuario
    // TODO: Verificar limite de usos do cupom

    return NextResponse.json({
      success: true,
      data: {
        code: upperCode,
        pct: coupon.pct,
        minValue: coupon.minValue || null,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao validar cupom' },
      { status: 500 }
    )
  }
}
