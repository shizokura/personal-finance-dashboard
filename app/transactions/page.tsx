'use client'

import TransactionList from '@/components/transactions/TransactionList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              View and manage all your transactions
            </p>
          </div>
          <Link
            href="/add-entry"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Link>
        </div>

        <TransactionList />
      </div>
    </div>
  )
}
