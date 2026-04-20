import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-provider'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ToastProvider } from '@/components/toast-provider'
import { getCurrentUser } from '@/lib/auth'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'INOVANERD - Universo Anime | Camisetas e Bonecos Colecionaveis',
  description:
    'Seu destino para produtos de anime de qualidade. Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos.',
  keywords: ['anime', 'camisetas', 'bonecos', 'colecionaveis', 'otaku', 'naruto', 'geek'],
  authors: [{ name: 'INOVANERD' }],
  creator: 'INOVANERD',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName: 'INOVANERD',
    title: 'INOVANERD - Universo Anime',
    description: 'Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-1000x1000-6tjLo2yxeQMs5E7GRStyp5JjcH6DXt.png',
        width: 1000,
        height: 1000,
        alt: 'INOVANERD Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INOVANERD - Universo Anime',
    description: 'Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialUser = await getCurrentUser()

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-background text-foreground">
        <ToastProvider>
          <AuthProvider initialUser={initialUser}>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
