import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'

export default async function AdminPage() {
  await requireAdmin()

  return (
    <main className="pt-[100px] px-6 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-foreground">PAINEL ADMIN</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie a loja sem editar arquivos manualmente.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['/admin/produtos', 'Produtos', 'Cadastrar, editar e ajustar estoque.'],
            ['/admin/cupons', 'Cupons', 'Criar regras de desconto e ativacao.'],
            ['/admin/pedidos', 'Pedidos', 'Acompanhar pagamentos e entregas.'],
          ].map(([href, title, description]) => (
            <Link
              key={href}
              href={href}
              className="bg-card border border-border rounded-3xl p-6 hover:border-orange transition-all"
            >
              <h2 className="font-display text-2xl text-foreground">{title}</h2>
              <p className="text-muted-foreground mt-3">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
