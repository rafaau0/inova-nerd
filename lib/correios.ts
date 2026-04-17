import 'server-only'

import type { ShippingQuote } from './types'

const CORREIOS_PROD_BASE_URL = 'https://api.correios.com.br'
const DEFAULT_SERVICE_CODE = '03220'
const DEFAULT_SERVICE_NAME = 'SEDEX'
const DEFAULT_PACKAGE_TYPE = '2'
const DEFAULT_WEIGHT_GRAMS = 300
const DEFAULT_LENGTH_CM = 20
const DEFAULT_WIDTH_CM = 20
const DEFAULT_HEIGHT_CM = 8
const DEFAULT_EXTRA_HEIGHT_PER_ITEM_CM = 2

interface CorreiosPriceResponse {
  coProduto?: string
  pcFinal?: string
}

interface CorreiosQuoteInput {
  destinationCep: string
  itemCount: number
}

function sanitizeCep(value?: string) {
  return (value || '').replace(/\D/g, '')
}

function parseMoney(value?: string) {
  if (!value) return null

  const normalized = value.replace(/\./g, '').replace(',', '.').trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function getEnvNumber(name: string, fallback: number) {
  const raw = process.env[name]
  if (!raw) return fallback

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getCorreiosConfig() {
  return {
    accessToken: process.env.CORREIOS_ACCESS_TOKEN || '',
    originCep: sanitizeCep(process.env.CORREIOS_ORIGIN_CEP),
    serviceCode: process.env.CORREIOS_SERVICE_CODE || DEFAULT_SERVICE_CODE,
    serviceName: process.env.CORREIOS_SERVICE_NAME || DEFAULT_SERVICE_NAME,
    apiBaseUrl: (process.env.CORREIOS_API_BASE_URL || CORREIOS_PROD_BASE_URL).replace(
      /\/$/,
      ''
    ),
    contractNumber: process.env.CORREIOS_CONTRACT_NUMBER || '',
    drCode: process.env.CORREIOS_DR_CODE || '',
    packageType: process.env.CORREIOS_PACKAGE_TYPE || DEFAULT_PACKAGE_TYPE,
    weightGramsPerItem: getEnvNumber(
      'CORREIOS_WEIGHT_GRAMS_PER_ITEM',
      DEFAULT_WEIGHT_GRAMS
    ),
    lengthCm: getEnvNumber('CORREIOS_PACKAGE_LENGTH_CM', DEFAULT_LENGTH_CM),
    widthCm: getEnvNumber('CORREIOS_PACKAGE_WIDTH_CM', DEFAULT_WIDTH_CM),
    baseHeightCm: getEnvNumber('CORREIOS_PACKAGE_HEIGHT_CM', DEFAULT_HEIGHT_CM),
    extraHeightPerItemCm: getEnvNumber(
      'CORREIOS_EXTRA_HEIGHT_PER_ITEM_CM',
      DEFAULT_EXTRA_HEIGHT_PER_ITEM_CM
    ),
  }
}

function buildPackageParams(itemCount: number) {
  const config = getCorreiosConfig()
  const safeCount = Math.max(1, itemCount)
  const totalWeight = Math.max(
    config.weightGramsPerItem * safeCount,
    config.weightGramsPerItem
  )
  const totalHeight = Math.max(
    config.baseHeightCm + Math.max(0, safeCount - 1) * config.extraHeightPerItemCm,
    1
  )

  return {
    packageType: config.packageType,
    weightGrams: String(Math.round(totalWeight)),
    lengthCm: String(Math.round(config.lengthCm)),
    widthCm: String(Math.round(config.widthCm)),
    heightCm: String(Math.round(totalHeight)),
  }
}

export function hasCorreiosCredentials() {
  const config = getCorreiosConfig()
  return Boolean(
    config.accessToken &&
      config.originCep &&
      /^\d{8}$/.test(config.originCep) &&
      config.serviceCode
  )
}

export async function quoteCorreiosShipping({
  destinationCep,
  itemCount,
}: CorreiosQuoteInput): Promise<ShippingQuote> {
  const config = getCorreiosConfig()
  const sanitizedDestination = sanitizeCep(destinationCep)

  if (!config.accessToken) {
    throw new Error('CORREIOS_ACCESS_TOKEN nao configurado.')
  }

  if (!config.originCep || !/^\d{8}$/.test(config.originCep)) {
    throw new Error('CORREIOS_ORIGIN_CEP nao configurado corretamente.')
  }

  if (!/^\d{8}$/.test(sanitizedDestination)) {
    throw new Error('CEP de destino invalido para cotacao dos Correios.')
  }

  const packageParams = buildPackageParams(itemCount)
  const url = new URL(
    `${config.apiBaseUrl}/preco/v1/nacional/${encodeURIComponent(config.serviceCode)}`
  )

  url.searchParams.set('cepDestino', sanitizedDestination)
  url.searchParams.set('cepOrigem', config.originCep)
  url.searchParams.set('psObjeto', packageParams.weightGrams)
  url.searchParams.set('tpObjeto', packageParams.packageType)
  url.searchParams.set('comprimento', packageParams.lengthCm)
  url.searchParams.set('largura', packageParams.widthCm)
  url.searchParams.set('altura', packageParams.heightCm)

  if (config.contractNumber) {
    url.searchParams.set('nuContrato', config.contractNumber)
  }

  if (config.drCode) {
    url.searchParams.set('nuDR', config.drCode)
  }

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${config.accessToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Correios respondeu com status ${response.status}.`)
  }

  const payload = (await response.json()) as CorreiosPriceResponse
  const amount = parseMoney(payload.pcFinal)

  if (amount === null) {
    throw new Error('Os Correios nao retornaram um valor de frete valido.')
  }

  return {
    amount,
    source: 'correios',
    serviceCode: payload.coProduto || config.serviceCode,
    serviceName: config.serviceName,
    message: `Frete em tempo real via Correios (${config.serviceName}).`,
  }
}
