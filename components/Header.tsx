'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Plus } from 'lucide-react'
import { useEscapeKey } from '@/lib/accessibility'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  useEscapeKey(() => setIsMobileMenuOpen(false), isMobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Finance Dashboard
            </span>
          </Link>
        </div>

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="hidden md:flex md:items-center md:space-x-4"
        >
          <Link
            href="/"
            aria-current={isActive('/') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            aria-current={isActive('/transactions') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Transactions
          </Link>
          <Link
            href="/categories"
            aria-current={isActive('/categories') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Categories
          </Link>
          <Link
            href="/budgets"
            aria-current={isActive('/budgets') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Budgets
          </Link>
          <Link
            href="/insights"
            aria-current={isActive('/insights') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Insights
          </Link>
          <Link
            href="/settings"
            aria-current={isActive('/settings') ? 'page' : undefined}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Settings
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/add-entry"
            className="hidden md:flex items-center space-x-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-black"
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              aria-current={isActive('/') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 dark:text-zinc-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              aria-current={isActive('/transactions') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              href="/categories"
              aria-current={isActive('/categories') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/budgets"
              aria-current={isActive('/budgets') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Budgets
            </Link>
            <Link
              href="/insights"
              aria-current={isActive('/insights') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Insights
            </Link>
            <Link
              href="/settings"
              aria-current={isActive('/settings') ? 'page' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="mt-4 pt-4">
              <Link
                href="/add-entry"
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-zinc-900 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5" />
                <span>Add Entry</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
