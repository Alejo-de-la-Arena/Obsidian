import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider'
import { Nav } from '@/components/nav/Nav'
import { CustomCursor } from '@/components/ui/CustomCursor'
import './globals.css'

// Solo cargar weights realmente usados: 500 (subheadlines/medium) y 700 (display).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '700'],
})

// Mono solo en 500 — labels y eyebrows.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['500'],
})

export const metadata: Metadata = {
  title: {
    default: 'OBSIDIAN — Relojes mecánicos de autor',
    template: '%s | OBSIDIAN',
  },
  description:
    'Relojes mecánicos de edición limitada, hechos a mano en Buenos Aires. Máximo 50 unidades por modelo. USD 2.800 a USD 8.500.',
  keywords: [
    'relojes mecánicos',
    'edición limitada',
    'relojes de autor',
    'relojería artesanal',
    'Buenos Aires',
    'NOIR',
    'ALBA',
    'FORGE',
  ],
  authors: [{ name: 'OBSIDIAN' }],
  creator: 'OBSIDIAN',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'OBSIDIAN',
    title: 'OBSIDIAN — Relojes mecánicos de autor',
    description:
      'Relojes mecánicos de edición limitada, hechos a mano en Buenos Aires. Un objeto hecho. No fabricado.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OBSIDIAN — Relojes mecánicos de autor',
    description: 'Relojes mecánicos de edición limitada, hechos a mano en Buenos Aires.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
    >
      <body className="bg-obsidian-black text-bone antialiased">
        <CustomCursor />
        <Nav />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
