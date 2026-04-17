import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
}

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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Envie apenas imagens.' },
        { status: 400 }
      )
    }

    const extension = path.extname(file.name) || '.png'
    const baseName = path.basename(file.name, extension)
    const safeName = sanitizeFileName(baseName)
    const fileName = `${Date.now()}-${safeName}${extension.toLowerCase()}`
    const relativeDir = path.join('uploads', 'products')
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    const absolutePath = path.join(absoluteDir, fileName)

    await mkdir(absoluteDir, { recursive: true })
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({
      success: true,
      data: {
        url: `/${relativeDir.replace(/\\/g, '/')}/${fileName}`,
      },
    })
  } catch (error) {
    console.error('Error uploading product image:', error)
    return NextResponse.json(
      { success: false, error: 'Nao foi possivel enviar a imagem.' },
      { status: 500 }
    )
  }
}
