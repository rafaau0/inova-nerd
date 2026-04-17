'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    telefone: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const result = (await response.json()) as { success: boolean; error?: string }
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Nao foi possivel criar a conta.')
      }

      router.push('/minha-conta')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel criar a conta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-5">
      <div>
        <h1 className="font-display text-4xl text-foreground">CRIAR CONTA</h1>
        <p className="text-muted-foreground mt-2">
          Cadastre-se para salvar seus pedidos e acompanhar tudo em um so lugar.
        </p>
      </div>

      {[
        ['nome', 'Nome completo', 'text'],
        ['email', 'E-mail', 'email'],
        ['password', 'Senha', 'password'],
        ['cpf', 'CPF', 'text'],
        ['telefone', 'Telefone', 'text'],
      ].map(([key, label, type]) => (
        <label className="block" key={key}>
          <span className="text-sm text-foreground font-medium">{label}</span>
          <input
            type={type}
            value={form[key as keyof typeof form]}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [key]: event.target.value }))
            }
            className="w-full mt-1 px-4 py-3 bg-muted border border-border rounded-xl"
          />
        </label>
      ))}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background disabled:opacity-50"
      >
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </button>

      <p className="text-sm text-muted-foreground">
        Ja tem conta?{' '}
        <Link href="/entrar" className="text-orange font-semibold">
          Fazer login
        </Link>
      </p>
    </form>
  )
}
