import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'

import './globals.css'

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

import { prisma } from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  let schoolName = 'The Pioneers High School';
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'schoolName' } });
    if (setting?.value) schoolName = setting.value;
  } catch (e) {
    // Ignore db err during build
  }
  return {
    title: `${schoolName} | The Institute for Quality Education`,
    description: `${schoolName} - A premier private K-12 academic institution committed to academic excellence, discipline, and holistic student development.`
  }
}

export const viewport: Viewport = {
  themeColor: '#800020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let lang = "en";
  let defaultTheme = "light";

  try {
    const langSet = await prisma.setting.findUnique({ where: { key: 'portalPreferences.language' } });
    if (langSet?.value) lang = langSet.value;

    const themeSet = await prisma.setting.findUnique({ where: { key: 'portalPreferences.darkMode' } });
    if (themeSet?.value === 'true') defaultTheme = "dark";
  } catch (e) { }

  return (
    <html lang={lang} className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
