import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import DevTools from '@/components/DevTools'
import ScrollToTop from '@/components/ScrollToTop'
import SkipLink from '@/components/SkipLink'
import CurrencySetup from '@/components/CurrencySetup'
import { ThemeProvider } from '@/contexts/ThemeContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Personal Finance Dashboard',
  description: 'Track your finances with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SkipLink />
          <Header />
          <ScrollToTop />
          <CurrencySetup />
          <div
            id="main-content"
            className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          >
            {children}
          </div>
          <DevTools />
        </ThemeProvider>
      </body>
    </html>
  )
}
