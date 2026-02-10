'use client'

import type { BudgetProgress } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'

interface BudgetProgressProps {
  budgets: BudgetProgress[]
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  const currency = 'USD' as const
  const statusColors = {
    onTrack:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    overBudget: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  const progressColors = {
    onTrack: 'bg-green-600 dark:bg-green-400',
    warning: 'bg-yellow-600 dark:bg-yellow-400',
    overBudget: 'bg-red-600 dark:bg-red-400',
  }

  return (
    <CardContainer title="Budget Progress">
      {budgets.length === 0 ? (
        <EmptyState variant="empty" message="No budgets set up yet" />
      ) : (
        <div className="mt-4 space-y-4">
          {budgets.map((budget) => (
            <div key={budget.categoryId}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {budget.categoryName}
                  </span>
                  <div className="mt-0.5 flex items-center gap-3 text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Spent: {formatCurrency(budget.spent, currency)}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Limit: {formatCurrency(budget.budgetLimit, currency)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(budget.remaining, currency)}{' '}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      remaining
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[budget.status]}`}
                  >
                    {budget.status === 'onTrack'
                      ? 'On Track'
                      : budget.status === 'warning'
                        ? 'Warning'
                        : 'Over Budget'}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full transition-all duration-300 ${progressColors[budget.status]}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>{budget.percentage.toFixed(1)}% used</span>
                <span>
                  {budget.percentage > 100
                    ? `${budget.percentage.toFixed(1)}% - ${Math.abs(budget.percentage - 100).toFixed(1)}% over`
                    : budget.percentage >= 80
                      ? `${budget.percentage.toFixed(1)}% - approaching limit`
                      : `${budget.percentage.toFixed(1)}% - on track`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContainer>
  )
}
