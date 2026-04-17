import type { ShippingDestination } from './types'

const FREE_SHIPPING_SUBTOTAL = 199

const stateFreightTable: Record<string, number> = {
  GO: 12.9,
  DF: 14.9,
  MT: 18.9,
  MS: 18.9,
  MG: 20.9,
  SP: 22.9,
  RJ: 22.9,
  ES: 22.9,
  PR: 24.9,
  SC: 24.9,
  RS: 24.9,
  BA: 27.9,
  SE: 27.9,
  AL: 27.9,
  PE: 27.9,
  PB: 27.9,
  RN: 27.9,
  CE: 27.9,
  PI: 27.9,
  MA: 27.9,
  TO: 27.9,
  AC: 32.9,
  AP: 32.9,
  AM: 32.9,
  PA: 32.9,
  RO: 32.9,
  RR: 32.9,
}

function normalizeText(value?: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function isCatalaoGoias(destination?: ShippingDestination) {
  const cidade = normalizeText(destination?.cidade)
  const estado = normalizeText(destination?.estado).toUpperCase()
  return cidade === 'catalao' && estado === 'GO'
}

export function calculateShipping(
  subtotal: number,
  destination?: ShippingDestination
) {
  if (subtotal >= FREE_SHIPPING_SUBTOTAL) {
    return 0
  }

  if (isCatalaoGoias(destination)) {
    return 0
  }

  const estado = normalizeText(destination?.estado).toUpperCase()
  if (estado && stateFreightTable[estado] !== undefined) {
    return stateFreightTable[estado]
  }

  return 19.9
}

export function hasResolvedShippingDestination(destination?: ShippingDestination) {
  return Boolean(destination?.cidade && destination?.estado)
}
