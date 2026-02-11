'use client'

import { useState, useEffect } from 'react'
import type { Transaction, Category } from '@/lib/types'
import {
  calculateMonthlySummary,
  calculateBudgetProgress,
  filterTransactionsByPeriod,
  filterTransactionsByStatus,
  filterTransactionsByTypes,
} from '@/lib/calculations'
import storage, { storageEvents } from '@/lib/storage'
import {
  PeriodSelector,
  IncomeVsExpenses,
  BudgetHealth,
  InsightsAlerts,
  SpendingTrends,
  CategoryBreakdown,
  getPeriodDateRange,
} from '@/components/insights'
import { getDefaultPeriod } from '@/components/insights/PeriodSelector'
import EmptyState from '@/components/ui/EmptyState'

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [period, setPeriod] = useState(() => getDefaultPeriod())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      setTransactions(storage.getTransactions())
      setCategories(storage.getCategories())
      setIsLoading(false)
    }

    const handleUpdate = () => {
      setTransactions(storage.getTransactions())
      setCategories(storage.getCategories())
    }

    loadData()

    storageEvents.on('transactions', handleUpdate)
    storageEvents.on('categories', handleUpdate)

    return () => {
      storageEvents.off('transactions', handleUpdate)
      storageEvents.off('categories', handleUpdate)
    }
  }, [])

  const handlePeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-zinc-500">Loading insights...</div>
      </div>
    )
  }

  const dateRange = getPeriodDateRange(period)
  const filteredTransactions = filterTransactionsByPeriod(
    transactions,
    dateRange
  )
  const completedTransactions = filterTransactionsByStatus(
    filteredTransactions,
    'completed'
  )
  const validTransactions = filterTransactionsByTypes(completedTransactions, [
    'income',
    'expense',
    'refund',
  ])

  if (validTransactions.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Insights
          </h1>
          <PeriodSelector value={period} onChange={handlePeriodChange} />
        </div>

        <EmptyState
          message="No transactions found for this period."
          action={{
            label: 'Add Entry',
            href: '/add-entry',
          }}
        />
      </div>
    )
  }

  const startDate = new Date(dateRange.start)

  const currentMonthSummary = calculateMonthlySummary(
    startDate.getMonth() + 1,
    startDate.getFullYear(),
    transactions,
    categories
  )

  const previousMonthDate = new Date(startDate)
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
  const previousMonthSummary = calculateMonthlySummary(
    previousMonthDate.getMonth() + 1,
    previousMonthDate.getFullYear(),
    transactions,
    categories
  )

  const budgetProgress = calculateBudgetProgress(
    transactions,
    categories,
    dateRange
  )

  const expenseBreakdown = currentMonthSummary.expenseBreakdown.byCategory

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Insights
        </h1>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <IncomeVsExpenses
            currentMonth={currentMonthSummary}
            previousMonth={previousMonthSummary}
          />
        </div>

        <div className="lg:col-span-2">
          <SpendingTrends transactions={transactions} period={period} />
        </div>

        <div>
          <CategoryBreakdown
            transactions={validTransactions}
            categories={categories}
            type="expense"
            title="Expense Breakdown"
          />
        </div>

        <div>
          <CategoryBreakdown
            transactions={validTransactions}
            categories={categories}
            type="income"
            title="Income Breakdown"
          />
        </div>

        <div className="lg:col-span-2">
          <BudgetHealth budgets={budgetProgress} />
        </div>

        <div className="lg:col-span-2">
          <InsightsAlerts
            currentMonth={currentMonthSummary}
            previousMonth={previousMonthSummary}
            expenseBreakdown={expenseBreakdown}
            budgetProgress={budgetProgress}
          />
        </div>
      </div>
    </div>
  )
}
