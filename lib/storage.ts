import 'server-only'

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getFileStorageProvider, isProductionEnvironment, isSupabaseStorageConfigured } from './env'

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
}

function getSafeFileName(originalName: string) {
  const extension = path.extname(originalName) || '.png'
  const baseName = path.basename(originalName, extension)
  const safeName = sanitizeFileName(baseName)
  return `${Date.now()}-${safeName}${extension.toLowerCase()}`
}

async function uploadToLocalStorage(file: File) {
  const fileName = getSafeFileName(file.name)
  const relativeDir = path.join('uploads', 'products')
  const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
  const absolutePath = path.join(absoluteDir, fileName)

  await mkdir(absoluteDir, { recursive: true })
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

  return {
    url: `/${relativeDir.replace(/\\/g, '/')}/${fileName}`,
    provider: 'local' as const,
  }
}

async function uploadToSupabaseStorage(file: File) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    throw new Error('Supabase Storage nao configurado.')
  }

  const fileName = getSafeFileName(file.name)
  const objectPath = `products/${fileName}`
  const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${objectPath}`
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: Buffer.from(await file.arrayBuffer()),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Falha ao enviar imagem para o Supabase Storage: ${message}`)
  }

  return {
    url: `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${objectPath}`,
    provider: 'supabase' as const,
  }
}

export async function uploadProductImage(file: File) {
  const provider = getFileStorageProvider()

  if (provider === 'supabase') {
    return uploadToSupabaseStorage(file)
  }

  if (isProductionEnvironment()) {
    throw new Error(
      'Upload local de imagem nao e persistente em producao. Configure FILE_STORAGE_PROVIDER=supabase.'
    )
  }

  return uploadToLocalStorage(file)
}

export function isStorageHealthy() {
  const provider = getFileStorageProvider()

  if (provider === 'local') {
    return {
      ok: !isProductionEnvironment(),
      provider,
      message: isProductionEnvironment()
        ? 'Storage local nao e persistente em producao.'
        : 'Storage local habilitado para desenvolvimento.',
    }
  }

  if (provider === 'supabase') {
    return {
      ok: isSupabaseStorageConfigured(),
      provider,
      message: isSupabaseStorageConfigured()
        ? 'Supabase Storage configurado.'
        : 'Faltam variaveis do Supabase Storage.',
    }
  }

  return {
    ok: false,
    provider,
    message: 'Provedor de storage desconhecido.',
  }
}
