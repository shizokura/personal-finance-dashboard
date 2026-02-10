'use client'

import { useMemo } from 'react'
import type { Transaction, Category } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils/format-utils'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
  limit?: number
}

export default function RecentTransactions({
  transactions,
  categories,
  limit = 5,
}: RecentTransactionsProps) {
  const sortedTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit),
    [transactions, limit]
  )

  const getCategory = (categoryId: string) =>
    categories.find((cat) => cat.id === categoryId)

  interface IconProps {
    className?: string
    style?: React.CSSProperties
  }

  if (sortedTransactions.length === 0) {
    return (
      <CardContainer title="Recent Transactions">
        <EmptyState
          variant="empty"
          message="No transactions yet"
          action={{
            label: 'Add Transaction',
            href: '/add-entry',
          }}
        />
      </CardContainer>
    )
  }

  return (
    <CardContainer>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recent Transactions
        </h2>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {transactions.length} total
        </span>
      </div>
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => {
          const category = getCategory(transaction.categoryId)
          const isIncome = transaction.type === 'income'
          const IconComponent = (
            Icons as unknown as Record<string, React.ComponentType<IconProps>>
          )[kebabToPascal(category?.icon || 'circle')]
          const LucideIcon =
            IconComponent || (Icons.Circle as React.ComponentType<IconProps>)

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: category?.color
                    ? `${category.color}20`
                    : '#e5e7eb',
                }}
              >
                <LucideIcon
                  className="h-5 w-5"
                  style={{ color: category?.color || '#6b7280' }}
                />
              </div>
              <div className="flex min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {transaction.description}
                </p>
                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {category?.name || 'Uncategorized'}
                  {' • '}
                  {formatDate(transaction.date)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p
                  className={`text-sm font-semibold ${
                    isIncome
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount, 'USD')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/transactions"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View all transactions →
        </Link>
      </div>
    </CardContainer>
  )
}
