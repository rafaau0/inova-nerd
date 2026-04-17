import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'
import { isProductionJsonDataStore } from '@/lib/data'

export async function POST(request: Request) {
  try {
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

    const message = isProductionJsonDataStore()
      ? 'Cadastro indisponivel nesta configuracao online. Ative um banco de dados para salvar contas em producao.'
      : 'Erro ao criar conta.'

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
