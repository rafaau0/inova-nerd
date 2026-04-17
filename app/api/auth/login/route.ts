import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
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
      { success: false, error: 'Erro ao entrar.' },
      { status: 500 }
    )
  }
}
