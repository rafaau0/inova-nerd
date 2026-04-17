'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/minha-conta' }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = (await response.json()) as { success: boolean; error?: string }
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Nao foi possivel entrar.')
      }

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-5">
      <div>
        <h1 className="font-display text-4xl text-foreground">ENTRAR</h1>
        <p className="text-muted-foreground mt-2">
          Use sua conta para acompanhar pedidos e acessar a area do cliente.
        </p>
      </div>

      <label className="block">
        <span className="text-sm text-foreground font-medium">E-mail</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full mt-1 px-4 py-3 bg-muted border border-border rounded-xl"
          placeholder="voce@exemplo.com"
        />
      </label>

      <label className="block">
        <span className="text-sm text-foreground font-medium">Senha</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full mt-1 px-4 py-3 bg-muted border border-border rounded-xl"
          placeholder="Sua senha"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-orange to-orange-dark text-background disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-sm text-muted-foreground">
        Ainda nao tem conta?{' '}
        <Link href={`/cadastro?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-orange font-semibold">
          Criar agora
        </Link>
      </p>
    </form>
  )
}
