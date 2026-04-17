import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { isProductionJsonDataStore } from '@/lib/data'

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

    const message = isProductionJsonDataStore()
      ? 'Login indisponivel nesta configuracao online. Ative um banco de dados para contas persistentes em producao.'
      : 'Erro ao entrar.'

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
