import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { consumeRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rateLimit = consumeRateLimit(`auth:login:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    })

    if (!rateLimit.success) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { success: false, error: 'Muitas tentativas. Tente novamente em instantes.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      )
    }

    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'E-mail e senha sao obrigatorios.' },
        { status: 400 }
      )
    }

    const result = await loginUser(body.email, body.password)
    return NextResponse.json(result, { status: result.success ? 200 : 401 })
  } catch (error) {
    console.error('Error logging user:', error)

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao entrar.' },
      { status: 500 }
    )
  }
}
