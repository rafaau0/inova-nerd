import { NextResponse } from 'next/server'

function sanitizeCep(value: string) {
  return value.replace(/\D/g, '')
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ cep: string }> }
) {
  const { cep } = await context.params
  const sanitizedCep = sanitizeCep(cep)

  if (!/^\d{8}$/.test(sanitizedCep)) {
    return NextResponse.json(
      {
        success: false,
        error: 'CEP invalido.',
      },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`, {
      next: { revalidate: 60 * 60 * 12 },
    })

    if (!response.ok) {
      throw new Error('Falha ao consultar o CEP.')
    }

    const result = (await response.json()) as {
      erro?: boolean
      cep?: string
      logradouro?: string
      complemento?: string
      bairro?: string
      localidade?: string
      uf?: string
    }

    if (result.erro || !result.localidade || !result.uf) {
      return NextResponse.json(
        {
          success: false,
          error: 'CEP nao encontrado.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        cep: result.cep || sanitizedCep,
        endereco: result.logradouro || '',
        complemento: result.complemento || '',
        bairro: result.bairro || '',
        cidade: result.localidade,
        estado: result.uf,
      },
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Nao foi possivel consultar o CEP agora.',
      },
      { status: 502 }
    )
  }
}
