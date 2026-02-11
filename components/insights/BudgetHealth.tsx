'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { BudgetProgress } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'

interface BudgetHealthProps {
  budgets: BudgetProgress[]
}

export default function BudgetHealth({ budgets }: BudgetHealthProps) {
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

  const warningBudgets = budgets.filter((b) => b.status === 'warning')
  const overBudgets = budgets.filter((b) => b.status === 'overBudget')

  return (
    <CardContainer>
      {budgets.length === 0 ? (
        <EmptyState variant="empty" message="No budgets set up yet" />
      ) : (
        <>
          {(warningBudgets.length > 0 || overBudgets.length > 0) && (
            <div className="mb-6 space-y-3 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                <AlertCircle className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                Alerts
              </h4>
              <div className="space-y-2">
                {overBudgets.length > 0 && (
                  <p className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="flex-shrink-0 text-red-600 dark:text-red-400">
                      •
                    </span>
                    {overBudgets.length === 1
                      ? `${overBudgets[0].categoryName} is over budget by ${formatCurrency(Math.abs(overBudgets[0].remaining), currency)}`
                      : `${overBudgets.length} categories are over budget`}
                  </p>
                )}
                {warningBudgets.length > 0 && (
                  <p className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="flex-shrink-0 text-yellow-600 dark:text-yellow-400">
                      •
                    </span>
                    {warningBudgets.length === 1
                      ? `${warningBudgets[0].categoryName} is approaching its budget`
                      : `${warningBudgets.length} categories are approaching their budget limits`}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {budgets.map((budget) => (
              <div key={budget.categoryId}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {budget.categoryName}
                      </span>
                      {budget.status === 'onTrack' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
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
                    {budget.remaining >= 0
                      ? `${formatCurrency(budget.remaining, currency)} remaining`
                      : `${formatCurrency(Math.abs(budget.remaining), currency)} over`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </CardContainer>
  )
}
