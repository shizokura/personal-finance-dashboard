'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Transaction, TransactionFilter } from '@/lib/types'
import { filterTransactions } from '@/lib/calculations/filter-helpers'
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination'
import { usePagination } from '@/lib/hooks/usePagination'
import TransactionCard from './TransactionCard'
import TransactionModal from './TransactionModal'
import DeleteConfirmation from './DeleteConfirmation'
import Pagination from '@/components/ui/Pagination'
import storage, { storageEvents } from '@/lib/storage'
import { ArrowUp, ArrowDown, FolderOpen } from 'lucide-react'

interface TransactionListProps {
  filters?: TransactionFilter
}

export default function TransactionList({ filters }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories] = useState(storage.getCategories())
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >()
  const [deletingTransaction, setDeletingTransaction] = useState<
    Transaction | undefined
  >()

  useEffect(() => {
    const loadTransactions = () => {
      setTransactions(storage.getTransactions())
    }

    loadTransactions()

    const unsubscribe = storageEvents.on('transactions', loadTransactions)

    return () => {
      unsubscribe?.()
    }
  }, [])

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filters || {}, categories)
  }, [transactions, filters, categories])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) =>
      sortDirection === 'desc'
        ? b.date.getTime() - a.date.getTime()
        : a.date.getTime() - b.date.getTime()
    )
  }, [filteredTransactions, sortDirection])

  const {
    currentPage,
    totalPages,
    startRange,
    endRange,
    offset,
    setCurrentPage,
  } = usePagination({
    totalItems: sortedTransactions.length,
    itemsPerPage: ITEMS_PER_PAGE,
  })

  const paginatedTransactions = sortedTransactions.slice(
    offset,
    offset + ITEMS_PER_PAGE
  )

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction)
  }

  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      storage.deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(undefined)
    }
  }

  const getCategoryForTransaction = (transaction: Transaction) => {
    return categories.find((cat) => cat.id === transaction.categoryId)
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-700 dark:bg-zinc-800">
        <FolderOpen className="mb-3 h-12 w-12 text-zinc-400" />
        <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {transactions.length === 0
            ? 'No transactions yet'
            : 'No transactions match your filters'}
        </h3>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {transactions.length === 0
            ? 'Get started by adding your first transaction'
            : 'Try adjusting your search or filters'}
        </p>
        {transactions.length === 0 && (
          <a
            href="/add-entry"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add Transaction
          </a>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() =>
            setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
          }
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {sortDirection === 'desc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          {sortDirection === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      <div className="space-y-2">
        {paginatedTransactions.map((transaction) => {
          const category = getCategoryForTransaction(transaction)
          return (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              categoryIcon={category?.icon}
              categoryName={category?.name}
              categoryColor={category?.color}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startRange={startRange}
        endRange={endRange}
        totalItems={sortedTransactions.length}
        onPageChange={setCurrentPage}
      />

      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(undefined)}
          transaction={editingTransaction}
        />
      )}

      {deletingTransaction && (
        <DeleteConfirmation
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(undefined)}
          onConfirm={handleConfirmDelete}
          transaction={deletingTransaction}
        />
      )}
    </>
  )
}
