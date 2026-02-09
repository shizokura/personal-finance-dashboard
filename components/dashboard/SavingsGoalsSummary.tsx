'use client'

import type { SavingsGoal, CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { getProgressColor } from '@/lib/utils/savings-goal-utils'
import { Target, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import CardContainer from '@/components/layout/CardContainer'

interface SavingsGoalsSummaryProps {
  goals: SavingsGoal[]
  currency: CurrencyCode
}

export default function SavingsGoalsSummary({
  goals,
  currency,
}: SavingsGoalsSummaryProps) {
  const activeGoals = goals.filter((g) => g.status !== 'completed')
  const overdueGoals = activeGoals.filter((g) => g.status === 'overdue')
  const displayGoals = activeGoals.slice(0, 3)

  return (
    <CardContainer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <span>Savings Goals</span>
          </div>
          {overdueGoals.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{overdueGoals.length} overdue</span>
            </div>
          )}
        </div>
      }
    >
      {activeGoals.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No active savings goals.{' '}
          <Link
            href="/budgets?tab=savings"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Create your first goal
          </Link>{' '}
          to start tracking progress.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {displayGoals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {goal.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(goal.currentAmount, currency)} of{' '}
                      {formatCurrency(goal.targetAmount, currency)}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {goal.percentage.toFixed(0)}%
                    </span>
                  </div>
                  {goal.status === 'overdue' && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>Past deadline</span>
                    </div>
                  )}
                </div>
                {goal.status === 'completed' && (
                  <div className="text-green-600 dark:text-green-400">✓</div>
                )}
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor(
                    goal.status
                  )}`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}

          {activeGoals.length > 3 && (
            <Link
              href="/budgets?tab=savings"
              className="flex items-center justify-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>View all {activeGoals.length} goals</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </CardContainer>
  )
}
