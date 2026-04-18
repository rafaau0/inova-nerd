import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { consumeRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rateLimit = consumeRateLimit(`auth:register:${getClientIp(request)}`, {
      limit: 5,
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
      nome?: string
      email?: string
      password?: string
      cpf?: string
      telefone?: string
      cep?: string
      endereco?: string
      numero?: string
      complemento?: string
      bairro?: string
      cidade?: string
      estado?: string
    }

    if (
      !body.nome ||
      !body.email ||
      !body.password ||
      !body.cpf ||
      !body.telefone ||
      !body.cep ||
      !body.endereco ||
      !body.numero ||
      !body.bairro ||
      !body.cidade ||
      !body.estado
    ) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os dados obrigatorios do cadastro.' },
        { status: 400 }
      )
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha precisa ter pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    const result = await registerUser({
      nome: body.nome,
      email: body.email,
      password: body.password,
      cpf: body.cpf,
      telefone: body.telefone,
      cep: body.cep,
      endereco: body.endereco,
      numero: body.numero,
      complemento: body.complemento,
      bairro: body.bairro,
      cidade: body.cidade,
      estado: body.estado,
    })
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error) {
    console.error('Error registering user:', error)

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao criar conta.' },
      { status: 500 }
    )
  }
}
