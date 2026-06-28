import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Setitik Cultureware — Batik Cagar Budaya Semarang',
    template: '%s · Setitik',
  },
  description:
    'Batik kontemporer terinspirasi dari ornamen arsitektur bangunan cagar budaya Kota Lama Semarang. Setitik demi setitik, menjadi semakin berarti.',
  keywords: ['batik', 'cagar budaya', 'Kota Lama Semarang', 'batik tulis', 'Setitik Cultureware'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
