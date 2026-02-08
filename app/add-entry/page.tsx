'use client'

import TransactionForm from '@/components/TransactionForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AddEntryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Add Transaction
          </h1>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Record your income or expense transactions
          </p>

          <TransactionForm />
        </div>
      </div>
    </div>
  )
}
