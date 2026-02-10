'use client'

import { useState, useMemo } from 'react'
import type { TransactionFilter } from '@/lib/types'
import { filterTransactions } from '@/lib/calculations/filter-helpers'
import TransactionList from '@/components/transactions/TransactionList'
import TransactionFilterPanel from '@/components/transactions/TransactionFilterPanel'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import storage from '@/lib/storage'
import { Plus } from 'lucide-react'
import { useAsyncLoader } from '@/lib/hooks'

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilter>({
    searchQuery: '',
    categories: [],
    dateRange: undefined,
  })

  const {
    data: dataLoaded,
    error,
    reload: loadData,
  } = useAsyncLoader({
    loader: () => ({
      transactions: storage.getTransactions(),
      categories: storage.getCategories(),
    }),
  })

  const allTransactions = useMemo(
    () => dataLoaded?.transactions || [],
    [dataLoaded]
  )
  const categories = useMemo(() => dataLoaded?.categories || [], [dataLoaded])

  const filteredTransactions = useMemo(() => {
    if (!dataLoaded) return []
    return filterTransactions(allTransactions, filters, categories)
  }, [allTransactions, filters, categories, dataLoaded])

  const handleFilterChange = (newFilters: TransactionFilter) => {
    setFilters(newFilters)
  }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg md:text-xl lg:text-2xl">
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
          <EmptyState
            variant={error ? 'error' : 'loading'}
            message={
              error ? 'Failed to load transactions' : 'Loading transactions...'
            }
            action={
              error
                ? {
                    label: 'Retry',
                    onClick: loadData,
                  }
                : undefined
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg md:text-xl lg:text-2xl">
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

        <TransactionFilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          totalCount={allTransactions.length}
          filteredCount={filteredTransactions.length}
        />

        <TransactionList filters={filters} />
      </div>
    </div>
  )
}
