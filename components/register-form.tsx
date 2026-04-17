'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface RegisterFormProps {
  redirectTo?: string
}

interface CepLookupResponse {
  success: boolean
  error?: string
  data?: {
    cep: string
    endereco: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
}

export function RegisterForm({ redirectTo = '/minha-conta' }: RegisterFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  useEffect(() => {
    const cepDigits = form.cep.replace(/\D/g, '')
    if (cepDigits.length !== 8) return

    let cancelled = false

    const lookupCep = async () => {
      setIsLoadingCep(true)
      setError('')

      try {
        const response = await fetch(`/api/address/cep/${cepDigits}`)
        const result = (await response.json()) as CepLookupResponse

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Nao foi possivel localizar o CEP.')
        }

        if (cancelled) return

        setForm((prev) => ({
          ...prev,
          cep: result.data?.cep || prev.cep,
          endereco: result.data?.endereco || prev.endereco,
          complemento: prev.complemento || result.data?.complemento || '',
          bairro: result.data?.bairro || prev.bairro,
          cidade: result.data?.cidade || prev.cidade,
          estado: result.data?.estado || prev.estado,
        }))
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Nao foi possivel localizar o CEP.')
      } finally {
        if (!cancelled) {
          setIsLoadingCep(false)
        }
      }
    }

    void lookupCep()

    return () => {
      cancelled = true
    }
  }, [form.cep])

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

      router.push(redirectTo)
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
        ['cep', 'CEP', 'text'],
        ['endereco', 'Endereco', 'text'],
        ['numero', 'Numero', 'text'],
        ['bairro', 'Bairro', 'text'],
        ['cidade', 'Cidade', 'text'],
        ['estado', 'Estado', 'text'],
        ['complemento', 'Complemento', 'text'],
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

      {isLoadingCep && <p className="text-sm text-muted-foreground">Buscando endereco pelo CEP...</p>}

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
        <Link href={`/entrar?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-orange font-semibold">
          Fazer login
        </Link>
      </p>
    </form>
  )
}
