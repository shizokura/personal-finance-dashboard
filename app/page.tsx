'use client'

import { useState } from 'react'
import type { CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import {
  goToNextMonth,
  goToPreviousMonth as goToPreviousMonthHelper,
  goToCurrentMonth as goToCurrentMonthHelper,
  isCurrentMonth,
} from '@/lib/utils/month-helpers'
import {
  MetricCard,
  BreakdownList,
  BudgetProgress,
  TrendTable,
  RecentTransactions,
} from '@/components/dashboard'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useDashboardData } from './dashboard/hooks'
import { MONTH_NAMES } from '@/lib/constants'

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [baseCurrency] = useState<CurrencyCode>('USD')

  const now = new Date()
  const { summary, trends, comparison, transactions, categories, isLoading } =
    useDashboardData({
      currentMonth,
      currentYear,
      baseCurrency,
    })

  const handlePreviousMonth = () => {
    const { month, year } = goToPreviousMonthHelper(currentMonth, currentYear)
    setCurrentMonth(month)
    setCurrentYear(year)
  }

  const handleNextMonth = () => {
    const result = goToNextMonth(
      currentMonth,
      currentYear,
      now.getMonth() + 1,
      now.getFullYear()
    )
    if (result) {
      setCurrentMonth(result.month)
      setCurrentYear(result.year)
    }
  }

  const handleCurrentMonth = () => {
    const { month, year } = goToCurrentMonthHelper()
    setCurrentMonth(month)
    setCurrentYear(year)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Overview of your financial health
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-1.5 dark:border-zinc-600">
                <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {MONTH_NAMES[currentMonth - 1]} {currentYear}
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={
                  currentMonth === now.getMonth() + 1 &&
                  currentYear === now.getFullYear()
                }
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {!isCurrentMonth(currentMonth, currentYear) ? (
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Go to Today
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Net Balance"
              value={
                summary
                  ? formatCurrency(summary.netSavings, baseCurrency)
                  : '$0.00'
              }
              color={summary && summary.netSavings >= 0 ? 'green' : 'red'}
            />
            <MetricCard
              label="Monthly Income"
              value={
                summary
                  ? formatCurrency(summary.monthlyIncome, baseCurrency)
                  : '$0.00'
              }
              color="green"
              trend={
                comparison
                  ? {
                      value: comparison.change.incomePercentage,
                      isPositive: comparison.change.income >= 0,
                    }
                  : undefined
              }
            />
            <MetricCard
              label="Monthly Expenses"
              value={
                summary
                  ? formatCurrency(summary.monthlyExpenses, baseCurrency)
                  : '$0.00'
              }
              color="red"
              trend={
                comparison
                  ? {
                      value: comparison.change.expensesPercentage,
                      isPositive: comparison.change.expenses <= 0,
                    }
                  : undefined
              }
            />
            <MetricCard
              label="Savings Rate"
              value={summary ? `${summary.savingsRate.toFixed(1)}%` : '0.0%'}
              color={summary && summary.savingsRate >= 0 ? 'green' : 'red'}
              trend={
                comparison
                  ? {
                      value: comparison.change.savingsRate,
                      isPositive: comparison.change.savingsRate >= 0,
                    }
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BreakdownList
              title="Expense Breakdown"
              breakdown={summary?.expenseBreakdown.byCategory || []}
              currency={baseCurrency}
            />
            <BreakdownList
              title="Income Breakdown"
              breakdown={summary?.incomeBreakdown.byCategory || []}
              currency={baseCurrency}
            />
          </div>

          <BudgetProgress
            budgets={summary?.budgetProgress || []}
            currency={baseCurrency}
          />

          <TrendTable
            trends={trends}
            currency={baseCurrency}
            comparison={comparison || undefined}
          />

          <RecentTransactions
            transactions={transactions}
            categories={categories}
            limit={5}
          />
        </>
      )}
    </div>
  )
}
