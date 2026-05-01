import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RegisterServiceWorker from '@/components/RegisterServiceWorker'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanTeck — Gestão Financeira',
  description: 'Controle suas finanças pessoais de forma simples e eficiente.',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinanTeck',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  )
}
