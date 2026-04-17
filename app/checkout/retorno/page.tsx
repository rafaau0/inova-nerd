import Link from 'next/link'
import { updateOrderPayment } from '@/lib/server-store'

interface CheckoutReturnPageProps {
  searchParams: Promise<{
    order_id?: string
    status?: string
  }>
}

const statusCopy = {
  success: {
    title: 'Pagamento recebido',
    body: 'O Mercado Pago informou que o pagamento foi aprovado. Seu pedido ja foi marcado como confirmado.',
  },
  pending: {
    title: 'Pagamento pendente',
    body: 'O pagamento ainda esta em analise ou aguardando a conclusao no Mercado Pago.',
  },
  failure: {
    title: 'Pagamento nao concluido',
    body: 'O checkout foi interrompido ou recusado. Voce pode voltar e tentar novamente.',
  },
} as const

export default async function CheckoutReturnPage({
  searchParams,
}: CheckoutReturnPageProps) {
  const { order_id: orderId, status = 'pending' } = await searchParams
  const content =
    statusCopy[status as keyof typeof statusCopy] ?? statusCopy.pending

  if (orderId && status === 'success') {
    await updateOrderPayment(orderId, {
      paymentProvider: 'mercado_pago',
      paymentStatus: 'paid',
      status: 'confirmed',
    })
  }

  if (orderId && status === 'failure') {
    await updateOrderPayment(orderId, {
      paymentProvider: 'mercado_pago',
      paymentStatus: 'failed',
      status: 'cancelled',
    })
  }

  return (
    <main className="min-h-screen pt-[100px] px-6">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-10">
        <span className="inline-flex px-3 py-1 rounded-full bg-orange/10 text-orange text-sm font-semibold mb-4">
          Checkout Mercado Pago
        </span>
        <h1 className="font-display text-4xl text-foreground mb-4">{content.title}</h1>
        <p className="text-muted-foreground mb-6">{content.body}</p>
        {orderId && (
          <p className="text-sm text-muted-foreground mb-8">
            Pedido: <span className="text-foreground font-semibold">{orderId}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background"
          >
            Voltar para a loja
          </Link>
          <Link
            href="/carrinho"
            className="px-6 py-3 rounded-xl font-bold border border-border text-foreground"
          >
            Ir para o carrinho
          </Link>
        </div>
      </div>
    </main>
  )
}
