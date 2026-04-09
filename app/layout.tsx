import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Barlow, Barlow_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/cart-provider'
import { ToastProvider } from '@/components/toast-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'INOVANERD - Universo Anime | Camisetas e Bonecos Colecionaveis',
  description: 'Seu destino para produtos de anime de qualidade. Camisetas exclusivas e bonecos colecionaveis dos seus animes favoritos. Arte, paixao e cultura otaku.',
  keywords: ['anime', 'camisetas', 'bonecos', 'colecionaveis', 'otaku', 'naruto', 'one piece', 'geek'],
  authors: [{ name: 'INOVANERD' }],
  creator: 'INOVANERD',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://inovanerd.com.br',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ToastProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
