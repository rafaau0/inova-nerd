import { RegisterForm } from '@/components/register-form'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const params = await searchParams
  const redirectTo = params.redirectTo || '/minha-conta'

  return (
    <main className="min-h-screen pt-[110px] px-6">
      <div className="max-w-lg mx-auto">
        <RegisterForm redirectTo={redirectTo} />
      </div>
    </main>
  )
}
