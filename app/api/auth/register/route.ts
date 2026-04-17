import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      nome?: string
      email?: string
      password?: string
      cpf?: string
      telefone?: string
    }

    if (!body.nome || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Nome, e-mail e senha sao obrigatorios.' },
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
    })
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar conta.' },
      { status: 500 }
    )
  }
}
