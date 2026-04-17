export default function FaqPage() {
  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 space-y-6">
        <h1 className="font-display text-4xl text-foreground">FAQ</h1>
        {[
          ['Como acompanho meu pedido?', 'Pela pagina Minha Conta, com login ativo.'],
          ['Quais formas de pagamento existem?', 'Mercado Pago, com cartao, Pix e boleto.'],
          ['Como funciona o frete?', 'Frete gratis para compras acima de R$ 199.'],
        ].map(([question, answer]) => (
          <div key={question}>
            <h2 className="font-semibold text-foreground">{question}</h2>
            <p className="text-muted-foreground mt-2">{answer}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
