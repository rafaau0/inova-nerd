import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getProductImageValidationError, uploadProductImage } from '@/lib/storage'

export async function POST(request: Request) {
  await requireAdmin()

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      )
    }

    const validationError = getProductImageValidationError(file)
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      )
    }

    const uploaded = await uploadProductImage(file)

    return NextResponse.json({
      success: true,
      data: {
        url: uploaded.url,
        provider: uploaded.provider,
      },
    })
  } catch (error) {
    console.error('Error uploading product image:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Nao foi possivel enviar a imagem.',
      },
      { status: 500 }
    )
  }
}
