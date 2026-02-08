'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Plus } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              FinanceDashboard
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-1">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Transactions
          </Link>
          <Link
            href="/categories"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Categories
          </Link>
          <Link
            href="/budgets"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Budgets
          </Link>
          <Link
            href="/insights"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            Insights
          </Link>
          <Link
            href="/settings"
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
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-black">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-900 dark:text-zinc-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              href="/categories"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/budgets"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Budgets
            </Link>
            <Link
              href="/insights"
              className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Insights
            </Link>
            <Link
              href="/settings"
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
