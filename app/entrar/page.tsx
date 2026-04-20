import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/login-form'
import { getCurrentUser } from '@/lib/auth'

function getSafeRedirectPath(value: string | undefined, fallback: string) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value === '/entrar' || value.startsWith('/entrar?') ? fallback : value
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const params = await searchParams
  const currentUser = await getCurrentUser()
  const accountPath = currentUser?.role === 'admin' ? '/admin' : '/minha-conta'
  const redirectTo = getSafeRedirectPath(params.redirectTo, accountPath)

  if (currentUser) {
    redirect(redirectTo)
  }

  return (
    <main className="min-h-screen pt-[110px] px-6">
      <div className="max-w-lg mx-auto">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  )
}
