import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

import './globals.css'

// #region agent log
if (process.env.CURSOR_DEBUG_SESSION === '62d8ff') {
  fetch('http://127.0.0.1:7319/ingest/c21559ae-6357-4698-af7f-3b7c9acdd88e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '62d8ff' },
    body: JSON.stringify({
      sessionId: '62d8ff',
      runId: 'build-hang-1',
      hypothesisId: 'H1',
      location: 'app/layout.tsx:9',
      message: 'layout module: before next/font/google init',
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {})
}
// #endregion agent log

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// #region agent log
if (process.env.CURSOR_DEBUG_SESSION === '62d8ff') {
  fetch('http://127.0.0.1:7319/ingest/c21559ae-6357-4698-af7f-3b7c9acdd88e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '62d8ff' },
    body: JSON.stringify({
      sessionId: '62d8ff',
      runId: 'build-hang-1',
      hypothesisId: 'H1',
      location: 'app/layout.tsx:33',
      message: 'layout module: after next/font/google init',
      data: { playfairVar: playfair.variable, interVar: inter.variable },
      timestamp: Date.now(),
    }),
  }).catch(() => {})
}
// #endregion agent log

export const metadata: Metadata = {
  title: 'The Pioneers High School | The Institute for Quality Education',
  description:
    'The Pioneers High School - A premier private K-12 academic institution committed to academic excellence, discipline, and holistic student development.',
}

export const viewport: Viewport = {
  themeColor: '#800020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
