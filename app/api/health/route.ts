import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import {
  getFileStorageProvider,
  hasConfiguredSessionSecret,
  hasMercadoPagoWebhookSecret,
  isProductionEnvironment,
} from '@/lib/env'
import { isJsonDataStore } from '@/lib/data'
import { isStorageHealthy } from '@/lib/storage'

export async function GET() {
  const checks: Record<string, { ok: boolean; message?: string }> = {}

  if (isJsonDataStore()) {
    checks.data = {
      ok: !isProductionEnvironment(),
      message: isProductionEnvironment()
        ? 'DATA_PROVIDER=json nao e recomendado para producao.'
        : 'Persistencia local habilitada para desenvolvimento.',
    }
  } else {
    try {
      const db = getDb()
      await db`select 1`
      checks.data = { ok: true, message: 'Banco conectado.' }
    } catch (error) {
      checks.data = {
        ok: false,
        message: error instanceof Error ? error.message : 'Falha ao conectar no banco.',
      }
    }
  }

  checks.session = {
    ok: !isProductionEnvironment() || hasConfiguredSessionSecret(),
    message:
      !isProductionEnvironment() || hasConfiguredSessionSecret()
        ? 'SESSION_SECRET configurada.'
        : 'SESSION_SECRET obrigatoria em producao.',
  }

  checks.mercadopago = {
    ok: Boolean(process.env.MP_ACCESS_TOKEN),
    message: process.env.MP_ACCESS_TOKEN
      ? 'MP_ACCESS_TOKEN configurado.'
      : 'MP_ACCESS_TOKEN nao configurado.',
  }

  checks.webhook = {
    ok: !isProductionEnvironment() || hasMercadoPagoWebhookSecret(),
    message:
      !isProductionEnvironment() || hasMercadoPagoWebhookSecret()
        ? 'Segredo do webhook configurado.'
        : 'MP_WEBHOOK_SECRET obrigatoria em producao.',
  }

  const storage = isStorageHealthy()
  checks.storage = {
    ok: storage.ok,
    message: `${storage.provider}: ${storage.message}`,
  }

  checks.baseUrl = {
    ok: Boolean(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL),
    message:
      process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
        ? 'URL base configurada.'
        : 'NEXT_PUBLIC_APP_URL nao configurada.',
  }

  const ok = Object.values(checks).every((check) => check.ok)

  return NextResponse.json(
    {
      ok,
      timestamp: new Date().toISOString(),
      service: 'inovanerd',
      storageProvider: getFileStorageProvider(),
      checks,
    },
    { status: ok ? 200 : 503 }
  )
}
