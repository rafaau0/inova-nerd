import 'server-only'

import { hasCorreiosCredentials, quoteCorreiosShipping } from './correios'
import { calculateShipping, isCatalaoGoias } from './shipping'
import type { ShippingDestination, ShippingQuote } from './types'

const FREE_SHIPPING_SUBTOTAL = 199

export async function getShippingQuote(
  subtotal: number,
  destination: ShippingDestination | undefined,
  itemCount: number
): Promise<ShippingQuote> {
  if (subtotal >= FREE_SHIPPING_SUBTOTAL) {
    return {
      amount: 0,
      source: 'free',
      message: 'Frete gratis por valor minimo do pedido.',
    }
  }

  if (isCatalaoGoias(destination)) {
    return {
      amount: 0,
      source: 'free',
      message: 'Frete gratis para entregas em Catalao/GO.',
    }
  }

  const fallbackAmount = calculateShipping(subtotal, destination)

  if (!destination?.cep || !/^\d{8}$/.test(destination.cep.replace(/\D/g, ''))) {
    return {
      amount: fallbackAmount,
      source: 'fallback',
      message: 'Frete estimado ate o CEP ser informado completamente.',
    }
  }

  if (!hasCorreiosCredentials()) {
    return {
      amount: fallbackAmount,
      source: 'fallback',
      message:
        'Frete estimado. Configure as credenciais dos Correios para cotacao em tempo real.',
    }
  }

  try {
    return await quoteCorreiosShipping({
      destinationCep: destination.cep,
      itemCount,
    })
  } catch (error) {
    return {
      amount: fallbackAmount,
      source: 'fallback',
      message:
        error instanceof Error
          ? `${error.message} Usando estimativa local.`
          : 'Nao foi possivel consultar os Correios. Usando estimativa local.',
    }
  }
}
