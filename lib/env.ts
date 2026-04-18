export function isProductionEnvironment() {
  return process.env.NODE_ENV === 'production'
}

export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (secret) {
    return secret
  }

  if (isProductionEnvironment()) {
    throw new Error('SESSION_SECRET nao configurada.')
  }

  return 'inovanerd-local-session-secret'
}

export function hasConfiguredSessionSecret() {
  return Boolean(
    process.env.SESSION_SECRET &&
      process.env.SESSION_SECRET !== 'inovanerd-local-session-secret'
  )
}

export function getMercadoPagoWebhookSecret() {
  return process.env.MP_WEBHOOK_SECRET || null
}

export function hasMercadoPagoWebhookSecret() {
  return Boolean(getMercadoPagoWebhookSecret())
}

export function getFileStorageProvider() {
  return (process.env.FILE_STORAGE_PROVIDER || 'local').toLowerCase()
}

export function isSupabaseStorageConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET
  )
}
